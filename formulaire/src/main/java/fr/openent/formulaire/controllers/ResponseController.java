package fr.openent.formulaire.controllers;

import fr.openent.form.core.enums.QuestionTypes;
import fr.openent.form.core.models.Question;
import fr.openent.form.core.models.QuestionChoice;
import fr.openent.form.core.models.Response;
import fr.openent.form.helpers.IModelHelper;
import fr.openent.formulaire.export.*;
import fr.openent.formulaire.security.AccessRight;
import fr.openent.formulaire.security.CustomShareAndOwner;
import fr.openent.formulaire.service.*;
import fr.openent.formulaire.service.impl.*;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.storage.Storage;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static fr.openent.form.core.constants.Constants.*;
import static fr.openent.form.core.constants.DistributionStatus.FINISHED;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.ShareRights.CONTRIB_RESOURCE_RIGHT;
import static fr.openent.form.core.constants.ShareRights.RESPONDER_RESOURCE_RIGHT;
import static fr.openent.form.helpers.RenderHelper.*;
import static fr.openent.form.helpers.UtilsHelper.getIds;
import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;

public class ResponseController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(ResponseController.class);
    private final Storage storage;
    private final ResponseService responseService;
    private final FormService formService;
    private final QuestionService questionService;
    private final QuestionChoiceService questionChoiceService;
    private final DistributionService distributionService;
    private final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy");
    private final SimpleDateFormat timeFormatter = new SimpleDateFormat("HH:mm");

    public ResponseController(Storage storage) {
        super();
        this.storage = storage;
        this.responseService = new DefaultResponseService();
        this.formService = new DefaultFormService();
        this.questionService = new DefaultQuestionService();
        this.questionChoiceService = new DefaultQuestionChoiceService();
        this.distributionService = new DefaultDistributionService();
    }

    @Get("/questions/:questionId/responses")
    @ApiDoc("List all the responses to a specific question")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void list(HttpServerRequest request) {
        String questionId = request.getParam(PARAM_QUESTION_ID);
        String nbLines = request.params().get(PARAM_NB_LINES);
        String formId = request.params().get(PARAM_FORM_ID);

        distributionService.listByFormAndStatus(formId, FINISHED, nbLines)
            .onSuccess(result -> responseService.list(questionId, nbLines, IModelHelper.toJsonArray(result), arrayResponseHandler(request)))
            .onFailure(err -> {
                String errorMessage = "[Formulaire@ResponseController::list] Failed to list responses for question  with id " + questionId;
                log.error(errorMessage + " " + err.getMessage());
                renderError(request);
            });
    }

    @Get("/questions/:questionId/distributions/:distributionId/responses")
    @ApiDoc("List all my responses to a specific question for a specific distribution")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void listMineByDistribution(HttpServerRequest request) {
        String questionId = request.getParam(PARAM_QUESTION_ID);
        String distributionId = request.getParam(PARAM_DISTRIBUTION_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@listMineByDistribution] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }
            responseService.listMineByDistribution(questionId, distributionId, user, arrayResponseHandler(request));
        });
    }

    @Get("/distributions/:distributionId/responses/multiple")
    @ApiDoc("List all responses for a specific distribution and questions list")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void listMineByDistributionAndQuestions(HttpServerRequest request) {
        String distributionId = request.getParam(PARAM_DISTRIBUTION_ID);

        JsonArray questionIds = new JsonArray();
        for (Integer i = 0; i < request.params().size(); i++) {
            questionIds.add(request.getParam(i.toString()));
        }
        if (questionIds.size() <= 0) {
            log.error("[Formulaire@ResponseController::listMineByDistributionAndQuestions] No question to return a response");
            noContent(request);
            return;
        }

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> responseService.listMineByQuestionsIds(questionIds, distributionId, user.getUserId()))
            .onSuccess(responses -> renderJson(request, new JsonArray(responses)))
            .onFailure(err -> {
                String errMessage = "[Formulaire@ResponseController::listMineByDistributionAndQuestions] Failed to list responses";
                log.error(errMessage + " : " + err.getMessage());
                renderError(request);
            });
    }

    @Get("/distributions/:distributionId/responses")
    @ApiDoc("List all responses for a specific distribution")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void listByDistribution(HttpServerRequest request) {
        String distributionId = request.getParam(PARAM_DISTRIBUTION_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@listByDistribution] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }
            responseService.listByDistribution(distributionId, arrayResponseHandler(request));
        });
    }

    @Get("/forms/:formId/responses")
    @ApiDoc("List all the responses to a specific form")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void listByForm(HttpServerRequest request) {
        String formId = request.params().get(PARAM_FORM_ID);
        responseService.listByForm(formId)
            .onSuccess(result -> renderJson(request, new JsonArray(result)))
            .onFailure(err -> {
                String errorMessage = "[Formulaire@ResponseController::listByForm] Failed to list response for form with id " + formId;
                log.error(errorMessage + " " + err.getMessage());
                renderError(request);
            });
    }

    @Get("/responses/count")
    @ApiDoc("Count responses by questionId")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void countByQuestions(HttpServerRequest request){
        JsonArray questionIds = new JsonArray();
        for (Integer i = 0; i < request.params().size(); i++) {
            questionIds.add(request.getParam(i.toString()));
        }
        if (questionIds.size() <= 0) {
            log.error("[Formulaire@countByQuestions] No questionIds to count.");
            noContent(request);
            return;
        }
        responseService.countByQuestions(questionIds, defaultResponseHandler(request));
    }

    @Post("/questions/:questionId/responses")
    @ApiDoc("Create a response")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void create(HttpServerRequest request) {
        String questionId = request.getParam(PARAM_QUESTION_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@ResponseController::create] User not found in session.";
                log.error(message);
                unauthorized(request);
                return;
            }

            RequestUtils.bodyToJson(request, response -> {
                if (response == null || response.isEmpty()) {
                    log.error("[Formulaire@ResponseController::create] No response to create.");
                    noContent(request);
                    return;
                }

                questionService.get(questionId, questionEvt -> {
                    if (questionEvt.isLeft()) {
                        String message = "[Formulaire@ResponseController::create] Fail to get question " +
                                "corresponding to id " + questionId + " : " + questionEvt.left().getValue();
                        log.error(message);
                        renderInternalError(request, questionEvt);
                        return;
                    }
                    if (questionEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@ResponseController::create] No question found for id " + questionId;
                        log.error(message);
                        notFound(request);
                        return;
                    }

                    Question question = new Question(questionEvt.right().getValue());
                    Integer choice_id = response.getInteger(CHOICE_ID);

                    // Check if it's a question type you can respond to
                    if (FORBIDDEN_QUESTIONS.contains(question.getQuestionType())) {
                        String message = "[Formulaire@ResponseController::create] You cannot create a response " +
                                "for a question of type " + question.getQuestionType();
                        log.error(message);
                        badRequest(request);
                        return;
                    }

                    // If there is a choice it should match an existing QuestionChoice for this question
                    if (choice_id != null && CHOICES_TYPE_QUESTIONS.contains(question.getQuestionType())) {
                        questionChoiceService.get(choice_id.toString(), choiceEvt -> {
                            if (choiceEvt.isLeft()) {
                                String message = "[Formulaire@ResponseController::create] Fail to get question " +
                                        "choice corresponding to id " + choice_id + " : " + choiceEvt.left().getValue();
                                log.error(message);
                                renderInternalError(request, choiceEvt);
                                return;
                            }
                            if (choiceEvt.right().getValue().isEmpty()) {
                                String message = "[Formulaire@ResponseController::create] No choice found for id " + choice_id;
                                log.error(message);
                                notFound(request);
                                return;
                            }

                            JsonObject choice = choiceEvt.right().getValue();
                            boolean isCustomChoice = choice.getBoolean(IS_CUSTOM);

                            // Check choice validity
                            if (question.getMatrixId() != null &&
                                (!question.getMatrixId().equals(choice.getInteger(QUESTION_ID).longValue()) ||
                                !choice.getString(VALUE).equals(response.getString(ANSWER)))) {
                                String message = "[Formulaire@ResponseController::create] Wrong choice for response " + response;
                                log.error(message);
                                badRequest(request);
                                return;
                            }
                            else if (question.getMatrixId() == null &&
                                    (!question.getId().equals(choice.getInteger(QUESTION_ID).longValue()) ||
                                    (!isCustomChoice && !choice.getString(VALUE).equals(response.getString(ANSWER))))) {
                                String message = "[Formulaire@ResponseController::create] Wrong choice for response " + response;
                                log.error(message);
                                badRequest(request);
                                return;
                            }
                            createResponse(request, response, user, questionId);
                        });
                    }
                    else {
                        if (question.getQuestionType() == QuestionTypes.DATE.getCode() && response.getString(ANSWER) != null && !response.getString(ANSWER).isEmpty()) {
                            try { dateFormatter.parse(response.getString(ANSWER)); }
                            catch (ParseException e) { e.printStackTrace(); }
                        }
                        if (question.getQuestionType() == QuestionTypes.TIME.getCode() && response.getString(ANSWER) != null && !response.getString(ANSWER).isEmpty()) {
                            try { timeFormatter.parse(response.getString(ANSWER)); }
                            catch (ParseException e) { e.printStackTrace(); }
                        }
                        createResponse(request, response, user, questionId);
                    }
                });
            });
        });
    }

    private void createResponse(HttpServerRequest request, JsonObject response, UserInfos user, String questionId) {
        Integer distributionId = response.getInteger(DISTRIBUTION_ID, null);
        Integer choiceId = response.getInteger(CHOICE_ID, null);
        String answer = response.getString(ANSWER, null);

        responseService.listMineByDistribution(questionId, distributionId.toString(), user, listEvt -> {
            if (listEvt.isLeft()) {
                log.error("[Formulaire@ResponseController::createResponse] Fail to list responses : " + listEvt.left().getValue());
                renderInternalError(request, listEvt);
                return;
            }

            JsonArray responses = listEvt.right().getValue();
            boolean found = false;
            int i = 0;
            while (!found && i < responses.size()) {
                JsonObject r = responses.getJsonObject(i);
                boolean checkQuestionId = r.getInteger(QUESTION_ID).toString().equals(questionId);
                boolean checkResponderId = r.getString(RESPONDER_ID).equals(user.getUserId());
                boolean checkDistributionId = r.getInteger(DISTRIBUTION_ID).equals(distributionId);
                boolean checkAnswerId = r.getString(ANSWER).equals(answer);
                boolean checkChoiceId = r.getInteger(CHOICE_ID) == choiceId;
                found = checkQuestionId && checkResponderId && checkDistributionId && checkAnswerId && checkChoiceId;
                i++;
            }

            if (found) {
                String message = "[Formulaire@ResponseController::createResponse] An identical response already exists " + responses.getJsonObject(i-1);
                log.error(message);
                conflict(request);
                return;
            }

            responseService.create(response, user, questionId, defaultResponseHandler(request));
        });
    }

    @Post("/distributions/:distributionId/responses/multiple")
    @ApiDoc("Create multiple response at once")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void createMultiple(HttpServerRequest request){
        Long distributionId = Long.parseLong(request.getParam(PARAM_DISTRIBUTION_ID));

        RequestUtils.bodyToJsonArray(request, responsesJson -> {
            if (responsesJson == null || responsesJson.isEmpty()) {
                log.error("[Formulaire@ResponseController::createMultiple] No responses to create.");
                noContent(request);
                return;
            }

            List<Response> responses = IModelHelper.toList(responsesJson, Response.class);
            Map<String, Object> composeMap = new HashMap<>();

            UserUtils.getAuthenticatedUserInfos(eb, request)
                .compose(user -> {
                    composeMap.put(USER_ID, user.getUserId());
                    return checkResponsesValidity(request, responses, distributionId, user.getUserId());
                })
                .compose(existingResponses -> {
                    String userId = (String) composeMap.get(USER_ID);

                    // Search for responses duplicates of existing ones
                    boolean found = responses.stream()
                        .anyMatch(response -> {
                            Long choiceId = response.getChoiceId();
                            String answer = response.getAnswer();
                            return existingResponses.stream()
                                .anyMatch(existingResponse -> {
                                    boolean checkQuestionId = existingResponse.getQuestionId().equals(distributionId);
                                    boolean checkResponderId = existingResponse.getResponderId().equals(userId);
                                    boolean checkDistributionId = existingResponse.getDistributionId().equals(distributionId);
                                    boolean checkAnswerId = existingResponse.getAnswer().equals(answer);
                                    boolean checkChoiceId = existingResponse.getChoiceId() == choiceId;
                                    return checkQuestionId && checkResponderId && checkDistributionId && checkAnswerId && checkChoiceId;
                                });
                        });

                    if (found) {
                        String errMessage = "At least one response is duplicate of an existing one";
                        log.error("[Formulaire@ResponseController::createMultiple] " + errMessage);
                        return Future.failedFuture(errMessage);
                    }

                    return responseService.createMultiple(responses, userId);
                })
                .onSuccess(createdResponses -> render(request, createdResponses))
                .onFailure(err -> {
                    String errMessage = "[Formulaire@ResponseController::updateMultiple] Failed to update multiple responses";
                    log.error(errMessage + " : " + err.getMessage());
                    renderError(request);
                });
        });
    }

    @Put("/responses/:responseId")
    @ApiDoc("Update a specific response")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void update(HttpServerRequest request) {
        String responseId = request.getParam(PARAM_RESPONSE_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@updateResponse] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJson(request, response -> {
                if (response == null || response.isEmpty()) {
                    log.error("[Formulaire@updateResponse] No response to update.");
                    noContent(request);
                    return;
                }

                Integer questionId = response.getInteger(QUESTION_ID);
                questionService.get(questionId.toString(), questionEvt -> {
                    if (questionEvt.isLeft()) {
                        log.error("[Formulaire@updateResponse] Fail to get question corresponding to id : " + questionId);
                        renderBadRequest(request, questionEvt);
                        return;
                    }
                    if (questionEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@updateResponse] No question found for id " + questionId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    JsonObject question = questionEvt.right().getValue();
                    int question_type = question.getInteger(QUESTION_TYPE);
                    Integer choice_id = response.getInteger(CHOICE_ID);

                    // Check if it's a question type you can respond to
                    if (FORBIDDEN_QUESTIONS.contains(question_type)) {
                        String message = "[Formulaire@updateResponse] You cannot create a response for a question of type " + question_type;
                        log.error(message);
                        badRequest(request, message);
                        return;
                    }

                    // If there is a choice it should match an existing QuestionChoice for this question
                    if (choice_id != null && CHOICES_TYPE_QUESTIONS.contains(question_type)) {
                        questionChoiceService.get(choice_id.toString(), choiceEvt -> {
                            if (choiceEvt.isLeft()) {
                                log.error("[Formulaire@updateResponse] Fail to get question choice corresponding to id : " + choice_id);
                                renderBadRequest(request, choiceEvt);
                                return;
                            }
                            if (choiceEvt.right().getValue().isEmpty()) {
                                String message = "[Formulaire@updateResponse] No choice found for id " + choice_id;
                                log.error(message);
                                notFound(request, message);
                                return;
                            }

                            JsonObject choice = choiceEvt.right().getValue();

                            // Check choice validity
                            boolean isMatrixResponseInvalid = question.getInteger(MATRIX_ID) != null &&
                                    (!choice.getInteger(QUESTION_ID).equals(question.getInteger(MATRIX_ID)) ||
                                            !choice.getString(VALUE).equals(response.getString(ANSWER)));
                            boolean isCustomResponseInvalid = question.getInteger(MATRIX_ID) == null &&
                                    choice.getBoolean(IS_CUSTOM) &&
                                    !choice.getInteger(QUESTION_ID).equals(questionId);
                            boolean isClassicResponseInvalid = question.getInteger(MATRIX_ID) == null &&
                                    !choice.getBoolean(IS_CUSTOM) &&
                                    (!choice.getInteger(QUESTION_ID).equals(questionId) ||
                                            !choice.getString(VALUE).equals(response.getString(ANSWER)));

                            if (isMatrixResponseInvalid || isCustomResponseInvalid || isClassicResponseInvalid) {
                                String message ="[Formulaire@updateResponse] Wrong choice for response " + response;
                                log.error(message);
                                badRequest(request, message);
                                return;
                            }

                            responseService.update(user, responseId, response, defaultResponseHandler(request));
                        });
                    }
                    else {
                        if (question_type == QuestionTypes.DATE.getCode() && response.getString(ANSWER) != null && !response.getString(ANSWER).isEmpty()) {
                            try { dateFormatter.parse(response.getString(ANSWER)); }
                            catch (ParseException e) { e.printStackTrace(); }
                        }
                        if (question_type == QuestionTypes.TIME.getCode() && response.getString(ANSWER) != null && !response.getString(ANSWER).isEmpty()) {
                            try { timeFormatter.parse(response.getString(ANSWER)); }
                            catch (ParseException e) { e.printStackTrace(); }
                        }
                        responseService.update(user, responseId, response, defaultResponseHandler(request));
                    }
                });
            });
        });
    }

    @Put("/distributions/:distributionId/responses")
    @ApiDoc("Update multiple response at once")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void updateMultiple(HttpServerRequest request) {
        Long distributionId = Long.parseLong(request.getParam(PARAM_DISTRIBUTION_ID));

        RequestUtils.bodyToJsonArray(request, responsesJson -> {
            if (responsesJson == null || responsesJson.isEmpty()) {
                log.error("[Formulaire@ResponseController::updateMultiple] No responses to update");
                noContent(request);
                return;
            }

            List<Response> responses = IModelHelper.toList(responsesJson, Response.class);
            Map<String, Object> composeMap = new HashMap<>();

            UserUtils.getAuthenticatedUserInfos(eb, request)
                .compose(user -> {
                    composeMap.put(USER_ID, user.getUserId());
                    return checkResponsesValidity(request, responses, distributionId, (String) composeMap.get(USER_ID));
                })
                .compose(existingResponses -> {
                    List<Long> responseIds = responses.stream().map(Response::getId).collect(Collectors.toList());
                    List<Long> existingResponseIds = existingResponses.stream().map(Response::getId).collect(Collectors.toList());
                    if (responseIds.stream().anyMatch(responseId -> !existingResponseIds.contains(responseId))) {
                        String errMessage = "Some responseIds are wrong";
                        log.error("[Formulaire@ResponseController::checkResponsesValidity] " + errMessage);
                        unauthorized(request);
                        return Future.failedFuture(errMessage);
                    }
                    return responseService.updateMultiple(responses, (String) composeMap.get(USER_ID));
                })
                .onSuccess(updatedResponses -> render(request, updatedResponses))
                .onFailure(err -> {
                    String errMessage = "[Formulaire@ResponseController::updateMultiple] Failed to update multiple responses";
                    log.error(errMessage + " : " + err.getMessage());
                    if (!request.isEnded()) renderError(request);
                });
        });
    }

    Future<List<Response>> checkResponsesValidity (HttpServerRequest request, List<Response> responses, Long distributionId, String userId) {
        Promise<List<Response>> promise = Promise.promise();

        List<Long> distributionIds = responses.stream().map(Response::getDistributionId).collect(Collectors.toList());
        if (distributionIds.stream().anyMatch(distribId -> !Objects.equals(distribId, distributionId))) {
            String errMessage = "Some distributionIds are wrong";
            log.error("[Formulaire@ResponseController::checkResponsesValidity] " + errMessage);
            unauthorized(request);
            promise.fail(errMessage);
            return promise.future();
        }

        List<Long> questionIds = responses.stream().map(Response::getQuestionId).collect(Collectors.toList());
        Map<String, Object> composeMap = new HashMap<>();

        questionService.listByIds(questionIds)
            .compose(questions -> {
                // Check if there are forbidden questions type
                if (questions.stream().anyMatch(question -> FORBIDDEN_QUESTIONS.contains(question.getQuestionType()))) {
                    String errMessage = "You cannot update a response for a question of a forbidden type";
                    log.error("[Formulaire@ResponseController::checkResponsesValidity] " + errMessage);
                    badRequest(request);
                    return Future.failedFuture(errMessage);
                }

                composeMap.put(QUESTIONS, questions);
                return questionChoiceService.listChoices(new JsonArray(questionIds));
            })
            .compose(choices -> {
                List<Question> questions = (List<Question>) composeMap.get(QUESTIONS);

                // If there are choices they should match existing QuestionChoice
                boolean hasWrongResponses = responses.stream()
                    .anyMatch(response -> {
                        Question question = questions.stream()
                            .filter(q -> q.getId().equals(response.getQuestionId()))
                            .findFirst()
                            .orElse(null);
                        QuestionChoice choice = choices.stream()
                            .filter(qc -> qc.getId().equals(response.getChoiceId()))
                            .findFirst()
                            .orElse(null);

                        if (question == null) return true;
                        if (choice != null && CHOICES_TYPE_QUESTIONS.contains(question.getQuestionType())) {
                            boolean isWrongMatrixResponse = question.getMatrixId() != null && (!question.getMatrixId().equals(choice.getQuestionId()) || !choice.getValue().equals(response.getAnswer()));
                            boolean isWrongCustomResponse = question.getMatrixId() == null && !question.getId().equals(choice.getQuestionId()) || (!choice.getIsCustom() && !choice.getValue().equals(response.getAnswer()));
                            return isWrongMatrixResponse || isWrongCustomResponse;
                        }

                        return false;
                    });

                if (hasWrongResponses) {
                    String errMessage = "Some responses have the wrong data (question or choices)";
                    log.error("[Formulaire@ResponseController::checkResponsesValidity] " + errMessage);
                    badRequest(request);
                    return Future.failedFuture(errMessage);
                }

                return responseService.listMineByQuestionsIds(new JsonArray(questionIds), distributionId.toString(), userId);
            })
            .onSuccess(promise::complete)
            .onFailure(err -> {
                String errMessage = "[Formulaire@ResponseController::checkResponsesValidity] Failed to check responses validity";
                log.error(errMessage + " : " + err.getMessage());
                if (!request.isEnded()) renderError(request);
                promise.fail(err.getMessage());
            });

        return promise.future();
    }

    @Delete("/responses/:formId")
    @ApiDoc("Delete specific responses")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void delete(HttpServerRequest request) {
        String formId = request.getParam(PARAM_FORM_ID);
        RequestUtils.bodyToJsonArray(request, responses -> {
            if (responses == null || responses.isEmpty()) {
                log.error("[Formulaire@deleteResponses] No responses to delete.");
                noContent(request);
                return;
            }

            responseService.delete(getIds(responses), formId, arrayResponseHandler(request));
        });
    }

    @Delete("/responses/:distributionId/questions/:questionId")
    @ApiDoc("Delete responses of a specific question")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void deleteByQuestionAndDistribution(HttpServerRequest request) {
        String distributionId = request.getParam(PARAM_DISTRIBUTION_ID);
        String questionId = request.getParam(PARAM_QUESTION_ID);
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@ResponseController::deleteByQuestionAndDistribution] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            responseService.deleteByQuestionAndDistribution(questionId, distributionId, user, arrayResponseHandler(request));
        });
    }

    @Delete("/responses/:distributionId/questions")
    @ApiDoc("Delete multiple responses of a specific distribution")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void deleteMultipleByQuestionAndDistribution(HttpServerRequest request) {
        String distributionId = request.getParam(PARAM_DISTRIBUTION_ID);

        RequestUtils.bodyToJsonArray(request, questionIdsJson -> {
            if (questionIdsJson == null || questionIdsJson.isEmpty()) {
                log.error("[Formulaire@ResponseController::deleteMultipleByDistribution] No questionIds to delete responses");
                noContent(request);
                return;
            }

            List<Long> questionIds = questionIdsJson.stream().map(Object::toString).map(Long::parseLong).collect(Collectors.toList());
            responseService.deleteByQuestionsAndDistribution(questionIds, distributionId)
                .onSuccess(result -> ok(request))
                .onFailure(err -> {
                    String errMessage = "[Formulaire@ResponseController::deleteMultipleByDistribution] Failed to delete multiple responses";
                    log.error(errMessage + " : " + err.getMessage());
                    renderError(request);
                });
        });
    }

    // Exports

    @Post("/responses/export/:formId/:fileType")
    @ApiDoc("Export a specific form's responses into a file (CSV or PDF)")
    @ResourceFilter(CustomShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void export(final HttpServerRequest request) {
        String fileType = request.getParam(PARAM_FILE_TYPE);
        String formId = request.getParam(PARAM_FORM_ID);
        RequestUtils.bodyToJson(request, images -> {
            UserUtils.getUserInfos(eb, request, user -> {
                if (user == null) {
                    String message = "[Formulaire@exportResponses] User not found in session.";
                    log.error(message);
                    unauthorized(request, message);
                    return;
                }

                formService.get(formId, user, formEvt -> {
                    if (formEvt.isLeft()) {
                        log.error("[Formulaire@exportResponses] Error in getting form to export responses of form " + formId);
                        renderInternalError(request, formEvt);
                        return;
                    }
                    if (formEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@exportResponses] No form found for id " + formId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    switch (fileType) {
                        case CSV:
                            new FormResponsesExportCSV(request, formEvt.right().getValue()).launch();
                            break;
                        case PDF:
                            JsonObject form = formEvt.right().getValue();
                            form.put(IMAGES, images);
                            new FormResponsesExportPDF(request, vertx, config, storage, form).launch();
                            break;
                        default:
                            String message = "[Formulaire@export] Wrong export format type : " + fileType;
                            log.error(message);
                            badRequest(request, message);
                            break;
                    }
                });
            });
        });
    }
}