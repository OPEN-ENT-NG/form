package fr.openent.formulaire.service;

import fr.openent.form.core.models.Form;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.List;

public interface NotifyService {

    /**
     * Send notification when a new form is distributed to a list of responders
     * @param request request
     * @param form form sent
     * @param responders ids of the responders to the form
     */
    void notifyNewForm(HttpServerRequest request, JsonObject form, JsonArray responders);

    /**
     * Notify via a CRON to a list of responders a new form has been sent to them
     * @param form form sent
     * @param responders ids of the responders to the form
     */
    void notifyNewFormFromCRON(JsonObject form, JsonArray responders);

    /**
     * Send notification when a response is sent by a responder
     * @param request request
     * @param form form responded
     * @param managers ids of the managers of the form
     */
    void notifyResponse(HttpServerRequest request, JsonObject form, JsonArray managers);

    /**
     * Notify via a CRON to a list of responders a form is closing soon
     * @param form form sent
     * @param responders ids of the responders to the form
     */
    void notifyClosingFormCRON(Form form, List<String> responders);
}
