package fr.openent.formulaire.service.test.impl;

import fr.openent.formulaire.service.impl.DefaultQuestionService;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.sql.Sql;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.Async;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static fr.openent.form.core.constants.Constants.CONDITIONAL_QUESTIONS;
import static fr.openent.form.core.constants.Constants.QUESTIONS_WITHOUT_RESPONSES;
import static fr.openent.form.core.constants.EbFields.FORMULAIRE_ADDRESS;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.Fields.QUESTION_TYPE;
import static fr.openent.form.core.constants.Tables.*;
import static fr.openent.form.helpers.SqlHelper.getParamsForUpdateDateModifFormRequest;
import static fr.openent.form.helpers.SqlHelper.getUpdateDateModifFormRequest;

@RunWith(VertxUnitRunner.class)
public class DefaultQuestionServiceTest {
    private Vertx vertx;
    private DefaultQuestionService defaultQuestionService;

    @Before
    public void setUp(){
        vertx = Vertx.vertx();
        defaultQuestionService = new DefaultQuestionService();
        Sql.getInstance().init(vertx.eventBus(), FORMULAIRE_ADDRESS);
    }

    @Test
    public void testListForForm(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery = "SELECT * FROM " + QUESTION_TABLE + " WHERE form_id = ? AND section_id IS NULL AND matrix_id IS NULL ORDER BY position;";
        JsonArray expectedParams = new JsonArray().add(FORM_ID);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.listForForm(FORM_ID, null);
    }

    @Test
    public void testListForSection(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery = "SELECT * FROM " + QUESTION_TABLE + " WHERE section_id = ? AND matrix_id IS NULL " +
                "ORDER BY section_position;";
        JsonArray expectedParams = new JsonArray().add(SECTION_ID);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.listForSection(SECTION_ID, null);
    }

    @Test
    public void testListForFormAndSection(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery = "SELECT * FROM " + QUESTION_TABLE + " WHERE form_id = ? AND matrix_id IS NULL " +
                "ORDER BY position, section_id, section_position;";
        JsonArray expectedParams = new JsonArray().add(FORM_ID);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.listForFormAndSection(FORM_ID, null);
    }

    @Test
    public void testLisChildren(TestContext ctx) {
        Async async = ctx.async();
        JsonArray questionIds = new JsonArray().add("1").add("2").add("3");
        String expectedQuery = "SELECT * FROM " + QUESTION_TABLE + " WHERE matrix_id IN " + Sql.listPrepared(questionIds);
        JsonArray expectedParams = new JsonArray().addAll(questionIds);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.listChildren(questionIds, null);
    }

    @Test
    public void testExportCSV(TestContext ctx) {
        Async async = ctx.async();
        String getElementPosition = "CASE " +
                "WHEN q.position ISNULL AND s.position IS NOT NULL THEN s.position " +
                "WHEN s.position ISNULL AND q.position IS NOT NULL THEN q.position " +
                "WHEN q.position ISNULL AND s.position ISNULL THEN parent.position " +
                "END";
        String getMatrixPosition = "CASE WHEN q.matrix_id IS NOT NULL THEN RANK() OVER (PARTITION BY q.matrix_id ORDER BY q.id) END";

        String expectedQuery = "SELECT q.*, " + getElementPosition + " AS element_position, " + getMatrixPosition + " AS matrix_position " +
                "FROM " + QUESTION_TABLE + " q " +
                "LEFT JOIN " + QUESTION_TABLE + " parent ON parent.id = q.matrix_id " +
                "LEFT JOIN " + SECTION_TABLE + " s ON q.section_id = s.id " +
                "WHERE q.form_id = ? AND q.question_type NOT IN " + Sql.listPrepared(QUESTIONS_WITHOUT_RESPONSES) +
                "ORDER BY element_position, q.section_position, q.id;";

        JsonArray expectedParams = new JsonArray().add(FORM_ID).addAll(new JsonArray(QUESTIONS_WITHOUT_RESPONSES));

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.export(FORM_ID,false, null);
    }

    @Test
    public void testExportPDF(TestContext ctx) {
        Async async = ctx.async();
        String getElementPosition = "CASE " +
                "WHEN q.position ISNULL AND s.position IS NOT NULL THEN s.position " +
                "WHEN s.position ISNULL AND q.position IS NOT NULL THEN q.position " +
                "WHEN q.position ISNULL AND s.position ISNULL THEN parent.position " +
                "END";
        String getMatrixPosition = "CASE WHEN q.matrix_id IS NOT NULL THEN RANK() OVER (PARTITION BY q.matrix_id ORDER BY q.id) END";

        String expectedQuery = "SELECT q.*, " + getElementPosition + " AS element_position, " + getMatrixPosition + " AS matrix_position " +
                "FROM " + QUESTION_TABLE + " q " +
                "LEFT JOIN " + QUESTION_TABLE + " parent ON parent.id = q.matrix_id " +
                "LEFT JOIN " + SECTION_TABLE + " s ON q.section_id = s.id " +
                "WHERE q.form_id = ? AND q.matrix_id IS NULL " +
                "ORDER BY element_position, q.section_position, q.id;";

        JsonArray expectedParams = new JsonArray().add(FORM_ID);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.export(FORM_ID,true, null);
    }

    @Test
    public void create(TestContext ctx) {
        Async async = ctx.async();
        String expectedQuery = "INSERT INTO " + QUESTION_TABLE + " (form_id, title, position, question_type, statement, " +
                "mandatory, section_id, section_position, conditional, matrix_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;";

        JsonObject question = new JsonObject();
        boolean isConditional = CONDITIONAL_QUESTIONS.contains(question.getInteger(QUESTION_TYPE)) ? question.getBoolean(CONDITIONAL, false) : false;
        JsonArray expectedParams = new JsonArray()
                .add(FORM_ID)
                .add(question.getString(TITLE, ""))
                .add(question.getInteger(SECTION_POSITION, null) != null ? null : question.getInteger(POSITION, null))
                .add(question.getInteger(QUESTION_TYPE, 1))
                .add(question.getString(STATEMENT, ""))
                .add(question.getBoolean(MANDATORY, false) || isConditional)
                .add(question.getInteger(SECTION_ID, null))
                .add(question.getInteger(SECTION_POSITION, null))
                .add(isConditional)
                .add(question.getInteger(MATRIX_ID, null));

        String expectedQueryResult = expectedQuery + getUpdateDateModifFormRequest();
        expectedParams.addAll(getParamsForUpdateDateModifFormRequest(FORM_ID));

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQueryResult, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.create(question, FORM_ID, null);
    }

    @Test
    public void update(TestContext ctx) {
        Async async = ctx.async();
        JsonObject tabQuestion = new JsonObject();
        tabQuestion.put(TITLE, TITLE)
                .put(POSITION, 1)
                .put(QUESTION_TYPE, 1)
                .put(STATEMENT, STATEMENT)
                .put(MANDATORY, false)
                .put(SECTION_ID, 1)
                .put(SECTION_POSITION,1)
                .put(CONDITIONAL, false)
                .put(MATRIX_ID, 1)
                .put(ID, 1);
        JsonObject tabQuestionNew = new JsonObject();
        tabQuestionNew.put(TITLE, "titled")
                .put(POSITION, 2)
                .put(QUESTION_TYPE, 2)
                .put(STATEMENT, "statemented")
                .put(MANDATORY, true)
                .put(SECTION_ID, 2)
                .put(SECTION_POSITION, 2)
                .put(CONDITIONAL, true)
                .put(MATRIX_ID, 2)
                .put(ID, 2);
        JsonArray questions = new JsonArray();
        questions.add(tabQuestion)
                .add(tabQuestionNew);

        String expectedQuery = "[{\"action\":\"raw\",\"command\":\"BEGIN;\"}," +
                "{\"action\":\"prepared\",\"statement\":\"UPDATE " + QUESTION_TABLE + " SET title = ?, position = ?, question_type = ?, statement = ?, mandatory = ?, section_id = ?, section_position = ?, conditional = ?, matrix_id = ? WHERE id = ? RETURNING *;\",\"values\":[\"title\",null,1,\"statement\",false,1,1,false,1,1]}," +
                "{\"action\":\"prepared\",\"statement\":\"UPDATE " + QUESTION_TABLE + " SET title = ?, position = ?, question_type = ?, statement = ?, mandatory = ?, section_id = ?, section_position = ?, conditional = ?, matrix_id = ? WHERE id = ? RETURNING *;\",\"values\":[\"titled\",null,2,\"statemented\",true,2,2,true,2,2]}," +
                "{\"action\":\"prepared\",\"statement\":\"UPDATE " + FORM_TABLE + " SET date_modification = ? WHERE id = ?; \",\"values\":[\"NOW()\",\"form_id\"]}," +
                "{\"action\":\"raw\",\"command\":\"COMMIT;\"}]";


        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(TRANSACTION, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getJsonArray(STATEMENTS).toString());
            async.complete();
        });
        defaultQuestionService.update(FORM_ID, questions,null);
    }

    @Test
    public void delete(TestContext ctx){
        Async async = ctx.async();
        JsonObject tabQuestion = new JsonObject();
        tabQuestion.put(TITLE, TITLE)
                .put(POSITION, 1)
                .put(QUESTION_TYPE, 1)
                .put(STATEMENT, STATEMENT)
                .put(MANDATORY, false)
                .put(SECTION_ID, 1)
                .put(SECTION_POSITION,1)
                .put(CONDITIONAL, false)
                .put(FORM_ID, 1)
                .put(ID, 1);
        String expectedQuery = "DELETE FROM " + QUESTION_TABLE + " WHERE id = ?;";

        JsonArray expectedParams = new JsonArray().add(tabQuestion.getInteger(ID));

        String expectedQueryResult =  expectedQuery + getUpdateDateModifFormRequest();
        expectedParams.addAll(getParamsForUpdateDateModifFormRequest(tabQuestion.getInteger(FORM_ID).toString()));
        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQueryResult, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultQuestionService.delete(tabQuestion, null);
    }
}
