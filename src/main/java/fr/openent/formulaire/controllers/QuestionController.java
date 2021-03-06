package fr.openent.formulaire.controllers;

import fr.openent.formulaire.Formulaire;
import fr.openent.formulaire.security.AccessRight;
import fr.openent.formulaire.security.CreationRight;
import fr.openent.formulaire.security.ShareAndOwner;
import fr.openent.formulaire.service.QuestionService;
import fr.openent.formulaire.service.impl.DefaultQuestionService;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;

import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;

public class QuestionController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);
    private final QuestionService questionService;

    public QuestionController() {
        super();
        this.questionService = new DefaultQuestionService();
    }

    @Get("/forms/:formId/questions")
    @ApiDoc("List all the questions of a specific form")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void list(HttpServerRequest request) {
        String formId = request.getParam("formId");
        questionService.list(formId, arrayResponseHandler(request));
    }

    @Get("/forms/:formId/questions/count")
    @ApiDoc("Count the number of questions in a specific form")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void countQuestions(HttpServerRequest request) {
        String formId = request.getParam("formId");
        questionService.countQuestions(formId, defaultResponseHandler(request));
    }

    @Get("/questions/:questionId")
    @ApiDoc("Get a specific question by id")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void get(HttpServerRequest request) {
        String questionId = request.getParam("questionId");
        questionService.get(questionId, defaultResponseHandler(request));
    }

    @Get("/forms/:formId/questions/:position")
    @ApiDoc("Get a specific question by position in a specific form")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getByPosition(HttpServerRequest request) {
        String formId = request.getParam("formId");
        String position = request.getParam("position");
        questionService.getByPosition(formId, position, defaultResponseHandler(request));
    }

    @Post("/forms/:formId/questions")
    @ApiDoc("Create a question in a specific form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void create(HttpServerRequest request) {
        String formId = request.getParam("formId");
        RequestUtils.bodyToJson(request, question -> {
            questionService.create(question, formId, defaultResponseHandler(request));
        });
    }

    @Post("/forms/:formId/questions/multiple")
    @ApiDoc("Create several questions in a specific form")
    @ResourceFilter(CreationRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void createMultiple(HttpServerRequest request) {
        String formId = request.getParam("formId");
        RequestUtils.bodyToJsonArray(request, questions -> {
            questionService.createMultiple(questions, formId, arrayResponseHandler(request));
        });
    }

    @Put("/questions/:questionId")
    @ApiDoc("Update a specific question")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void update(HttpServerRequest request) {
        String questionId = request.getParam("questionId");
        RequestUtils.bodyToJson(request, question -> {
            questionService.update(questionId, question, defaultResponseHandler(request));
        });
    }

    @Delete("/questions/:questionId")
    @ApiDoc("Delete a specific question")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void delete(HttpServerRequest request) {
        String questionId = request.getParam("questionId");
        questionService.delete(questionId, defaultResponseHandler(request));
    }
}