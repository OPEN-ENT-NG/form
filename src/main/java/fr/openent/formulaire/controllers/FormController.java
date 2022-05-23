package fr.openent.formulaire.controllers;

import fr.openent.formulaire.Formulaire;
import fr.openent.formulaire.export.FormResponsesExportCSV;
import fr.openent.formulaire.export.FormResponsesExportPDF;
import fr.openent.formulaire.helpers.DataChecker;
import fr.openent.formulaire.helpers.FutureHelper;
import fr.openent.formulaire.helpers.RenderHelper;
import fr.openent.formulaire.helpers.UtilsHelper;
import fr.openent.formulaire.security.AccessRight;
import fr.openent.formulaire.security.CreationRight;
import fr.openent.formulaire.security.ResponseRight;
import fr.openent.formulaire.security.ShareAndOwner;
import fr.openent.formulaire.service.*;
import fr.openent.formulaire.service.impl.*;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.Either;
import fr.wseduc.webutils.http.Renders;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.*;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.events.EventStore;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.notification.TimelineHelper;
import org.entcore.common.storage.Storage;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;

import java.util.*;

import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;

public class FormController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(FormController.class);
    private final EventStore eventStore;
    private final Storage storage;
    private final FormService formService;
    private final DistributionService distributionService;
    private final QuestionChoiceService questionChoiceService;
    private final ResponseService responseService;
    private final ResponseFileService responseFileService;
    private final FormSharesService formShareService;
    private final FolderService folderService;
    private final RelFormFolderService relFormFolderService;
    private final NeoService neoService;
    private final NotifyService notifyService;

    public FormController(EventStore eventStore, Storage storage, TimelineHelper timelineHelper) {
        super();
        this.eventStore = eventStore;
        this.storage = storage;
        this.formService = new DefaultFormService();
        this.distributionService = new DefaultDistributionService();
        this.questionChoiceService = new DefaultQuestionChoiceService();
        this.responseService = new DefaultResponseService();
        this.responseFileService = new DefaultResponseFileService();
        this.formShareService = new DefaultFormSharesService();
        this.folderService = new DefaultFolderService();
        this.relFormFolderService = new DefaultRelFormFolderService();
        this.neoService = new DefaultNeoService();
        this.notifyService = new DefaultNotifyService(timelineHelper, eb);
    }

    // Init classic rights

    @SecuredAction(Formulaire.CREATION_RIGHT)
    public void initCreationRight(final HttpServerRequest request) {
    }

    @SecuredAction(Formulaire.RESPONSE_RIGHT)
    public void initResponseRight(final HttpServerRequest request) {
    }

    // Init sharing rights

    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void initContribResourceRight(final HttpServerRequest request) {
    }

    @SecuredAction(value = Formulaire.MANAGER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void initManagerResourceRight(final HttpServerRequest request) {
    }

    @SecuredAction(value = Formulaire.RESPONDER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void initResponderResourceRight(final HttpServerRequest request) {
    }

    // API

    @Get("/forms")
    @ApiDoc("List all the forms created by me or shared with me")
    @ResourceFilter(CreationRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void list(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@listForms] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            final List<String> groupsAndUserIds = new ArrayList<>();
            groupsAndUserIds.add(user.getUserId());
            if (user.getGroupsIds() != null) {
                groupsAndUserIds.addAll(user.getGroupsIds());
            }
            formService.list(groupsAndUserIds, user, arrayResponseHandler(request));
        });
    }

    @Get("/forms/sent")
    @ApiDoc("List all the forms sent to me")
    @ResourceFilter(ResponseRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void listSentForms(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@listSentForms] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }
            formService.listSentForms(user, arrayResponseHandler(request));
        });
    }

    @Get("/forms/linker")
    @ApiDoc("List all the forms for the linker")
    @ResourceFilter(CreationRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void listForLinker(final HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@listForLinker] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            final List<String> groupsAndUserIds = new ArrayList<>();
            groupsAndUserIds.add(user.getUserId());
            if (user.getGroupsIds() != null) {
                groupsAndUserIds.addAll(user.getGroupsIds());
            }
            formService.listForLinker(groupsAndUserIds, user, arrayResponseHandler(request));
        });
    }

    @Get("/forms/:formId")
    @ApiDoc("Get a specific form by id")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void get(HttpServerRequest request) {
        String formId = request.getParam("formId");
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@getForm] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            formService.get(formId, user, defaultResponseHandler(request));
        });
    }

    @Post("/forms")
    @ApiDoc("Create a form")
    @ResourceFilter(CreationRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void create(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@createForm] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJson(request, form -> {
                if (form == null || form.isEmpty()) {
                    log.error("[Formulaire@createForm] No form to create.");
                    noContent(request);
                    return;
                }

                // date_ending should be after date_opening if not null
                boolean areDateValid = DataChecker.checkFormDatesValidity(new JsonArray().add(form));
                if (!areDateValid) {
                    String message = "[Formulaire@createForm] You cannot create a form with a ending date before the opening date.";
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                // RGPD lifetime should be in [3, 6, 9, 12]
                boolean isRGPDLifetimeOk = DataChecker.checkRGPDLifetimeValidity(new JsonArray().add(form));
                if (!isRGPDLifetimeOk) {
                    String message = "[Formulaire@createForm] Wrong RGPD lifetime value : " + form.getInteger("rgpd_lifetime");
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                // Check if parent folder is Archive or Share folders
                Integer folderId = form.getInteger("folder_id") != null ? form.getInteger("folder_id") : Formulaire.ID_ROOT_FOLDER;
                if (folderId == Formulaire.ID_SHARED_FOLDER || folderId == Formulaire.ID_ARCHIVED_FOLDER) {
                    String message = "[Formulaire@createForm] You cannot create a folder into the folder with id : " + folderId;
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                folderService.get(folderId.toString(), folderEvt -> {
                    if (folderEvt.isLeft()) {
                        log.error("[Formulaire@createForm] Fail to get folder for id " + folderId);
                        RenderHelper.internalError(request, folderEvt);
                        return;
                    }
                    if (folderEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@createForm] No folder found for id " + folderId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    // Check if the folder is owned by the connected user (if custom folder)
                    JsonObject folder = folderEvt.right().getValue();
                    if (folderId != Formulaire.ID_ROOT_FOLDER && !folder.getString("user_id").equals(user.getUserId())) {
                        String message = "[Formulaire@createForm] Your not owner of the folder with id " + folderId;
                        log.error(message);
                        unauthorized(request, message);
                        return;
                    }

                    formService.create(form, user, createEvt -> {
                        if (createEvt.isLeft() || createEvt.right().getValue().isEmpty()) {
                            log.error("[Formulaire@createForm] Failed to create form : " + form);
                            RenderHelper.internalError(request, createEvt);
                            return;
                        }

                        eventStore.createAndStoreEvent(Formulaire.FormulaireEvent.CREATE.name(), request);
                        String formId = createEvt.right().getValue().getInteger("id").toString();
                        relFormFolderService.create(user, new JsonArray().add(formId), folderId, createRelEvt -> {
                            if (createRelEvt.isLeft() || createEvt.right().getValue().isEmpty()) {
                                log.error("[Formulaire@createForm] Failed to create relation form-folder for form : " + form);
                                RenderHelper.internalError(request, createRelEvt);
                                return;
                            }

                            if (folderId != Formulaire.ID_ROOT_FOLDER) { // We do not sync root folder counts (useless)
                                folderService.syncNbChildren(user, new JsonArray().add(folderId), syncEvt -> {
                                    if (syncEvt.isLeft()) {
                                        log.error("[Formulaire@moveForm] Error in sync children counts for folder " + folderId);
                                        RenderHelper.internalError(request, syncEvt);
                                        return;
                                    }
                                    renderJson(request, createEvt.right().getValue());
                                });
                            }
                            else {
                                renderJson(request, createEvt.right().getValue());
                            }
                        });
                    });
                });
            });
        });
    }

    @Post("/forms/multiple")
    @ApiDoc("Create several forms")
    @ResourceFilter(CreationRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void createMultiple(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@createMultipleForm] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJsonArray(request, forms -> {
                if (forms == null || forms.isEmpty()) {
                    log.error("[Formulaire@createMultipleForm] No forms to create.");
                    noContent(request);
                    return;
                }

                // date_ending should be after date_ending if not null
                boolean areDateValid = DataChecker.checkFormDatesValidity(forms);
                if (!areDateValid) {
                    String message = "[Formulaire@createMultipleForm] You cannot create a form with an ending date before the opening date.";
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                // RGPD lifetime should be in [3, 6, 9, 12]
                boolean isRGPDLifetimeOk = DataChecker.checkRGPDLifetimeValidity(forms);
                if (!isRGPDLifetimeOk) {
                    String message = "[Formulaire@createMultipleForm] A RGPD lifetime value should be in " + Formulaire.RGPD_LIFETIME_VALUES;
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                JsonArray folderIds = UtilsHelper.getByProp(forms, "folder_id");
                folderService.listByIds(folderIds, foldersEvt -> {
                    if (foldersEvt.isLeft()) {
                        log.error("[Formulaire@createMultipleForm] Fail to list folders for ids " + folderIds);
                        RenderHelper.internalError(request, foldersEvt);
                        return;
                    }
                    if (foldersEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@createMultipleForm] No folders found for ids " + folderIds;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    // Check if one of the folders is not owned by the connected user
                    JsonArray folders = foldersEvt.right().getValue();
                    boolean areUserIdsOk = DataChecker.checkFolderIdsValidity(folders, user.getUserId());
                    if (!areUserIdsOk) {
                        String message = "[Formulaire@createMultipleForm] Your not owner of one of the folders with ids " + folderIds;
                        log.error(message);
                        unauthorized(request, message);
                        return;
                    }

                    formService.createMultiple(forms, user, formsEvt -> {
                        if (formsEvt.isLeft()) {
                            log.error("[Formulaire@createMultipleForm] Failed to create forms : " + forms);
                            RenderHelper.internalError(request, formsEvt);
                            return;
                        }
                        eventStore.createAndStoreEvent(Formulaire.FormulaireEvent.CREATE.name(), request);

                        // Get result of creation
                        JsonArray createdFormsInfos = formsEvt.right().getValue();
                        JsonArray createdForms = new JsonArray();
                        for (int k = 0; k < createdFormsInfos.size(); k++) {
                            createdForms.addAll(createdFormsInfos.getJsonArray(k));
                        }

                        JsonArray formIds = UtilsHelper.getIds(createdForms, false);
                        JsonArray finalFolderIds = UtilsHelper.getByProp(forms, "folder_id");
                        relFormFolderService.createMultiple(user, formIds, finalFolderIds, createRelEvt -> {
                            if (createRelEvt.isLeft()) {
                                log.error("[Formulaire@createMultipleForm] Failed to create relations form-folder for forms : " + formIds);
                                RenderHelper.internalError(request, createRelEvt);
                                return;
                            }

                            JsonArray folderIdsToSync = new JsonArray();
                            for (int j = 0; j < finalFolderIds.size(); j++) {
                                if (finalFolderIds.getInteger(j) != Formulaire.ID_ROOT_FOLDER) {
                                    folderIdsToSync.add(finalFolderIds.getInteger(j));
                                }
                            }

                            if (folderIdsToSync.size() > 0) {
                                folderService.syncNbChildren(user, folderIdsToSync, syncEvt -> {
                                    if (syncEvt.isLeft()) {
                                        log.error("[Formulaire@createMultipleForm] Error in sync children counts for folders with ids " + folderIdsToSync);
                                        RenderHelper.internalError(request, syncEvt);
                                        return;
                                    }
                                    renderJson(request, createdForms);
                                });
                            }
                            else {
                                renderJson(request, createdForms);
                            }
                        });
                    });
                });
            });
        });
    }

    @Post("/forms/duplicate/:folderId")
    @ApiDoc("Duplicate several forms and put them into a specific folder")
    @ResourceFilter(CreationRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void duplicate(HttpServerRequest request) {
        Integer folderId = Integer.parseInt(request.getParam("folderId"));
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@duplicateForms] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJsonArray(request, formIds -> {
                if (formIds == null || formIds.isEmpty()) {
                    log.error("[Formulaire@duplicateForms] No forms to duplicate.");
                    noContent(request);
                    return;
                }

                final List<String> groupsAndUserIds = new ArrayList<>();
                groupsAndUserIds.add(user.getUserId());
                if (user.getGroupsIds() != null) {
                    groupsAndUserIds.addAll(user.getGroupsIds());
                }

                formService.checkFormsRights(groupsAndUserIds, user, Formulaire.CONTRIB_RESOURCE_BEHAVIOUR, formIds, hasRightsEvt -> {
                    if (hasRightsEvt.isLeft()) {
                        log.error("[Formulaire@duplicateForms] Fail to check rights for method " + hasRightsEvt);
                        RenderHelper.internalError(request, hasRightsEvt);
                        return;
                    }
                    if (hasRightsEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@duplicateForms] No rights found for forms with ids " + formIds;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    // Check if user is owner or contributor to all the forms
                    Long count = hasRightsEvt.right().getValue().getLong("count");
                    if (count == null || count != formIds.size()) {
                        String message = "[Formulaire@duplicateForms] You're missing rights on one form or more.";
                        log.error(message);
                        unauthorized(request, message);
                        return;
                    }

                    folderService.get(folderId.toString(), folderEvt -> {
                        if (folderEvt.isLeft()) {
                            log.error("[Formulaire@duplicateForms] Fail to get folder for id " + folderId);
                            RenderHelper.internalError(request, folderEvt);
                            return;
                        }
                        if (folderEvt.right().getValue().isEmpty()) {
                            String message = "[Formulaire@duplicateForms] No folder found for id " + folderId;
                            log.error(message);
                            notFound(request, message);
                            return;
                        }

                        // Check if the folder is not owned by the connected user
                        JsonObject folder = folderEvt.right().getValue();
                        if (folderId != Formulaire.ID_ROOT_FOLDER && !folder.getString("user_id").equals(user.getUserId())) {
                            String message = "[Formulaire@duplicateForms] You're not owner of the folder with id " + folderId;
                            log.error(message);
                            unauthorized(request, message);
                            return;
                        }

                        List<Future> formsInfos = new ArrayList<>();
                        // Duplicates form and all questions inside
                        duplicatesFormsQuestions(request, folderId, user, formIds, formsInfos);
                    });
                });
            });
        });
    }

    private void duplicatesFormsQuestions(HttpServerRequest request, Integer folderId, UserInfos user, JsonArray formIds, List<Future> formsInfos) {
        for (int i = 0; i < formIds.size(); i++) {
            Promise<JsonArray> promise = Promise.promise();
            formsInfos.add(promise.future());
            formService.duplicate(formIds.getInteger(i), user, FutureHelper.handlerJsonArray(promise));
        }
        CompositeFuture.all(formsInfos).onComplete(formsInfosEvt -> {
            if (formsInfosEvt.failed()) {
                log.error("[Formulaire@duplicateForms] Failed to retrieve info for forms with ids " + formIds);
                RenderHelper.internalError(request, formsInfosEvt);
                return;
            }
            // Duplicates all potential question choices
            duplicatesQuestionChoices(request, folderId, user, formIds, formsInfosEvt);
        });
    }

    private void duplicatesQuestionChoices(HttpServerRequest request, Integer folderId, UserInfos user, JsonArray formIds, AsyncResult<CompositeFuture> questionsEvt) {
        List<Future> questionsInfosFutures = new ArrayList<>();

        for (Object questions : questionsEvt.result().list()) {
            JsonArray questionsInfos = ((JsonArray) questions);
            if (questionsInfos.getJsonObject(0).getInteger("id") != null
            && questionsInfos.getJsonObject(0).getInteger("form_id") != null) {
                for (int i = 0; i < questionsInfos.size(); i++) {
                    JsonObject questionInfo = questionsInfos.getJsonObject(i);
                    int formId = questionInfo.getInteger("form_id");
                    int questionId = questionInfo.getInteger("id");
                    int originalQuestionId = questionInfo.getInteger("original_question_id");
                    int question_type = questionInfo.getInteger("question_type");
                    if (question_type == 4 || question_type == 5 || question_type == 9) {
                        Promise<JsonObject> promise = Promise.promise();
                        questionsInfosFutures.add(promise.future());
                        questionChoiceService.duplicate(formId, questionId, originalQuestionId, FutureHelper.handlerJsonObject(promise));
                    }
                }
            }
        }
        CompositeFuture.all(questionsInfosFutures).onComplete(choicesEvt -> {
            if (choicesEvt.failed()) {
                log.error("[Formulaire@duplicateForms] Failed to duplicate choices for questions of forms with ids " + formIds);
                RenderHelper.internalError(request, choicesEvt);
                return;
            }
            // Sync folders with this new forms
            syncFoldersForms(request, folderId, user, formIds, questionsEvt);
        });
    }

    private void syncFoldersForms(HttpServerRequest request, Integer folderId, UserInfos user, JsonArray formIds, AsyncResult<CompositeFuture> questionsEvt) {
        eventStore.createAndStoreEvent(Formulaire.FormulaireEvent.CREATE.name(), request);
        JsonArray newFormIds = new JsonArray();
        for (Object question : questionsEvt.result().list()) {
            newFormIds.add(((JsonArray) question).getJsonObject(0).getInteger("form_id"));
        }
        relFormFolderService.create(user, newFormIds, folderId, createRelEvt -> {
            if (createRelEvt.isLeft()) {
                log.error("[Formulaire@duplicateForms] Error in moving forms with ids " + formIds);
                RenderHelper.internalError(request, createRelEvt);
                return;
            }

            if (folderId != Formulaire.ID_ROOT_FOLDER) { // We do not sync root folder counts (useless)
                folderService.syncNbChildren(user, new JsonArray().add(folderId), arrayResponseHandler(request));
            }
            else {
                renderJson(request, createRelEvt.right().getValue());
            }
        });
    }

    @Put("/forms/:formId")
    @ApiDoc("Update a specific form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void update(HttpServerRequest request) {
        String formId = request.getParam("formId");
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@moveForms] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJson(request, form -> {
                if (form == null || form.isEmpty()) {
                    log.error("[Formulaire@updateForm] No form to update.");
                    noContent(request);
                    return;
                }

                // date_ending should be after date_ending if not null
                boolean areDateValid = DataChecker.checkFormDatesValidity(new JsonArray().add(form));
                if (!areDateValid) {
                    String message = "[Formulaire@updateForm] You cannot update a form with an ending date before the opening date.";
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                // RGPD lifetime should be in [3, 6, 9, 12]
                boolean isRGPDLifetimeOk = DataChecker.checkRGPDLifetimeValidity(new JsonArray().add(form));
                if (!isRGPDLifetimeOk) {
                    String message = "[Formulaire@updateForm] Wrong RGPD lifetime value : " + form.getInteger("rgpd_lifetime");
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                // Check if some properties can be changed (unable if there are already responses)
                responseService.listByForm(formId, responsesEvt -> {
                    if (responsesEvt.isLeft()) {
                        log.error("[Formulaire@updateForm] Fail to get responses for form with id " + formId);
                        RenderHelper.internalError(request, responsesEvt);
                        return;
                    }

                    if (!responsesEvt.right().getValue().isEmpty()) {
                        formService.get(formId, user, formEvt -> {
                            if (formEvt.isLeft()) {
                                log.error("[Formulaire@updateForm] Fail to get form for id " + formId);
                                RenderHelper.internalError(request, formEvt);
                                return;
                            }
                            if (formEvt.right().getValue().isEmpty()) {
                                String message = "[Formulaire@updateForm] No form found for id " + formId;
                                log.error(message);
                                notFound(request, message);
                                return;
                            }

                            // Reset props ''multiple', 'anonymous' and 'rgpd' to their current values
                            JsonObject formRef = formEvt.right().getValue();
                            form.put("multiple", formRef.getBoolean("multiple"));
                            form.put("anonymous", formRef.getBoolean("anonymous"));
                            form.put("rgpd", formRef.getBoolean("rgpd"));

                            formService.update(formId, form, defaultResponseHandler(request));
                        });
                    }
                    else {
                        formService.update(formId, form, defaultResponseHandler(request));
                    }
                });
            });
        });
    }

    @Delete("/forms/:formId")
    @ApiDoc("Delete a specific form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.MANAGER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void delete(HttpServerRequest request) {
        String formId = request.getParam("formId");
        responseFileService.listByForm(formId, responseFileIdsEvt -> {
            if (responseFileIdsEvt.isLeft()) {
                log.error("[Formulaire@deleteForm] Failed to retrieve files' ids for form : " + formId);
                RenderHelper.internalError(request, responseFileIdsEvt);
                return;
            }

            JsonArray responseFileIds = responseFileIdsEvt.right().getValue();
            if (responseFileIds != null && responseFileIds.size() > 0) {
                JsonArray fileIds = UtilsHelper.getStringIds(responseFileIdsEvt.right().getValue());

                ResponseFileController.deleteFiles(storage, fileIds, deleteFilesEvt -> {
                    if (deleteFilesEvt.isLeft()) {
                        log.error("[Formulaire@deleteForm] Fail to delete files in storage");
                        RenderHelper.internalError(request, deleteFilesEvt);
                        return;
                    }

                    responseFileService.deleteAll(fileIds, deleteResponseFilesEvt -> {
                        if (deleteResponseFilesEvt.isLeft()) {
                            log.error("[Formulaire@deleteForm] Fail to delete response files in BDD");
                            RenderHelper.internalError(request, deleteResponseFilesEvt);
                            return;
                        }

                        formService.delete(formId, defaultResponseHandler(request));
                    });
                });
            }
            else {
                formService.delete(formId, defaultResponseHandler(request));
            }
        });
    }

    @Put("/forms/move/:folderId")
    @ApiDoc("Move specific forms to a specific folder")
    @ResourceFilter(CreationRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void move(HttpServerRequest request) {
        Integer targetFolderId = Integer.parseInt(request.getParam("folderId"));
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@moveForms] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJsonArray(request, formIds -> {
                if (formIds == null || formIds.isEmpty()) {
                    log.error("[Formulaire@moveForms] No forms to move.");
                    noContent(request);
                    return;
                }

                final List<String> groupsAndUserIds = new ArrayList<>();
                groupsAndUserIds.add(user.getUserId());
                if (user.getGroupsIds() != null) {
                    groupsAndUserIds.addAll(user.getGroupsIds());
                }

                formService.checkFormsRights(groupsAndUserIds, user, Formulaire.CONTRIB_RESOURCE_BEHAVIOUR, formIds, hasRightsEvt -> {
                    if (hasRightsEvt.isLeft()) {
                        log.error("[Formulaire@moveForms] Fail to check rights for method " + hasRightsEvt);
                        RenderHelper.internalError(request, hasRightsEvt);
                        return;
                    }
                    if (hasRightsEvt.right().getValue().isEmpty()) {
                        String message = "[Formulaire@moveForms] No rights found for forms with ids " + formIds;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    // Check if user is owner or contributor to all the forms
                    Long count = hasRightsEvt.right().getValue().getLong("count");
                    if (count == null || count != formIds.size()) {
                        String message = "[Formulaire@moveForms] You're missing rights on one form or more.";
                        log.error(message);
                        unauthorized(request, message);
                        return;
                    }

                    relFormFolderService.listMineByFormIds(user, formIds, relFormFolderEvt -> {
                        if (relFormFolderEvt.isLeft()) {
                            log.error("[Formulaire@moveForms] Failed to get relation form-folders for forms with id " + formIds);
                            RenderHelper.internalError(request, relFormFolderEvt);
                            return;
                        }
                        if (relFormFolderEvt.right().getValue().isEmpty()) {
                            String message = "[Formulaire@moveForms] No relation form-folders found for forms with ids " + formIds;
                            log.error(message);
                            notFound(request, message);
                            return;
                        }

                        // Check if one of the folders is not owned by the connected user
                        JsonArray relFormFolders = relFormFolderEvt.right().getValue();
                        if (relFormFolders.size() != formIds.size()) {
                            String message = "[Formulaire@moveForms] You're not owner of all the folders containing forms with ids " + formIds;
                            log.error(message);
                            unauthorized(request, message);
                            return;
                        }

                        folderService.get(targetFolderId.toString(), targetedFolderEvt -> {
                            if (targetedFolderEvt.isLeft()) {
                                log.error("[Formulaire@moveForms] Failed to get folder with id " + targetFolderId);
                                RenderHelper.internalError(request, targetedFolderEvt);
                                return;
                            }
                            if (targetedFolderEvt.right().getValue().isEmpty()) {
                                String message = "[Formulaire@moveForms] No folder found with id " + targetFolderId;
                                log.error(message);
                                notFound(request, message);
                                return;
                            }

                            // Check if targetFolderId is not owned by the connected user
                            String folderOwner = targetedFolderEvt.right().getValue().getString("user_id");
                            if (!Formulaire.FORBIDDEN_FOLDER_IDS.contains(targetFolderId) &&
                                (folderOwner == null || !user.getUserId().equals(folderOwner))) {
                                String message = "[Formulaire@moveForms] You're not owner of the targeted folder with id " + targetFolderId;
                                log.error(message);
                                unauthorized(request, message);
                                return;
                            }

                            relFormFolderService.update(user, formIds, targetFolderId, updateEvt -> {
                                if (updateEvt.isLeft()) {
                                    log.error("[Formulaire@moveForms] Error in moving forms with ids " + formIds);
                                    RenderHelper.internalError(request, updateEvt);
                                    return;
                                }
                                JsonArray folderIds = UtilsHelper.getByProp(relFormFolders, "folder_id").add(targetFolderId);
                                JsonArray folderIdsToSync = new JsonArray();
                                for (int j = 0; j < folderIds.size(); j++) {
                                    if (folderIds.getInteger(j) != Formulaire.ID_ROOT_FOLDER) {
                                        folderIdsToSync.add(folderIds.getInteger(j));
                                    };
                                }

                                if (folderIdsToSync.size() > 0) {
                                    folderService.syncNbChildren(user, folderIdsToSync, arrayResponseHandler(request));
                                }
                                else {
                                    renderJson(request, updateEvt.right().getValue());
                                }
                            });
                        });
                    });
                });
            });
        });
    }

    @Post("/forms/:formId/remind")
    @ApiDoc("Send a reminder by mail to all the necessary responders")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void sendReminder(HttpServerRequest request) {
        String formId = request.getParam("formId");
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@sendReminder] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            RequestUtils.bodyToJson(request, mail -> {
                if (mail == null || mail.isEmpty()) {
                    log.error("[Formulaire@sendReminder] No mail to send.");
                    noContent(request);
                    return;
                }

                formService.get(formId, user, formEvent -> {
                    if (formEvent.isLeft()) {
                        log.error("[Formulaire@sendReminder] Fail to get form " + formId + " : " + formEvent.left().getValue());
                        RenderHelper.internalError(request, formEvent);
                        return;
                    }
                    if (formEvent.right().getValue().isEmpty()) {
                        String message = "[Formulaire@sendReminder] No form found for id " + formId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    // Should not send reminder if form is not sent
                    JsonObject form = formEvent.right().getValue();
                    if (!form.getBoolean("sent")) {
                        String message = "[Formulaire@sendReminder] You cannot send a reminder for a form which is not already send for response.";
                        log.error(message);
                        badRequest(request, message);
                        return;
                    }

                    distributionService.listByForm(formId, distributionsEvent -> {
                        if (distributionsEvent.isLeft()) {
                            log.error("[Formulaire@sendReminder] Fail to retrieve distributions for form with id : " + formId);
                            RenderHelper.internalError(request, distributionsEvent);
                            return;
                        }
                        if (distributionsEvent.right().getValue().isEmpty()) {
                            String message = "[Formulaire@sendReminder] No distributions found for form with id " + formId;
                            log.error(message);
                            notFound(request, message);
                            return;
                        }

                        JsonArray distributions = distributionsEvent.right().getValue();
                        JsonArray localRespondersIds = new JsonArray();
                        JsonArray listMails = new JsonArray();

                        // Generate list of mails to send
                        for (int i = 0; i < distributions.size(); i++) {
                            String id = distributions.getJsonObject(i).getString("responder_id");
                            if (!localRespondersIds.contains(id)) {
                                if (form.getBoolean("multiple")) {
                                    localRespondersIds.add(id);
                                }
                                else if (distributions.getJsonObject(i).getString("date_response") == null) {
                                    localRespondersIds.add(id);
                                }
                            }

                            // Generate new mail object if limit or end loop are reached
                            if (i == distributions.size() - 1 || localRespondersIds.size() == config.getInteger("zimbra-max-recipients", 50)) {
                                JsonObject message = new JsonObject()
                                        .put("subject", mail.getString("subject", ""))
                                        .put("body", mail.getString("body", ""))
                                        .put("to", new JsonArray())
                                        .put("cci", localRespondersIds);

                                JsonObject action = new JsonObject()
                                        .put("action", "send")
                                        .put("userId", user.getUserId())
                                        .put("username", user.getUsername())
                                        .put("message", message);

                                listMails.add(action);
                                localRespondersIds = new JsonArray();
                            }
                        }


                        // Prepare futures to get message responses
                        List<Future> mails = new ArrayList<>();
                        mails.addAll(Collections.nCopies(listMails.size(), Promise.promise().future()));

                        // Code to send mails
                        for (int i = 0; i < listMails.size(); i++) {
                            Future future = mails.get(i);

                            // Send mail via Conversation app if it exists or else with Zimbra
                            eb.request("org.entcore.conversation", listMails.getJsonObject(i), (Handler<AsyncResult<Message<JsonObject>>>) messageEvent -> {
                                if (!messageEvent.result().body().getString("status").equals("ok")) {
                                    log.error("[Formulaire@sendReminder] Failed to send reminder : " + messageEvent.cause());
                                    future.handle(Future.failedFuture(messageEvent.cause()));
                                }
                                future.handle(Future.succeededFuture(messageEvent.result().body()));
                            });
                        }

                        // Try to send effectively mails with code below and get results
                        CompositeFuture.all(mails).onComplete(sendMailsEvt -> {
                            if (sendMailsEvt.failed()) {
                                log.error("[Formulaire@sendReminder] Failed to send reminder : " + sendMailsEvt.cause());
                                RenderHelper.internalError(request, sendMailsEvt);
                                return;
                            }

                            // Update 'reminded' prop of the form
                            form.put("reminded", true);
                            formService.update(formId, form, updateEvt -> {
                                if (updateEvt.isLeft()) {
                                    log.error("[Formulaire@sendReminder] Fail to update form " + formId + " : " + updateEvt.left().getValue());
                                    RenderHelper.internalError(request, updateEvt);
                                    return;
                                }
                                renderJson(request, updateEvt.right().getValue());
                            });
                        });
                    });
                });
            });
        });
    }

    @Get("/forms/:formId/rights")
    @ApiDoc("Get my rights for a specific form")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getMyFormRights(HttpServerRequest request) {
        String formId = request.getParam("formId");
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@getMyFormRights] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            List<String> groupsAndUserIds = new ArrayList();
            groupsAndUserIds.add(user.getUserId());
            if (user.getGroupsIds() != null) {
                groupsAndUserIds.addAll(user.getGroupsIds());
            }
            formService.getMyFormRights(formId, groupsAndUserIds, arrayResponseHandler(request));
        });
    }

    @Get("/forms/rights/all")
    @ApiDoc("Get my rights for all the forms")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getAllMyFormRights(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@getAllMyFormRights] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            List<String> groupsAndUserIds = new ArrayList();
            groupsAndUserIds.add(user.getUserId());
            if (user.getGroupsIds() != null) {
                groupsAndUserIds.addAll(user.getGroupsIds());
            }
            formService.getAllMyFormRights(groupsAndUserIds, arrayResponseHandler(request));
        });
    }

    // Exports

    @Post("/forms/:formId/export/:fileType")
    @ApiDoc("Export a specific form's responses into a file (CSV or PDF)")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void export(final HttpServerRequest request) {
        String fileType = request.getParam("fileType");
        String formId = request.getParam("formId");
        RequestUtils.bodyToJson(request, images -> {
            UserUtils.getUserInfos(eb, request, user -> {
                if (user == null) {
                    String message = "[Formulaire@exportForm] User not found in session.";
                    log.error(message);
                    unauthorized(request, message);
                    return;
                }

                formService.get(formId, user, getEvent -> {
                    if (getEvent.isLeft()) {
                        log.error("[Formulaire@export] Error in getting form to export responses of form " + formId);
                        RenderHelper.internalError(request, getEvent);
                        return;
                    }
                    if (getEvent.right().getValue().isEmpty()) {
                        String message = "[Formulaire@export] No form found for id " + formId;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    switch (fileType) {
                        case "csv":
                            new FormResponsesExportCSV(request, getEvent.right().getValue()).launch();
                            break;
                        case "pdf":
                            JsonObject form = getEvent.right().getValue();
                            form.put("images", images);
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




    // Share/Sending functions

    @Override
    @Get("/share/json/:id")
    @ApiDoc("List rights for a given form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.MANAGER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void shareJson(final HttpServerRequest request) {
        super.shareJson(request, false);
    }

    @Put("/share/json/:id")
    @ApiDoc("Add rights for a given form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.MANAGER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void shareSubmit(final HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@shareSubmit] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            FormController.super.shareJsonSubmit(request, null, false, new JsonObject(), null);
        });
    }

    @Put("/share/resource/:id")
    @ApiDoc("Add rights for a given form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Formulaire.MANAGER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void shareResource(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, pathPrefix + "share", shareFormObject -> {
            if (shareFormObject == null || shareFormObject.isEmpty()) {
                log.error("[Formulaire@shareResource] No forms to share.");
                noContent(request);
                return;
            }

            UserUtils.getUserInfos(eb, request, user -> {
                if (user == null) {
                    String message = "[Formulaire@shareResource] User not found in session.";
                    log.error(message);
                    unauthorized(request, message);
                    return;
                }

                // Get all ids, filter the one about sending (response right)
                final String formId = request.params().get("id");
                Map<String, Object> idUsers = shareFormObject.getJsonObject("users").getMap();
                Map<String, Object> idGroups = shareFormObject.getJsonObject("groups").getMap();
                Map<String, Object> idBookmarks = shareFormObject.getJsonObject("bookmarks").getMap();

                JsonArray usersIds = new JsonArray(new ArrayList<>(filterIdsForSending(idUsers).keySet()));
                JsonArray groupsIds = new JsonArray(new ArrayList<>(filterIdsForSending(idGroups).keySet()));
                JsonArray bookmarksIds = new JsonArray(new ArrayList<>(filterIdsForSending(idBookmarks).keySet()));

                // Get group ids and users ids from bookmarks and add them to previous lists
                neoService.getIdsFromBookMarks(bookmarksIds, eventBookmarks -> {
                    if (eventBookmarks.isLeft()) {
                        log.error("[Formulaire@shareResource] Fail to get ids from bookmarks' ids");
                        RenderHelper.internalError(request, eventBookmarks);
                        return;
                    }
                    if (eventBookmarks.right().getValue().isEmpty()) {
                        String message = "[Formulaire@shareResource] No bookmarks found for ids " + bookmarksIds;
                        log.error(message);
                        notFound(request, message);
                        return;
                    }

                    JsonArray ids = eventBookmarks.right().getValue().getJsonObject(0).getJsonArray("ids").getJsonObject(0).getJsonArray("ids");
                    for (int i = 0; i < ids.size(); i++) {
                        JsonObject id = ids.getJsonObject(i);
                        boolean isGroup = id.getString("name") != null;
                        (isGroup ? groupsIds : usersIds).add(id.getString("id"));
                    }

                    // Get all users ids from usersIds & groupsIds
                    // Sync with distribution table
                    neoService.getUsersInfosFromIds(usersIds, groupsIds, eventUsers -> {
                        if (eventUsers.isLeft()) {
                            log.error("[Formulaire@shareResource] Fail to get users' ids from groups' ids");
                            RenderHelper.internalError(request, eventUsers);
                            return;
                        }
                        if (eventUsers.right().getValue().isEmpty()) {
                            String message = "[Formulaire@shareResource] No users found for ids " + usersIds + " or group ids " + groupsIds;
                            log.error(message);
                            notFound(request, message);
                            return;
                        }

                        JsonArray infos = eventUsers.right().getValue();
                        JsonArray responders = new JsonArray();
                        for (int i = 0; i < infos.size(); i++) {
                            JsonArray users = infos.getJsonObject(i).getJsonArray("users");
                            responders.addAll(users);
                        }

                        // Check max sharing limit
                        if (responders.size() > Formulaire.MAX_USERS_SHARING) {
                            String message = "You can't share to more than " + Formulaire.MAX_USERS_SHARING + " people.";
                            log.error("[Formulaire@shareResource] " + message);
                            badRequest(request, message);
                            return;
                        }

                        syncDistributions(request, formId, user, responders, syncEvent -> {
                            if (syncEvent.isLeft()) {
                                log.error("[Formulaire@shareResource] Fail to sync distributions for form " + formId);
                                RenderHelper.internalError(request, syncEvent);
                                return;
                            }

                            // Update 'collab' property as needed
                            List<Map<String, Object>> idsObjects = new ArrayList<>();
                            idsObjects.add(idUsers);
                            idsObjects.add(idGroups);
                            idsObjects.add(idBookmarks);
                            updateFormCollabProp(formId, user, idsObjects, updateEvent -> {
                                if (updateEvent.isLeft()) {
                                    log.error("[Formulaire@shareResource] Fail to update collab prop for form " + formId);
                                    RenderHelper.internalError(request, updateEvent);
                                    return;
                                }
                                fixBugAutoUnsharing(request, formId, user, shareFormObject);
                            });
                        });
                    });
                });
            });
        });
    }

    private Map<String, Object> filterIdsForSending(Map<String, Object> map) {
        Map<String, Object> filteredMap = new HashMap<>();
        for (String key : map.keySet()) {
            ArrayList<String> values = (ArrayList<String>)map.get(key);
            for (String value : values) {
                if (value.equals(Formulaire.RESPONDER_RESOURCE_BEHAVIOUR)) {
                    filteredMap.put(key, map.get(key));
                }
            }
        }
        return filteredMap;
    }

    private void syncDistributions(HttpServerRequest request, String formId, UserInfos user, JsonArray responders, Handler<Either<String, JsonObject>> handler) {
        List<String> respondersFromSharing = UtilsHelper.getStringIds(responders).getList();

        distributionService.getResponders(formId, respondersEvt -> {
            if (respondersEvt.isLeft()) {
                log.error("[Formulaire@removeDeletedDistributions] Fail to get responders to form " + formId);
                handler.handle(new Either.Left<>(respondersEvt.left().getValue()));
                return;
            }

            List<String> respondersFromBDD = UtilsHelper.getStringIds(respondersEvt.right().getValue()).getList();

            // List the responders already in BDD
            List<String> existingResponders = new ArrayList<>(respondersFromSharing);
            existingResponders.retainAll(respondersFromBDD);

            // List the responder_ids to deactivate
            List<String> deactivatedResponders = new ArrayList<>(respondersFromBDD);
            deactivatedResponders.removeAll(respondersFromSharing);

            // List the new responders to add in BDD
            List<JsonObject> newResponders = new ArrayList<>();
            for (int i = 0; i < responders.size(); i++) {
                JsonObject responder = responders.getJsonObject(i);
                if (!respondersFromBDD.contains(responder.getString("id"))) {
                    newResponders.add(responder);
                }
            }

            distributionService.setActiveValue(false, formId, deactivatedResponders, deactivateEvent -> {
                if (deactivateEvent.isLeft()) {
                    log.error("[Formulaire@removeDeletedDistributions] Fail to deactivate distributions");
                    handler.handle(new Either.Left<>(deactivateEvent.left().getValue()));
                    return;
                }

                addNewDistributions(request, formId, user, newResponders, existingResponders, addEvt -> {
                    if (addEvt.isLeft()) {
                        log.error(addEvt.left().getValue());
                        handler.handle(new Either.Left<>(addEvt.left().getValue()));
                        return;
                    }

                    updateFormSentProp(formId, user, updateSentPropEvent -> {
                        if (updateSentPropEvent.isLeft()) {
                            log.error(updateSentPropEvent.left().getValue());
                            handler.handle(new Either.Left<>(updateSentPropEvent.left().getValue()));
                            return;
                        }

                        handler.handle(new Either.Right<>(updateSentPropEvent.right().getValue()));
                    });
                });
            });
        });
    }

    private void addNewDistributions(HttpServerRequest request, String formId, UserInfos user, List<JsonObject> newResponders,
                                     List<String> existingResponders, Handler<Either<String, JsonObject>> handler) {
        distributionService.createMultiple(formId, user, newResponders, addEvent -> {
            if (addEvent.isLeft()) {
                log.error("[Formulaire@addNewDistributions] Fail to add distributions");
                handler.handle(new Either.Left<>(addEvent.left().getValue()));
                return;
            }

            JsonArray respondersIds = UtilsHelper.getStringIds(new JsonArray(newResponders));
            if (!existingResponders.isEmpty()) {
                distributionService.setActiveValue(true, formId, existingResponders, updateEvent -> {
                    if (updateEvent.isLeft()) {
                        log.error("[Formulaire@addNewDistributions] Fail to update distributions");
                        handler.handle(new Either.Left<>(updateEvent.left().getValue()));
                        return;
                    }

                    formService.get(formId, user, formEvent -> {
                        if (formEvent.isLeft()) {
                            log.error("[Formulaire@addNewDistributions] Fail to get infos for form with id " + formId);
                            handler.handle(new Either.Right<>(formEvent.right().getValue()));
                            return;
                        }
                        if (formEvent.right().getValue().isEmpty()) {
                            String message = "[Formulaire@addNewDistributions] No form found for id " + formId;
                            log.error(message);
                            handler.handle(new Either.Left<>(message));
                            return;
                        }

                        JsonObject form = formEvent.right().getValue();
                        notifyService.notifyNewForm(request, form, respondersIds);
                        handler.handle(new Either.Right<>(formEvent.right().getValue()));
                    });
                });
            }
            else {
                formService.get(formId, user, formEvent -> {
                    if (formEvent.isLeft()) {
                        log.error("[Formulaire@addNewDistributions] Fail to get infos for form with id " + formId);
                        handler.handle(new Either.Right<>(formEvent.right().getValue()));
                        return;
                    }
                    if (formEvent.right().getValue().isEmpty()) {
                        String message = "[Formulaire@addNewDistributions] No form found for id " + formId;
                        log.error(message);
                        handler.handle(new Either.Left<>(message));
                        return;
                    }

                    JsonObject form = formEvent.right().getValue();
                    notifyService.notifyNewForm(request, form, respondersIds);
                    handler.handle(new Either.Right<>(formEvent.right().getValue()));
                });
            }
        });
    }

    private void updateFormSentProp(String formId, UserInfos user, Handler<Either<String, JsonObject>> handler) {
        distributionService.listByForm(formId, distributionsEvent -> {
            if (distributionsEvent.isLeft()) {
                log.error("[Formulaire@updateFormSentProp] Fail to get distributions of the form");
                handler.handle(new Either.Left<>(distributionsEvent.left().getValue()));
                return;
            }

            boolean hasDistributions = !distributionsEvent.right().getValue().isEmpty();
            formService.get(formId, user, formEvent -> {
                if (formEvent.isLeft()) {
                    log.error("[Formulaire@updateFormSentProp] Fail to get form");
                    handler.handle(new Either.Left<>(formEvent.left().getValue()));
                    return;
                }
                if (formEvent.right().getValue().isEmpty()) {
                    String message = "[Formulaire@updateFormSentProp] No form found for id " + formId;
                    log.error(message);
                    handler.handle(new Either.Left<>(message));
                    return;
                }

                JsonObject form = formEvent.right().getValue();
                form.put("sent", hasDistributions);
                formService.update(formId, form, updateEvent -> {
                    if (updateEvent.isLeft()) {
                        log.error("[Formulaire@updateFormSentProp] Fail to update form");
                        handler.handle(new Either.Left<>(updateEvent.left().getValue()));
                        return;
                    }

                    handler.handle(new Either.Right<>(updateEvent.right().getValue()));
                });
            });
        });
    }

    private void updateFormCollabProp(String formId, UserInfos user, List<Map<String, Object>> idsObjects, Handler<Either<String, JsonObject>> handler) {
        formService.get(formId, user, formEvent -> {
            if (formEvent.isLeft()) {
                log.error("[Formulaire@updateFormCollabProp] Fail to get form : " + formEvent.left().getValue());
                handler.handle(new Either.Left<>(formEvent.left().getValue()));
                return;
            }
            if (formEvent.right().getValue().isEmpty()) {
                String message = "[Formulaire@updateFormCollabProp] No form found for id " + formId;
                log.error(message);
                handler.handle(new Either.Left<>(message));
                return;
            }

            JsonObject form = formEvent.right().getValue();

            boolean isShared = false;
            int i = 0;
            while (!isShared && i < idsObjects.size()) { // Iterate over "users", "groups", "bookmarks"
                int j = 0;
                Map<String, Object> o = idsObjects.get(i);
                List<Object> values = new ArrayList<Object>(o.values());

                while (!isShared && j < values.size()) { // Iterate over each pair id-actions
                    List<String> actions = (ArrayList)(values.get(j));

                    int k = 0;
                    while (!isShared && k < actions.size()) { // Iterate over each action for an id
                        if (actions.get(k).equals(Formulaire.CONTRIB_RESOURCE_BEHAVIOUR) ||
                            actions.get(k).equals(Formulaire.MANAGER_RESOURCE_BEHAVIOUR)) {
                                isShared = true;
                        }
                        k++;
                    }
                    j++;
                }
                i++;
            }

            if (!isShared && !form.getString("owner_id").equals(user.getUserId())) {
                isShared = true;
            }

            form.put("collab", isShared);
            formService.update(formId, form, updateEvent -> {
                if (updateEvent.isLeft()) {
                    log.error("[Formulaire@updateFormCollabProp] Fail to update form : " + updateEvent.left().getValue());
                    handler.handle(new Either.Left<>(updateEvent.left().getValue()));
                }
                else {
                    handler.handle(new Either.Right<>(updateEvent.right().getValue()));
                }
            });
        });
    }

    private void fixBugAutoUnsharing(HttpServerRequest request, String formId, UserInfos user, JsonObject shareFormObject) {
        formShareService.getSharedWithMe(formId, user, formSharedEvt -> {
            if (formSharedEvt.isLeft()) {
                String message = "[Formulaire@getSharedWithMe] Fail to get user's shared rights";
                log.error(message);
                badRequest(request, message);
                return;
            }

            JsonArray rights = formSharedEvt.right().getValue();
            String id = user.getUserId();
            shareFormObject.getJsonObject("users").put(id, new JsonArray());

            for (int i = 0; i < rights.size(); i++) {
                JsonObject right = rights.getJsonObject(i);
                shareFormObject.getJsonObject("users").getJsonArray(id).add(right.getString("action"));
            }

            // Classic sharing stuff (putting or removing ids from form_shares table accordingly)
            this.getShareService().share(user.getUserId(), formId, shareFormObject, (r) -> {
                if (r.isRight()) {
                    this.doShareSucceed(request, formId, user, shareFormObject, r.right().getValue(), false);
                } else {
                    JsonObject error = (new JsonObject()).put("error", r.left().getValue());
                    Renders.renderJson(request, error, 400);
                }
            });
        });
    }
}