package fr.openent.formulaire.controllers;

import java.util.Map;

import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.events.EventStore;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.http.filter.SuperAdminFilter;
import org.vertx.java.core.http.RouteMatcher;

import static fr.openent.form.core.constants.ConfigFields.AUTH;
import static fr.openent.form.core.constants.ConfigFields.HOST;
import static fr.openent.form.core.constants.ConfigFields.NODE_PDF_GENERATOR;
import static fr.openent.form.core.constants.ConfigFields.THEME_PLATFORM;
import static fr.openent.form.core.constants.ConsoleRights.ACCESS_RIGHT;
import static fr.openent.form.core.enums.Events.ACCESS;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class FormulaireController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(FormulaireController.class);
    private EventStore eventStore;

    public FormulaireController(EventStore eventStore) {
        super();
        this.eventStore = eventStore;
    }

    @Override
    public void init(Vertx vertx, JsonObject config, RouteMatcher rm,
            Map<String, fr.wseduc.webutils.security.SecuredAction> securedActions) {
        super.init(vertx, config, rm, securedActions);
    }

    @Get("")
    @ApiDoc("Render view")
    @SecuredAction(ACCESS_RIGHT)
    public void render(HttpServerRequest request) {
        final String view = request.params().get("view");
        JsonObject safeConfig = config.copy();
        JsonObject params = new JsonObject()
                .put(HOST, safeConfig.getString(HOST, null))
                .put(THEME_PLATFORM, safeConfig.getString(THEME_PLATFORM, "default"));
        if ("angular".equals(view)) {
            renderView(request, new JsonObject(), "formulaire.html", null);
        } else {
            renderView(request, params, "index.html", null);
        }
        eventStore.createAndStoreEvent(ACCESS.name(), request);
    }

    @Get("/config")
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    @ResourceFilter(SuperAdminFilter.class)
    public void getConfig(final HttpServerRequest request) {
        JsonObject safeConfig = config.copy();

        JsonObject nodePdfGenerator = safeConfig.getJsonObject(NODE_PDF_GENERATOR, null);
        if (nodePdfGenerator != null) {
            if (nodePdfGenerator.getString(AUTH, null) != null)
                nodePdfGenerator.put(AUTH, "**********");
        }

        renderJson(request, safeConfig);
    }
}