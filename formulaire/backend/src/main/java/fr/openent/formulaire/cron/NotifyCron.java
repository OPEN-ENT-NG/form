package fr.openent.formulaire.cron;

import fr.openent.form.core.models.Distribution;
import fr.openent.form.core.models.Form;
import fr.openent.form.helpers.IModelHelper;
import fr.openent.form.helpers.LogHelper;
import fr.openent.form.helpers.UtilsHelper;
import fr.openent.formulaire.service.*;
import fr.openent.formulaire.service.impl.*;
import fr.wseduc.webutils.Either;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.notification.TimelineHelper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static fr.openent.form.core.constants.ConfigFields.DAYS_BEFORE_NOTIF_CLOSING;
import static fr.openent.form.core.constants.ConfigFields.DEFAULT_DAYS_BEFORE_NOTIF_CLOSING;
import static fr.openent.form.core.constants.Fields.*;

public class NotifyCron extends ControllerHelper implements Handler<Long> {
    private static final Logger log = LoggerFactory.getLogger(NotifyCron.class);
    private final FormService formService;
    private final DistributionService distributionService;
    private final NotifyService notifyService;

    public NotifyCron(TimelineHelper timelineHelper, JsonObject config) {
        this.formService = new DefaultFormService();
        this.distributionService = new DefaultDistributionService();
        this.notifyService = new DefaultNotifyService(timelineHelper, eb);
        this.config = config;
    }

    @Override
    public void handle(Long event) {
        LogHelper.logInfo(this, "handle", "Formulaire Notify cron started");
        launchNotifications(notificationsEvt -> {
            if (notificationsEvt.isLeft()) {
                String errorMessage = "Notify cron failed";
                LogHelper.logError(this, "handle", errorMessage, notificationsEvt.left().getValue());
            }
            else {
                String errorMessage = "Notify cron launch successful";
                LogHelper.logError(this, "handle", errorMessage, notificationsEvt.left().getValue());
            }
        });
    }

    public void launchNotifications(Handler<Either<String, JsonObject>> handler) {
        Future<Void> newFormFuture = notifyNewFormFrom();
        Future<Void> closingFormFuture = notifyClosingForm();

        Future.all(newFormFuture, closingFormFuture)
            .onSuccess((future) -> handler.handle(new Either.Right<>(new JsonObject())))
            .onFailure(err -> {
                String errorMessage = "Failed to send notifications from notify CRON";
                LogHelper.logError(this, "launchNotifications", errorMessage, err.getMessage());
                handler.handle(new Either.Left<>(err.getMessage()));
            });
    }

    public Future<Void> notifyNewFormFrom() {
        Promise<Void> promise = Promise.promise();
        JsonObject composeInfos = new JsonObject();

        formService.listSentFormsOpeningToday()
            .compose(forms -> {
                composeInfos.put(FORMS, forms);
                JsonArray formIds = UtilsHelper.getIds(forms);
                return distributionService.listByForms(formIds);
            })
            .onSuccess(distributions -> {
                JsonArray respondersIds = UtilsHelper.getByProp(distributions, RESPONDER_ID);
                composeInfos.getJsonArray(FORMS).stream().forEach(form -> notifyService.notifyNewFormFromCRON((JsonObject)form, respondersIds));
                promise.complete();
            })
            .onFailure(err -> {
                String errorMessage = "Failed to send notifications for forms opening today";
                LogHelper.logError(this, "notifyNewFormFromCRON", errorMessage, err.getMessage());
                promise.fail(err.getMessage());
            });

        return promise.future();
    }

    public Future<Void> notifyClosingForm() {
        Promise<Void> promise = Promise.promise();
        List<Form> formList = new ArrayList<>();
        Integer nbDaysBeforeClosing = config.getInteger(DAYS_BEFORE_NOTIF_CLOSING, DEFAULT_DAYS_BEFORE_NOTIF_CLOSING);

        formService.listFormsClosingSoon(nbDaysBeforeClosing)
            .compose(forms -> {
                formList.addAll(forms);
                List<Number> formIds = forms.stream().map(Form::getId).collect(Collectors.toList());
                return distributionService.listByForms(new JsonArray(formIds));
            })
            .onSuccess(distributionsJson -> {
                List<Distribution> distributions = IModelHelper.toList(distributionsJson, Distribution.class);
                formList.forEach(form -> {
                    List<String> respondersIds = distributions.stream()
                            .filter(distrib -> distrib.getFormId().equals(form.getId()))
                            .map(Distribution::getResponderId)
                            .collect(Collectors.toList());
                    notifyService.notifyClosingFormCRON(form, respondersIds);
                });
                promise.complete();
            })
            .onFailure(err -> {
                String errorMessage = "Failed to send notifications for forms closing soon";
                LogHelper.logError(this, "notifyClosingForm", errorMessage, err.getMessage());
                promise.fail(err.getMessage());
            });

        return promise.future();
    }
}
