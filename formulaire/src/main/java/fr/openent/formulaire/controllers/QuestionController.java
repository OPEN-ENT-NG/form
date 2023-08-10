package fr.openent.formulaire.controllers;

import fr.openent.form.core.enums.I18nKeys;
import fr.openent.form.core.enums.QuestionTypes;
import fr.openent.form.core.models.ApiVersion;
import fr.openent.form.core.models.Question;
import fr.openent.form.core.models.QuestionSpecificFields;
import fr.openent.form.helpers.BusResultHelper;
import fr.openent.form.helpers.I18nHelper;
import fr.openent.form.helpers.IModelHelper;
import fr.openent.form.helpers.UtilsHelper;
import fr.openent.formulaire.helpers.ApiVersionHelper;
import fr.openent.formulaire.security.AccessRight;
import fr.openent.formulaire.security.CustomShareAndOwner;
import fr.openent.formulaire.service.*;
import fr.openent.formulaire.service.impl.*;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.user.UserUtils;

import java.util.*;
import java.util.stream.Collectors;

import static fr.openent.form.core.constants.Constants.CONDITIONAL_QUESTIONS;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.ShareRights.CONTRIB_RESOURCE_RIGHT;
import static fr.openent.form.core.constants.ShareRights.READ_RESOURCE_RIGHT;
import static fr.openent.form.core.enums.ApiVersions.*;
import static fr.openent.form.helpers.RenderHelper.renderInternalError;
import static fr.openent.form.helpers.UtilsHelper.getByProp;
import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;

public class QuestionController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);
    private final QuestionService questionService;
    private final SectionService sectionService;
    private final QuestionSpecificFieldsService questionSpecificFieldsService;
    private final FormService formService;
    private final DistributionService distributionService;

    public QuestionController() {
        super();
        this.questionService = new DefaultQuestionService();
        this.sectionService = new DefaultSectionService();
        this.questionSpecificFieldsService = new DefaultQuestionSpecificFieldsService();
        this.formService = new DefaultFormService();
        this.distributionService = new DefaultDistributionService();
    }

    @Get("/forms/:formId/questions")
    @ApiDoc("List all the questions of a specific form")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = READ_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void listForForm(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        ApiVersion apiVersion = new ApiVersion(RequestUtils.acceptVersion(request));
        boolean shouldAdaptDataToApiVersionTwo = apiVersion.isBefore(TWO_ZERO);

        questionService.listForForm(formId, listQuestionsEvt -> {
            if (listQuestionsEvt.isLeft()) {
                log.error("[Formulaire@QuestionController::listForForm] Fail to list questions for form with id " + formId + " : " + listQuestionsEvt);
                renderError(request);
                return;
            }

            JsonArray questions = listQuestionsEvt.right().getValue();
            questionSpecificFieldsService.syncQuestionSpecs(questions)
                .onSuccess(result -> {
                    if (shouldAdaptDataToApiVersionTwo) result = ApiVersionHelper.formatQuestions(result);
                    renderJson(request, result);
                })
                .onFailure(error -> {
                    String errMessage = "[Formulaire@QuestionController::listForForm] Failed to sync specifics for question of form with id " + formId;
                    log.error(errMessage + " : " + error.getMessage());
                    renderError(request);
                });
        });
    }

    @Get("/sections/:sectionId/questions")
    @ApiDoc("List all the questions of a specific section")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = READ_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void listForSection(HttpServerRequest request) {
        String sectionId = request.getParam(PARAM_SECTION_ID);
        ApiVersion apiVersion = new ApiVersion(RequestUtils.acceptVersion(request));
        boolean shouldAdaptDataToApiVersionTwo = apiVersion.isBefore(TWO_ZERO);

        questionService.listForSection(sectionId, getQuestionEvt -> {
            if (getQuestionEvt.isLeft()) {
                String errMessage = "[Formulaire@QuestionController::listForSection] Fail to list questions for section with id " + sectionId;
                log.error(errMessage + " : " + getQuestionEvt.left().getValue());
                renderError(request);
                return;
            }

            JsonArray questions = getQuestionEvt.right().getValue();
            questionSpecificFieldsService.syncQuestionSpecs(questions)
                .onSuccess(result -> {
                    if (shouldAdaptDataToApiVersionTwo) result = ApiVersionHelper.formatQuestions(result);
                    renderJson(request, result);
                })
                .onFailure(error -> {
                    String errMessage = "[Formulaire@QuestionController::listForSection] Failed to list questions section with id " + sectionId;
                    log.error(errMessage + " : " + error.getMessage());
                    renderError(request);
                });
        });
    }

    @Get("/forms/:formId/questions/all")
    @ApiDoc("List all the questions of a specific form")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = READ_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void listForFormAndSection(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        ApiVersion apiVersion = new ApiVersion(RequestUtils.acceptVersion(request));
        boolean shouldAdaptDataToApiVersionTwo = apiVersion.isBefore(TWO_ZERO);

        questionService.listForFormAndSection(formId)
            .compose(questions -> questionSpecificFieldsService.syncQuestionSpecs(questions))
            .onSuccess(result -> {
                if (shouldAdaptDataToApiVersionTwo) result = ApiVersionHelper.formatQuestions(result);
                renderJson(request, result);
            })
            .onFailure(error -> {
                String errorMessage = "[Formulaire@QuestionController::listForFormAndSection] " +
                        "Failed to list questions for form and sections";
                log.error(errorMessage + " : " + error.getMessage());
                renderError(request);
            });
    }

    @Get("/questions/children")
    @ApiDoc("List all the children questions of a list of questions")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void listChildren(HttpServerRequest request) {
        JsonArray questionIds = new JsonArray();
        for (Integer i = 0; i < request.params().size(); i++) {
            questionIds.add(request.getParam(i.toString()));
        }
        if (questionIds.size() <= 0) {
            log.error("[Formulaire@listChildren] No questionIds to get children.");
            noContent(request);
            return;
        }
        questionService.listChildren(questionIds, arrayResponseHandler(request));
    }

    @Get("/questions/:questionId")
    @ApiDoc("Get a specific question by id")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void get(HttpServerRequest request) {
        String questionId = request.getParam(PARAM_QUESTION_ID);
        ApiVersion apiVersion = new ApiVersion(RequestUtils.acceptVersion(request));
        boolean shouldAdaptDataToApiVersionTwo = apiVersion.isBefore(TWO_ZERO);

        questionService.get(questionId, getQuestionEvt -> {
            if (getQuestionEvt.isLeft()) {
                String errMessage = "[Formulaire@QuestionController::get] Failed to get question with id " + questionId;
                log.error(errMessage + " : " + getQuestionEvt.left().getValue());
                renderError(request);
                return;
            }

            JsonObject question = getQuestionEvt.right().getValue();
            questionSpecificFieldsService.syncQuestionSpecs(new JsonArray().add(question))
                .onSuccess(result -> {
                    if (shouldAdaptDataToApiVersionTwo) result = ApiVersionHelper.formatQuestions(result);
                    renderJson(request, result);
                })
                .onFailure(error -> {
                    String errMessage = "[Formulaire@QuestionController::get] Failed to get question and its specific " +
                            "fields for question with id " + questionId;
                    log.error(errMessage + " : " + error.getMessage());
                    renderError(request);
                });
        });
    }

    @Post("/forms/:formId/questions")
    @ApiDoc("Create a question in a specific form")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void create(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@QuestionController::create] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJsonArray(request, questionsJson -> {
                if (questionsJson == null || questionsJson.isEmpty()) {
                    log.error("[Formulaire@QuestionController::create] No question to create.");
                    noContent(request);
                    return;
                }

                List<Question> questions = IModelHelper.toList(questionsJson, Question.class).stream()
                        .filter(question -> !question.getTitle().isEmpty() && question.getFormId() == Long.parseLong(formId))
                        .collect(Collectors.toList());

                // Check section infos validity
                int i = 0;
                for (Question question : questions) {
                    Long sectionId = question.getSectionId();
                    Long sectionPosition = question.getSectionPosition();

                    if (sectionId == null ^ sectionPosition == null) { // ^ = XOR -> return true if they have different value, return false if they both have same value
                        String message = "[Formulaire@QuestionController::create] sectionId and sectionPosition must be both null or both not null : " + question;
                        log.error(message);
                        badRequest(request);
                        return;
                    }
                    else if (sectionId != null && (sectionId <= 0 || sectionPosition <= 0)) {
                        String message = "[Formulaire@QuestionController::create] sectionId and sectionPosition must have values greater than 0 : " + question;
                        log.error(message);
                        badRequest(request);
                        return;
                    }
                    else if (sectionPosition != null && question.getPosition() != null) {
                        String message = "[Formulaire@QuestionController::create] A question is either in or out of a section, it cannot have a position and a section_position : " + question;
                        log.error(message);
                        badRequest(request);
                        return;
                    }
                    else if (question.getConditional() && !CONDITIONAL_QUESTIONS.contains(question.getQuestionType())) {
                        String message = "[Formulaire@QuestionController::create] A question conditional question must be of type : " + CONDITIONAL_QUESTIONS;
                        log.error(message);
                        badRequest(request);
                        return;
                    }
                }

                formService.get(formId, user, formEvt -> {
                    if (formEvt.isLeft()) {
                        log.error("[Formulaire@QuestionController::create] Failed to get form with id " + formId + " : " + formEvt.left().getValue());
                        renderError(request);
                        return;
                    }
                    if (formEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@QuestionController::create] No form found for form with id " + formId;
                        log.error(message);
                        notFound(request);
                        return;
                    }

                    JsonObject form = formEvt.right().getValue();

                    // Check if form is not already responded
                    distributionService.countFinished(formId, countRepEvt -> {
                        if (countRepEvt.isLeft()) {
                            log.error("[Formulaire@QuestionController::create] Failed to count finished distributions " +
                                    "for form with id " + formId + " : " + countRepEvt.left().getValue());
                            renderError(request);
                            return;
                        }

                        int nbResponseTot = countRepEvt.right().getValue().getInteger(COUNT, 0);
                        if (nbResponseTot > 0) {
                            log.error("[Formulaire@QuestionController::create] You cannot create a question for a form already responded");
                            badRequest(request);
                            return;
                        }

                        // Check if the type of question if it's for a public form (type FILE is forbidden)
                        boolean hasTypeFile = questions.stream().anyMatch(question -> question.getQuestionType() == QuestionTypes.FILE.getCode());
                        if (form.getBoolean(IS_PUBLIC) && hasTypeFile) {
                            String message = "[Formulaire@QuestionController::create] You cannot create a question type FILE for the public form with id " + formId;
                            log.error(message);
                            badRequest(request, message);
                            return;
                        }

                        List<Long> questionSectionIds = questions.stream()
                                .map(question -> question.getSectionId())
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList());

                        questionService.getSectionIdsWithConditionalQuestions(formId, new JsonArray(), sectionIdsEvt -> {
                            if (sectionIdsEvt.isLeft()) {
                                log.error("[Formulaire@QuestionController::create] Failed to get section ids " +
                                        "for form with id " + formId + " : " + sectionIdsEvt.left().getValue());
                                renderError(request);
                                return;
                            }

                            JsonArray sectionIds = getByProp(sectionIdsEvt.right().getValue(), SECTION_ID);
                            questionSectionIds.retainAll(sectionIds.getList());
                            if (questionSectionIds.size() > 0) {
                                log.error("[Formulaire@QuestionController::create] A conditional question is " +
                                        "already existing for the sections with ids " + questionSectionIds);
                                badRequest(request, I18nHelper.getI18nValue(I18nKeys.ERROR_QUESTION_DUPLICATE, request));
                                return;
                            }

                            List<Future> createdQuestions = questions.stream()
                                    .map(question -> createQuestion(question, formId))
                                    .collect(Collectors.toList());

                            CompositeFuture.all(createdQuestions)
                                .onSuccess(result -> render(request, result.list()))
                                .onFailure(err -> {
                                    String errorMessage = "[Formulaire@QuestionController::create] Fail to create questions " + questions + " : " + err.getMessage();
                                    log.error(errorMessage);
                                    renderError(request);
                                });
                        });
                    });
                });
            });
        });
    }

    private Future<JsonObject> createQuestion(Question question, String formId) {
        Promise<JsonObject> promise = Promise.promise();
        Map<String,Question> promiseInfos = new HashMap<>();

        sectionService.list(formId)
            .compose(sections -> {
                // Check the question's position and if some sections already use it
                Long questionPosition = question.getPosition();
                JsonArray sectionPositions = UtilsHelper.getByProp(sections, POSITION);
                if (questionPosition != null && sectionPositions.contains(questionPosition)) {
                    String message = "Position " + questionPosition + " is already used by a section.";
                    return Future.failedFuture(message);
                }

                return questionService.create(question, formId);
            })
            .compose(createdQuestion -> {
                promiseInfos.put(QUESTION, createdQuestion.get());

                // If question is cursor type, you insert fields in a specific table
                if (question.getQuestionType() == QuestionTypes.CURSOR.getCode() && createdQuestion.isPresent()) {
                    Long questionId = createdQuestion.get().getId();
                    return questionSpecificFieldsService.create(question.getSpecificFields(), questionId);
                }

                return Future.succeededFuture(Optional.empty());
            })
            .onSuccess(specificFields -> {
                Question createdQuestion = promiseInfos.get(QUESTION);
                createdQuestion.addSpecificFields(specificFields.orElse(null));
                promise.complete(createdQuestion.toJson());
            })
            .onFailure(err -> {
                log.error("[Formulaire@QuestionController::createQuestion] Failed to create question " + question + " : " + err.getMessage());
                promise.fail(err.getMessage());
            });

        return promise.future();
    }

    @Put("/forms/:formId/questions")
    @ApiDoc("Update specific questions")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void update(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@QuestionController::update] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJsonArray(request, jsonQuestions -> {
                if (jsonQuestions == null || jsonQuestions.isEmpty()) {
                    log.error("[Formulaire@QuestionController::update] No questions to update.");
                    noContent(request);
                    return;
                }

                List<Question> questions = IModelHelper.toList(jsonQuestions, Question.class);
                // Check section infos validity
                int i = 0;
                while (i < jsonQuestions.size()) {
                    JsonObject question = jsonQuestions.getJsonObject(i);
                    Long sectionId = question.getLong(SECTION_ID);
                    Long sectionPosition = question.getLong(SECTION_POSITION);

                    if (sectionId == null ^ sectionPosition == null) { // ^ = XOR -> return true if they have different value, return false if they both have same value
                        String message = "[Formulaire@QuestionController::update] sectionId and sectionPosition must be both null or both not null : " + question;
                        log.error(message);
                        badRequest(request);
                        return;
                    } else if (sectionId != null && (sectionId <= 0 || sectionPosition <= 0)) {
                        String message = "[Formulaire@QuestionController::update] sectionId and sectionPosition must have values greater than 0 : " + question;
                        log.error(message);
                        badRequest(request);
                        return;
                    } else if (sectionPosition != null && question.getInteger(POSITION) != null) {
                        String message = "[Formulaire@QuestionController::update] A question is either in or out of a section, it cannot have a position and a section_position : " + question;
                        log.error(message);
                        badRequest(request);
                        return;
                    } else if (question.getBoolean(CONDITIONAL) && !CONDITIONAL_QUESTIONS.contains(question.getInteger(QUESTION_TYPE))) {
                        String message = "[Formulaire@QuestionController::update] A question conditional question must be of type : " + CONDITIONAL_QUESTIONS;
                        log.error(message);
                        badRequest(request);
                        return;
                    }
                    i++;
                }

                formService.get(formId, user, formEvt -> {
                    if (formEvt.isLeft()) {
                        String errMeassge = "[Formulaire@QuestionController::update] Failed to get form with id : " + formId;
                        log.error(errMeassge + " : " + formEvt.left().getValue());
                        renderError(request);
                        return;
                    }
                    if (formEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@QuestionController::update] No form found for form with id " + formId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    JsonObject form = formEvt.right().getValue();

                    // Check if the type of question if it's for a public form (type FILE is forbidden)
                    JsonArray questionTypes = getByProp(jsonQuestions, QUESTION_TYPE);
                    if (form.getBoolean(IS_PUBLIC) && questionTypes.contains(8)) {
                        String message = "[Formulaire@QuestionController::update] You cannot create a question type FILE for the public form with id " + formId;
                        log.error(message);
                        badRequest(request, message);
                        return;
                    }

                    // Check if sections of conditional questions to create already have conditional questions
                    JsonArray questionIds = UtilsHelper.getIds(jsonQuestions);
                    questionService.getSectionIdsWithConditionalQuestions(formId, questionIds, sectionIdsEvt -> {
                        if (sectionIdsEvt.isLeft()) {
                            String errMessage = "[Formulaire@QuestionController::update] Failed to get section ids for form with id" + formId;
                            log.error(errMessage + " : " + sectionIdsEvt.left().getValue());
                            renderError(request);
                            return;
                        }

                        JsonArray sectionIds = getByProp(sectionIdsEvt.right().getValue(), SECTION_ID);
                        Long conflictingSectionId = null;
                        int j = 0;
                        while (conflictingSectionId == null && j < jsonQuestions.size()) {
                            JsonObject question = jsonQuestions.getJsonObject(j);
                            if (question.getBoolean(CONDITIONAL) && sectionIds.contains(question.getLong(SECTION_ID))) {
                                conflictingSectionId = question.getLong(SECTION_ID);
                            }
                            j++;
                        }

                        if (conflictingSectionId != null) {
                            String message = "[Formulaire@QuestionController::update] A conditional question is already existing for the section with id : " + conflictingSectionId;
                            log.error(message);
                            badRequest(request, message);
                            return;
                        }

                        // If no conditional question conflict, we update
                        Map<String, List<Question>> composeInfos = new HashMap<>();
                        sectionService.list(formId)
                            .compose(sections -> {
                                JsonArray questionPositions = UtilsHelper.getByProp(jsonQuestions, POSITION);
                                JsonArray sectionPositions = UtilsHelper.getByProp(sections, POSITION);

                                List<Object> doubles = questionPositions.stream().filter(sectionPositions::contains).collect(Collectors.toList());
                                if (doubles.size() > 0) {
                                    String message = "Position(s) " + doubles + " are/is already used by some question(s).";
                                    return Future.failedFuture(message);
                                }

                                return questionService.update(formId, questions);
                            })
                            .compose(updatedQuestions -> {
                                composeInfos.put(QUESTIONS, updatedQuestions);

                                return questionSpecificFieldsService.update(questions);
                            })
                            .onSuccess(updatedSpecifics -> {
                                List<Question> updatedQuestionsAndSpecifics = UtilsHelper.mergeQuestionsAndSpecifics(composeInfos.get(QUESTIONS), updatedSpecifics);
                                renderJson(request, IModelHelper.toJsonArray(updatedQuestionsAndSpecifics));
                            })
                            .onFailure(err -> {
                                String errMessage = "[Formulaire@QuestionController::update] Failed to update questions " + jsonQuestions;
                                log.error(errMessage + " : " + err.getMessage());
                                renderError(request);
                            });
                    });
                });
            });
        });
    }

    @Delete("/questions/:questionId")
    @ApiDoc("Delete a specific question")
    @ResourceFilter(CustomShareAndOwner.class)
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