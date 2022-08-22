package fr.openent.form.helpers;

import fr.wseduc.webutils.Either;
import io.vertx.core.AsyncResult;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import static fr.openent.form.core.constants.Fields.ERROR;
import static fr.wseduc.webutils.http.Renders.renderJson;

public class RenderHelper {
    private static final Logger log = LoggerFactory.getLogger(RenderHelper.class);

    private RenderHelper() {}

    public static void renderBadRequest(HttpServerRequest request, Either event) {
        String message = event.isLeft() ? event.left().getValue().toString() : "Empty result";
        JsonObject error = (new JsonObject()).put(ERROR, message);
        renderJson(request, error, 400);
    }

    public static void renderInternalError(HttpServerRequest request, Either event) {
        String message = event.isLeft() ? event.left().getValue().toString() : "Empty result";
        JsonObject error = (new JsonObject()).put(ERROR, message);
        renderJson(request, error, 500);
    }

    public static void renderInternalError(HttpServerRequest request, AsyncResult event) {
        String message = event.failed() ? event.cause().getMessage() : "Empty result";
        JsonObject error = (new JsonObject()).put(ERROR, message);
        renderJson(request, error, 500);
    }

    public static void renderInternalError(HttpServerRequest request, String message) {
        JsonObject error = (new JsonObject()).put(ERROR, message);
        renderJson(request, error, 500);
    }
}
