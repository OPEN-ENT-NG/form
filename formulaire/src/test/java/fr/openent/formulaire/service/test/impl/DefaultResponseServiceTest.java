package fr.openent.formulaire.service.test.impl;

import fr.openent.formulaire.service.impl.DefaultResponseService;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.entcore.common.sql.Sql;
import org.entcore.common.user.UserInfos;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static fr.openent.form.core.constants.EbFields.FORMULAIRE_ADDRESS;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.Fields.FORM_ID;

import static fr.openent.form.core.constants.Tables.*;
import static fr.openent.form.helpers.SqlHelper.getParamsForUpdateDateModifFormRequest;
import static fr.openent.form.helpers.SqlHelper.getUpdateDateModifFormRequest;

@RunWith(VertxUnitRunner.class)
public class DefaultResponseServiceTest {

    private Vertx vertx;
    private DefaultResponseService defaultResponseService;

    @Before
    public void setUp() {
        vertx = Vertx.vertx();
        defaultResponseService = new DefaultResponseService();
        Sql.getInstance().init(vertx.eventBus(), FORMULAIRE_ADDRESS);
    }

    @Test
    public void create(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery = "INSERT INTO " + RESPONSE_TABLE + " (question_id, choice_id, answer, responder_id, " +
                "distribution_id, choice_position) VALUES (?, ?, ?, ?, ?, ?) RETURNING *;";

        JsonObject response = new JsonObject();
        String questionId = "1";
        UserInfos user = new UserInfos();

        JsonArray expectedParams = new JsonArray()
                .add(questionId)
                .add(response.getInteger(CHOICE_ID, null))
                .add(response.getString(ANSWER, ""))
                .add(user.getUserId())
                .add(response.getInteger(DISTRIBUTION_ID, null))
                .add(response.getInteger(CHOICE_POSITION, null) != null ? null : response.getInteger(CHOICE_POSITION, null));

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultResponseService.create(response, user, questionId, null);
    }
}
