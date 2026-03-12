package fr.openent.formulaire.controllers;

import fr.openent.formulaire.cron.NotifyCron;
import fr.openent.formulaire.cron.RgpdCron;
import fr.wseduc.rs.Post;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.http.BaseController;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;

public class TaskController extends BaseController {
	protected static final Logger log = LoggerFactory.getLogger(TaskController.class);

	final RgpdCron rgpdCron;
	final NotifyCron notifyCron;

	public TaskController(RgpdCron rgpdCron, NotifyCron notifyCron) {
		this.rgpdCron = rgpdCron;
		this.notifyCron = notifyCron;
	}

	@Post("api/internal/delete-old-data-rgpd")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	public void deleteOldDataRgpd(HttpServerRequest request) {
		log.info("Triggered old data RGPD task");
		rgpdCron.handle(0L);
		render(request, null, 202);
	}

	@Post("api/internal/launch-notifications")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	public void launchNotifications(HttpServerRequest request) {
		log.info("Triggered notification task");
		notifyCron.handle(0L);
		render(request, null, 202);
	}
}
