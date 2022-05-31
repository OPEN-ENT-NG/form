package fr.openent.formulaire.controllers;

import fr.openent.formulaire.helpers.DataChecker;
import fr.openent.formulaire.security.AccessRight;
import fr.openent.formulaire.security.ShareAndOwner;
import fr.openent.formulaire.service.FormElementService;
import fr.openent.formulaire.service.SectionService;
import fr.openent.formulaire.service.impl.DefaultFormElementService;
import fr.openent.formulaire.service.impl.DefaultSectionService;
import fr.wseduc.bus.BusAddress;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.bus.BusResponseHandler;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.http.request.JsonHttpServerRequest;

import java.util.List;

import static fr.openent.form.core.constants.ShareRights.CONTRIB_RESOURCE_RIGHT;
import static fr.openent.form.helpers.RenderHelper.renderInternalError;
import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;

public class SectionController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(SectionController.class);
    private final SectionService sectionService;
    private final FormElementService formElementService;

    public SectionController() {
        super();
        this.sectionService = new DefaultSectionService();
        this.formElementService = new DefaultFormElementService();
    }

    @Get("/forms/:formId/sections")
    @ApiDoc("List all the sections of a specific form")
    @ResourceFilter(AccessRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void list(HttpServerRequest request) {
        String formId = request.getParam("formId");
        sectionService.list(formId, arrayResponseHandler(request));
    }

    @Get("/sections/:sectionId")
    @ApiDoc("Get a specific section by id")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void get(HttpServerRequest request) {
        String sectionId = request.getParam("sectionId");
        sectionService.get(sectionId, defaultResponseHandler(request));
    }

    @Post("/forms/:formId/sections")
    @ApiDoc("Create a section in a specific form")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void create(HttpServerRequest request) {
        String formId = request.getParam("formId");
        RequestUtils.bodyToJson(request, section -> {
            if (section == null || section.isEmpty()) {
                log.error("[Formulaire@createSection] No section to create.");
                noContent(request);
                return;
            }

            // Check position value validity
            if (section.getLong("position", 0L) < 1) {
                String message = "[Formulaire@createSection] You cannot create a section with a position null or under 1 : " + section.getLong("position");
                log.error(message);
                badRequest(request, message);
                return;
            }

            // Check if position is not already used
            Long position = section.getLong("position");
            formElementService.getTypeAndIdByPosition(formId, position.toString(), formElementEvt -> {
                if (formElementEvt.isLeft()) {
                    log.error("[Formulaire@createSection] Error in getting form element id of position " + position + " for form " + formId);
                    renderInternalError(request, formElementEvt);
                    return;
                }

                if (!formElementEvt.right().getValue().isEmpty()) {
                    String message = "[Formulaire@createSection] You cannot create a section with a position already occupied : " + formElementEvt.right().getValue();
                    log.error(message);
                    badRequest(request, message);
                    return;
                }

                sectionService.create(section, formId, defaultResponseHandler(request));
            });
        });
    }

    @Put("/forms/:formId/sections")
    @ApiDoc("Update a specific section")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void update(HttpServerRequest request) {
        String formId = request.getParam("formId");
        RequestUtils.bodyToJsonArray(request, sections -> {
            if (sections == null || sections.isEmpty()) {
                log.error("[Formulaire@updateSection] No section to update.");
                noContent(request);
                return;
            }

            // Check position values validity
            boolean arePositionsOk = DataChecker.checkSectionPositionsValidity(sections);
            if (!arePositionsOk) {
                String message = "[Formulaire@updateSection] You cannot create a section with a position null or under 1 : " + sections;
                log.error(message);
                badRequest(request, message);
                return;
            }

            sectionService.update(formId, sections, updatedSectionsEvt -> {
                if (updatedSectionsEvt.isLeft()) {
                    log.error("[Formulaire@updateQuestion] Failed to update sections : " + sections);
                    renderInternalError(request, updatedSectionsEvt);
                    return;
                }

                JsonArray updatedSectionsInfos = updatedSectionsEvt.right().getValue();
                JsonArray updatedSections = new JsonArray();
                for(int i = 0; i < updatedSectionsInfos.size(); i++) {
                    updatedSections.addAll(updatedSectionsInfos.getJsonArray(i));
                }
                renderJson(request, updatedSections);
            });
        });
    }

    @Delete("/sections/:sectionId")
    @ApiDoc("Delete a specific section")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = CONTRIB_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void delete(HttpServerRequest request) {
        String sectionId = request.getParam("sectionId");
        sectionService.get(sectionId, getEvt -> {
            if (getEvt.isLeft() || getEvt.right().getValue().isEmpty()) {
                log.error("[Formulaire@deleteSection] Failed to get section with id : " + sectionId);
                renderInternalError(request, getEvt);
                return;
            }
            sectionService.delete(getEvt.right().getValue(), defaultResponseHandler(request));
        });
    }
}