package fr.openent.formulaire.controllers;

import fr.openent.form.helpers.UtilsHelper;
import fr.openent.formulaire.security.AccessRight;
import fr.openent.formulaire.security.ShareAndOwner;
import fr.openent.formulaire.service.DistributionService;
import fr.openent.formulaire.service.FormService;
import fr.openent.formulaire.service.QuestionService;
import fr.openent.formulaire.service.impl.DefaultDistributionService;
import fr.openent.formulaire.service.impl.DefaultFormService;
import fr.openent.formulaire.service.impl.DefaultQuestionService;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.user.UserUtils;

import static fr.openent.form.core.constants.Constants.CONDITIONAL_QUESTIONS;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.ShareRights.CONTRIB_RESOURCE_RIGHT;
import static fr.openent.form.helpers.RenderHelper.renderInternalError;
import static fr.openent.form.helpers.UtilsHelper.getByProp;
import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;

public class QuestionController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);
    private final QuestionService questionService;
    private final FormService formService;
    private final DistributionService distributionService;

    public QuestionController() {
        super();
        this.questionService = new DefaultQuestionService();
        this.formService = new DefaultFormService();
        this.distributionService = new DefaultDistributionService();
    }

    @Get("/forms/:formId/questions")
    @ApiDoc("List all the questions of a specific form")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void listForForm(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        questionService.listForForm(formId, arrayResponseHandler(request));
    }

    @Get("/sections/:sectionId/questions")
    @ApiDoc("List all the questions of a specific section")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void listForSection(HttpServerRequest request) {
        String sectionId = request.getParam(PARAM_SECTION_ID);
        questionService.listForSection(sectionId, arrayResponseHandler(request));
    }

    @Get("/questions/:questionId")
    @ApiDoc("Get a specific question by id")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void get(HttpServerRequest request) {
        String questionId = request.getParam(PARAM_QUESTION_ID);
        questionService.get(questionId, defaultResponseHandler(request));
    }

    @Post("/forms/:formId/questions")
    @ApiDoc("Create a question in a specific form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void create(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@createQuestion] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJson(request, question -> {
                if (question == null || question.isEmpty()) {
                    log.error("[Formulaire@createQuestion] No question to create.");
                    noContent(request);
                    return;
                }

                Long sectionId = question.getLong(PARAM_SECTION_ID);
                Long sectionPosition = question.getLong(SECTION_POSITION);

                // Check section infos validity
                if (sectionId == null ^ sectionPosition == null) {
                    String message = "[Formulaire@createQuestion] sectionId and sectionPosition must be both null or both not null.";
                    log.error(message);
                    badRequest(request, message);
                    return;
                } else if (sectionId != null && (sectionId <= 0 || sectionPosition <= 0)) {
                    String message = "[Formulaire@createQuestion] sectionId and sectionPosition must have values greater than 0.";
                    log.error(message);
                    badRequest(request, message);
                    return;
                } else if (sectionPosition != null && question.getInteger(POSITION) != null) {
                    String message = "[Formulaire@createQuestion] A question is either in or out of a section, it cannot have a position and a section_position.";
                    log.error(message);
                    badRequest(request, message);
                    return;
                } else if (question.getBoolean(CONDITIONAL) && !CONDITIONAL_QUESTIONS.contains(question.getInteger(QUESTION_TYPE))) {
                    String message = "[Formulaire@createQuestion] A question conditional question must be of type : " + CONDITIONAL_QUESTIONS;
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                formService.get(formId, user, formEvt -> {
                    if (formEvt.isLeft()) {
                        log.error("[Formulaire@createQuestion] Failed to get form with id : " + formId);
                        renderInternalError(request, formEvt);
                        return;
                    }
                    if (formEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@createQuestion] No form found for form with id " + formId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    JsonObject form = formEvt.right().getValue();

                    // Check if form is not already responded
                    distributionService.countFinished(formId, countRepEvt -> {
                        if (countRepEvt.isLeft()) {
                            log.error("[Formulaire@createQuestion] Failed to count finished distributions form form with id : " + formId);
                            renderInternalError(request, countRepEvt);
                            return;
                        }

                        int nbResponseTot = countRepEvt.right().getValue().getInteger(COUNT, 0);
                        if (nbResponseTot > 0) {
                            String message = "[Formulaire@createQuestion] You cannot create a question for a form already responded";
                            log.error(message);
                            badRequest(request, message);
                            return;
                        }

                        // Check if the type of question if it's for a public form (type FILE is forbidden)
                        if (form.getBoolean(IS_PUBLIC) && question.getInteger(QUESTION_TYPE) != null && question.getInteger(QUESTION_TYPE) == 8) {
                            String message = "[Formulaire@createQuestion] You cannot create a question type FILE for the public form with id " + formId;
                            log.error(message);
                            badRequest(request, message);
                            return;
                        }

                        // If it's a conditional question in a section, check if another one already exists
                        if (question.getBoolean(CONDITIONAL) && sectionId != null) {
                            questionService.getSectionIdsWithConditionalQuestions(formId, new JsonArray(), sectionIdsEvt -> {
                                if (sectionIdsEvt.isLeft()) {
                                    log.error("[Formulaire@createQuestion] Failed to get section ids for form with id : " + formId);
                                    renderInternalError(request, sectionIdsEvt);
                                    return;
                                }

                                JsonArray sectionIds = getByProp(sectionIdsEvt.right().getValue(), SECTION_ID);
                                if (sectionIds.contains(sectionId)) {
                                    String message = "[Formulaire@createQuestion] A conditional question is already existing for the section with id : " + sectionId;
                                    log.error(message);
                                    badRequest(request, message);
                                    return;
                                }

                                questionService.create(question, formId, defaultResponseHandler(request));
                            });
                        }
                        else {
                            questionService.create(question, formId, defaultResponseHandler(request));
                        }
                    });
                });
            });
        });
    }

    @Put("/forms/:formId/questions")
    @ApiDoc("Update specific questions")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void update(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@updateQuestions] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJsonArray(request, questions -> {
                if (questions == null || questions.isEmpty()) {
                    log.error("[Formulaire@updateQuestions] No questions to update.");
                    noContent(request);
                    return;
                }

                // Check section infos validity
                int i = 0;
                while (i < questions.size()) {
                    JsonObject question = questions.getJsonObject(i);
                    Long sectionId = question.getLong(SECTION_ID);
                    Long sectionPosition = question.getLong(SECTION_POSITION);

                    if (sectionId == null ^ sectionPosition == null) {
                        String message = "[Formulaire@updateQuestions] sectionId and sectionPosition must be both null or both not null : " + question;
                        log.error(message);
                        badRequest(request, message);
                        return;
                    } else if (sectionId != null && (sectionId <= 0 || sectionPosition <= 0)) {
                        String message = "[Formulaire@updateQuestions] sectionId and sectionPosition must have values greater than 0 : " + question;
                        log.error(message);
                        badRequest(request, message);
                        return;
                    } else if (sectionPosition != null && question.getInteger(POSITION) != null) {
                        String message = "[Formulaire@updateQuestions] A question is either in or out of a section, it cannot have a position and a section_position : " + question;
                        log.error(message);
                        badRequest(request, message);
                        return;
                    } else if (question.getBoolean(CONDITIONAL) && !CONDITIONAL_QUESTIONS.contains(question.getInteger(QUESTION_TYPE))) {
                        String message = "[Formulaire@updateQuestions] A question conditional question must be of type : " + CONDITIONAL_QUESTIONS;
                        log.error(message);
                        badRequest(request, message);
                        return;
                    }
                    i++;
                }

                formService.get(formId, user, formEvt -> {
                    if (formEvt.isLeft()) {
                        log.error("[Formulaire@updateQuestions] Failed to get form with id : " + formId);
                        renderInternalError(request, formEvt);
                        return;
                    }
                    if (formEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@updateQuestions] No form found for form with id " + formId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    JsonObject form = formEvt.right().getValue();

                    // Check if the type of question if it's for a public form (type FILE is forbidden)
                    JsonArray questionTypes = getByProp(questions, QUESTION_TYPE);
                    if (form.getBoolean(IS_PUBLIC) && questionTypes.contains(8)) {
                        String message = "[Formulaire@updateQuestions] You cannot create a question type FILE for the public form with id " + formId;
                        log.error(message);
                        badRequest(request, message);
                        return;
                    }

                    // Check if sections of conditional questions to create already have conditional questions
                    JsonArray questionIds = UtilsHelper.getIds(questions);
                    questionService.getSectionIdsWithConditionalQuestions(formId, questionIds, sectionIdsEvt -> {
                        if (sectionIdsEvt.isLeft()) {
                            log.error("[Formulaire@updateQuestions] Failed to get section ids for form with id : " + formId);
                            renderInternalError(request, sectionIdsEvt);
                            return;
                        }

                        JsonArray sectionIds = getByProp(sectionIdsEvt.right().getValue(), SECTION_ID);
                        Long conflictingSectionId = null;
                        int j = 0;
                        while (conflictingSectionId == null && j < questions.size()) {
                            JsonObject question = questions.getJsonObject(j);
                            if (question.getBoolean(CONDITIONAL) && sectionIds.contains(question.getLong(SECTION_ID))) {
                                conflictingSectionId = question.getLong(SECTION_ID);
                            }
                            j++;
                        }

                        if (conflictingSectionId != null) {
                            String message = "[Formulaire@updateQuestions] A conditional question is already existing for the section with id : " + conflictingSectionId;
                            log.error(message);
                            badRequest(request, message);
                            return;
                        }

                        // If no conditional question conflict, we update
                        questionService.update(formId, questions, updatedQuestionsEvt -> {
                            if (updatedQuestionsEvt.isLeft()) {
                                log.error("[Formulaire@updateQuestions] Failed to update questions : " + questions);
                                renderInternalError(request, updatedQuestionsEvt);
                                return;
                            }

                            JsonArray updatedQuestionsInfos = updatedQuestionsEvt.right().getValue();
                            JsonArray updatedQuestions = new JsonArray();
                            for (int k = 0; k < updatedQuestionsInfos.size(); k++) {
                                updatedQuestions.addAll(updatedQuestionsInfos.getJsonArray(k));
                            }
                            renderJson(request, updatedQuestions);
                        });
                    });
                });
            });
        });
    }

    @Delete("/questions/:questionId")
    @ApiDoc("Delete a specific question")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void delete(HttpServerRequest request) {
        String questionId = request.getParam(PARAM_QUESTION_ID);
        questionService.get(questionId, questionsEvt -> {
            if (questionsEvt.isLeft()) {
                log.error("[Formulaire@deleteQuestion] Failed to get question with id : " + questionId);
                renderInternalError(request, questionsEvt);
                return;
            }
            questionService.delete(questionsEvt.right().getValue(), defaultResponseHandler(request));
        });
    }
}