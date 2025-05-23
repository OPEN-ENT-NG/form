package fr.openent.formulaire.service;

import fr.openent.form.core.constants.DistributionStatus;
import fr.openent.form.core.models.Distribution;
import fr.openent.formulaire.service.impl.DefaultDistributionService;
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

import static fr.openent.form.core.constants.Constants.NB_NEW_LINES;
import static fr.openent.form.core.constants.DistributionStatus.FINISHED;
import static fr.openent.form.core.constants.EbFields.FORMULAIRE_ADDRESS;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.Tables.*;

@RunWith(VertxUnitRunner.class)
public class DefaultDistributionServiceTest {
    private Vertx vertx;
    private DefaultDistributionService defaultDistributionService;
    private Distribution distribution;

    @Before
    public void setUp() {
        vertx = Vertx.vertx();
        defaultDistributionService = new DefaultDistributionService();
        Sql.getInstance().init(vertx.eventBus(), FORMULAIRE_ADDRESS);

        JsonObject distributionJson = new JsonObject()
                .put(ID, 4)
                .put(FORM_ID, 1)
                .put(SENDER_ID, "4265605f-3352-4f42-8cef-18e150bbf6bf")
                .put(SENDER_NAME, "PRUDON Nathalie")
                .put(RESPONDER_ID, "50251834-1745-4fb9-a3ad-cc034438c688")
                .put(RESPONDER_NAME, "GUZMAN Mohamed")
                .put(STATUS, DistributionStatus.TO_DO)
                .put(DATE_SENDING, "2024-11-16 14:39:56.140463+00")
                .put(DATE_RESPONSE, (String)null)
                .put(ACTIVE, true)
                .put(STRUCTURE, (String)null)
                .put(ORIGINAL_ID, (Long)null)
                .put(PUBLIC_KEY, (Boolean)null)
                .put(CAPTCHA_ID, (Long)null);
        distribution = new Distribution(distributionJson);
    }

    @Test
    public void testListByResponder(TestContext ctx) {
        Async async = ctx.async();
        UserInfos user = new UserInfos();
        user.setUsername("GUZMAN Mohamed");
        user.setUserId("50251834-1745-4fb9-a3ad-cc034438c688");

        String expectedQuery = "SELECT * FROM " + DISTRIBUTION_TABLE + " WHERE responder_id = ? AND active = ? ORDER BY date_sending DESC;";
        JsonArray expectedParams = new JsonArray("[\"50251834-1745-4fb9-a3ad-cc034438c688\", true]");

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });

        defaultDistributionService.listByResponder(user)
            .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }

    @Test
    public void testListByForms(TestContext ctx) {
        Async async = ctx.async();
        JsonArray formIds = new JsonArray().add(1);

        String expectedQuery = "SELECT * FROM " + DISTRIBUTION_TABLE + " WHERE form_id IN " + Sql.listPrepared(formIds) + ";";
        JsonArray expectedParams = new JsonArray().addAll(formIds);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });

        defaultDistributionService.listByForms(formIds)
                .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }

    @Test
    public void testListByForms_NullOrEmptyFormIds(TestContext ctx) {
        Async async = ctx.async();
        JsonArray formIds = new JsonArray();

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            async.complete();
        });

        defaultDistributionService.listByForms(formIds)
                .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }

    @Test
    public void testListByFormAndStatus_NbLinesNull(TestContext ctx) {
        Async async = ctx.async();

        String expectedQuery = "SELECT * FROM " + DISTRIBUTION_TABLE + " WHERE form_id = ? AND status = ? " +
                "ORDER BY date_response DESC;";
        JsonArray expectedParams = new JsonArray("[\"9\",\"FINISHED\"]");

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });

        defaultDistributionService.listByFormAndStatus("9", FINISHED, null)
            .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }

    @Test
    public void testListByFormAndStatus_NbLinesNotNull(TestContext ctx) {
        Async async = ctx.async();

        String expectedQuery = "SELECT * FROM " + DISTRIBUTION_TABLE + " WHERE form_id = ? AND status = ? " +
                "ORDER BY date_response DESC LIMIT ? OFFSET ?;";
        JsonArray expectedParams = new JsonArray("[\"9\",\"FINISHED\",10,\"50\"]");

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });

        defaultDistributionService.listByFormAndStatus("9", FINISHED, "50")
            .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }

    @Test
    public void testListByFormAndStatusAndQuestion_NbLinesNull(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery = "SELECT DISTINCT d.* FROM " + DISTRIBUTION_TABLE + " d " +
                "JOIN " + RESPONSE_TABLE + " r ON r.distribution_id = d.id " +
                "WHERE form_id = ? AND status = ? AND question_id = ? " +
                "ORDER BY date_response DESC;";
        JsonArray expectedParams = new JsonArray().add(FORM_ID).add(STATUS).add(QUESTION_ID);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultDistributionService.listByFormAndStatusAndQuestion(FORM_ID, STATUS, QUESTION_ID, null, null);
    }

    @Test
    public void testListByFormAndStatusAndQuestion_NbLinesNotNull(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery = "SELECT DISTINCT d.* FROM " + DISTRIBUTION_TABLE + " d " +
                "JOIN " + RESPONSE_TABLE + " r ON r.distribution_id = d.id " +
                "WHERE form_id = ? AND status = ? AND question_id = ? " +
                "ORDER BY date_response DESC " +
                "LIMIT ? OFFSET ?;";
        JsonArray expectedParams = new JsonArray().add(FORM_ID).add(STATUS).add(QUESTION_ID).add(NB_NEW_LINES).add(NB_LINES);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultDistributionService.listByFormAndStatusAndQuestion(FORM_ID, STATUS, QUESTION_ID, NB_LINES, null);
    }

    @Test
    public void testDuplicateWithResponses_DistributionIdOk(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery =
                "WITH newDistrib AS (" +
                    "INSERT INTO " + DISTRIBUTION_TABLE + " (form_id, sender_id, sender_name, " +
                    "responder_id, responder_name, status, date_sending, date_response, active, original_id) " +
                    "SELECT form_id, sender_id, sender_name, responder_id, responder_name, ?, " +
                    "date_sending, date_response, active, id FROM " + DISTRIBUTION_TABLE + " WHERE id = ? RETURNING *" +
                "), " +
                "newResponses AS (" +
                    "INSERT INTO " + RESPONSE_TABLE + " (question_id, answer, responder_id, choice_id, distribution_id, original_id, choice_position, custom_answer) " +
                    "SELECT question_id, answer, responder_id, choice_id, (SELECT id FROM newDistrib), id, choice_position, custom_answer " +
                    "FROM " + RESPONSE_TABLE + " WHERE distribution_id = ? RETURNING *" +
                ")," +
                "newResponseFiles AS (" +
                    "INSERT INTO " + RESPONSE_FILE_TABLE + " (id, response_id, filename, type) " +
                    "SELECT id, (SELECT id FROM newResponses WHERE original_id = response_id), filename, type " +
                    "FROM " + RESPONSE_FILE_TABLE + " WHERE response_id IN (SELECT original_id FROM newResponses)" +
                ")" +
                "SELECT * FROM newDistrib;";

        JsonArray expectedParams = new JsonArray("[\"ON_CHANGE\", \"1234a\", \"1234a\"]");

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultDistributionService.duplicateWithResponses("1234a");
        async.awaitSuccess(10000);
    }

    @Test
    public void testDeleteByForm(TestContext ctx) {
        Async async = ctx.async();

        String expectedQuery = "DELETE FROM " + DISTRIBUTION_TABLE + " WHERE form_id = ? RETURNING *;";
        JsonArray expectedParams = new JsonArray("[24]");

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });

        defaultDistributionService.deleteByForm(24)
            .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }
}
