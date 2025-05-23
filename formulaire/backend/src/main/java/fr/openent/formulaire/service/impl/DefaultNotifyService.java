package fr.openent.formulaire.service.impl;

import fr.openent.form.core.models.Form;
import fr.openent.formulaire.service.NotifyService;
import fr.wseduc.webutils.I18n;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import org.entcore.common.http.request.JsonHttpServerRequest;
import org.entcore.common.notification.TimelineHelper;

import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;

import java.text.DateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import static fr.openent.form.core.constants.Fields.*;
import static fr.wseduc.webutils.http.Renders.unauthorized;

public class DefaultNotifyService implements NotifyService {
    private static final Logger log = LoggerFactory.getLogger(DefaultNotifyService.class);

    private final TimelineHelper timelineHelper;
    private final EventBus eb;

    public DefaultNotifyService(TimelineHelper timelineHelper, EventBus eb){
        this.timelineHelper = timelineHelper;
        this.eb = eb;
    }

    @Override
    public void notifyNewForm(HttpServerRequest request, JsonObject form, JsonArray responders) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@notifyNewForm] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            notifyNewFormMain(request, form, responders, user);
        });
    }

    @Override
    public void notifyNewFormFromCRON(JsonObject form, JsonArray responders) {
        HttpServerRequest request = new JsonHttpServerRequest(new JsonObject());
        UserInfos user = new UserInfos();
        notifyNewFormMain(request, form, responders, user);
    }

    private void notifyNewFormMain(HttpServerRequest request, JsonObject form, JsonArray responders, UserInfos user) {
        String endPath = form.getBoolean(RGPD) ? RGPD : NEW;
        String formUri = "/formulaire#/form/" + form.getInteger(ID) + "/" + endPath;

        JsonObject params = new JsonObject()
                .put(PARAM_USER_URI, "/userbook/annuaire#" + user.getUserId())
                .put(USERNAME, user.getUsername())
                .put(PARAM_FORM_URI, formUri)
                .put(PARAM_FORM_NAME, form.getString(TITLE))
                .put(PARAM_PUSH_NOTIF, new JsonObject().put(TITLE, "push.notif.formulaire.newForm").put(BODY, ""))
                .put(PARAM_RESOURCE_URI, formUri);

        timelineHelper.notifyTimeline(request, "formulaire.new_form_notification", user, responders.getList(), params);
    }

    @Override
    public void notifyResponse(HttpServerRequest request, JsonObject form, JsonArray managers) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user == null) {
                String message = "[Formulaire@notifyResponse] User not found in session.";
                log.error(message);
                unauthorized(request, message);
                return;
            }

            String formResultsUri = "/formulaire#/form/" + form.getInteger(ID) + "/results/1";

            JsonObject params = new JsonObject()
                    .put(ANONYMOUS, form.getBoolean(ANONYMOUS))
                    .put(PARAM_USER_URI, "/userbook/annuaire#" + user.getUserId())
                    .put(USERNAME, user.getUsername())
                    .put(PARAM_FORM_URI, "/formulaire#/form/" + form.getInteger(ID) + "/edit")
                    .put(PARAM_FORM_NAME, form.getString(TITLE))
                    .put(PARAM_FORM_RESULTS_URI, formResultsUri)
                    .put(PARAM_PUSH_NOTIF, new JsonObject().put(TITLE, "push.notif.formulaire.response").put(BODY, ""))
                    .put(PARAM_RESOURCE_URI, formResultsUri);

            timelineHelper.notifyTimeline(request, "formulaire.response_notification", user, managers.getList(), params);
        });
    }


    @Override
    public void notifyClosingFormCRON(Form form, List<String> responders) {
        HttpServerRequest request = new JsonHttpServerRequest(new JsonObject());
        UserInfos user = new UserInfos();

        String endPath = form.getRgpd() ? RGPD : NEW;
        String formUri = "/formulaire?view=angular#/form/" + form.getId() + "/" + endPath;

        DateFormat df = DateFormat.getDateInstance(DateFormat.FULL, I18n.getLocale(I18n.acceptLanguage(request)));
        String formatedDateEnding = df.format(form.getDateEnding());

        JsonObject params = new JsonObject()
                .put(PARAM_FORM_URI, formUri)
                .put(PARAM_FORM_NAME, form.getTitle())
                .put(PARAM_PUSH_NOTIF, new JsonObject().put(TITLE, "push.notif.formulaire.closingForm").put(BODY, ""))
                .put(PARAM_RESOURCE_URI, formUri)
                .put(PARAM_DATE_ENDING, formatedDateEnding);

        timelineHelper.notifyTimeline(request, "formulaire.closing_form_notification", user, responders, params);
    }
}