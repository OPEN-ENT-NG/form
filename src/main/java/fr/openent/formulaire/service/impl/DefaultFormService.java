package fr.openent.formulaire.service.impl;

import fr.openent.formulaire.Formulaire;
import fr.openent.formulaire.service.FormService;
import fr.wseduc.webutils.Either;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.sql.Sql;
import org.entcore.common.sql.SqlResult;
import org.entcore.common.user.UserInfos;
import java.util.List;
import static fr.wseduc.webutils.Utils.handlerToAsyncHandler;

public class DefaultFormService implements FormService {

    @Override
    public void list(List<String> groupsAndUserIds, UserInfos user, Handler<Either<String, JsonArray>> handler) {
        StringBuilder query = new StringBuilder();
        JsonArray params = new JsonArray();

        query.append("SELECT f.*, d.nb_responses, q.nb_questions ")
                .append("FROM ").append(Formulaire.FORM_TABLE).append(" f ")
                .append("LEFT JOIN ").append(Formulaire.FORM_SHARES_TABLE).append(" fs ON f.id = fs.resource_id ")
                .append("LEFT JOIN ").append(Formulaire.MEMBERS_TABLE).append(" m ON (fs.member_id = m.id AND m.group_id IS NOT NULL) ")
                .append("LEFT JOIN (SELECT form_id, COUNT(form_id) AS nb_responses FROM ").append(Formulaire.DISTRIBUTION_TABLE)
                .append(" WHERE status = ? GROUP BY form_id) d ON d.form_id = f.id ")
                .append("LEFT JOIN (SELECT form_id, COUNT(*) AS nb_questions FROM ").append(Formulaire.QUESTION_TABLE)
                .append(" GROUP BY form_id) q ON q.form_id = f.id ");
        params.add(Formulaire.FINISHED);

        query.append(" WHERE (fs.member_id IN ").append(Sql.listPrepared(groupsAndUserIds.toArray()));
        for (String groupOrUser : groupsAndUserIds) {
            params.add(groupOrUser);
        }

        query.append(" AND (fs.action = ? OR fs.action = ?)) OR f.owner_id = ? GROUP BY f.id, d.nb_responses, q.nb_questions ")
                .append("ORDER BY f.date_modification DESC;");
        params.add(Formulaire.MANAGER_RESOURCE_BEHAVIOUR).add(Formulaire.CONTRIB_RESOURCE_BEHAVIOUR).add(user.getUserId());

        Sql.getInstance().prepared(query.toString(), params, SqlResult.validResultHandler(handler));
    }

    @Override
    public void listSentForms(UserInfos user, Handler<Either<String, JsonArray>> handler) {
        String query = "SELECT f.* FROM " + Formulaire.FORM_TABLE + " f " +
                "LEFT JOIN " + Formulaire.DISTRIBUTION_TABLE + " d ON f.id = d.form_id " +
                "WHERE d.responder_id = ? AND NOW() BETWEEN date_opening AND COALESCE(date_ending, NOW() + interval '1 year') " +
                "AND active = ? " +
                "GROUP BY f.id " +
                "ORDER BY title;";
        JsonArray params = new JsonArray().add(user.getUserId()).add(true);
        Sql.getInstance().prepared(query, params, SqlResult.validResultHandler(handler));
    }

    @Override
    public void listForLinker(List<String> groupsAndUserIds, UserInfos user, Handler<Either<String, JsonArray>> handler) {
        StringBuilder query = new StringBuilder();
        JsonArray params = new JsonArray();

        query.append("SELECT f.* FROM ").append(Formulaire.FORM_TABLE).append(" f ")
                .append("LEFT JOIN ").append(Formulaire.FORM_SHARES_TABLE).append(" fs ON f.id = fs.resource_id ")
                .append("LEFT JOIN ").append(Formulaire.MEMBERS_TABLE).append(" m ON (fs.member_id = m.id AND m.group_id IS NOT NULL) ")
                .append("WHERE (fs.member_id IN ").append(Sql.listPrepared(groupsAndUserIds.toArray()))
                .append(" AND fs.action = ?) OR f.owner_id = ? ")
                .append("GROUP BY f.id ")
                .append("ORDER BY f.date_modification DESC;");

        for (String groupOrUser : groupsAndUserIds) {
            params.add(groupOrUser);
        }
        params.add(Formulaire.MANAGER_RESOURCE_BEHAVIOUR).add(user.getUserId());

        Sql.getInstance().prepared(query.toString(), params, SqlResult.validResultHandler(handler));
    }

    @Override
    public void get(String formId, Handler<Either<String, JsonObject>> handler) {
        String query = "SELECT * FROM " + Formulaire.FORM_TABLE + " WHERE id = ?;";
        JsonArray params = new JsonArray().add(formId);
        Sql.getInstance().prepared(query, params, SqlResult.validUniqueResultHandler(handler));
    }

    @Override
    public void create(JsonObject form, UserInfos user, Handler<Either<String, JsonObject>> handler) {
        String query = "INSERT INTO " + Formulaire.FORM_TABLE + " (owner_id, owner_name, title, description, " +
                "picture, date_creation, date_modification, date_opening, date_ending, multiple, anonymous) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;";
        JsonArray params = new JsonArray()
                .add(user.getUserId())
                .add(user.getUsername())
                .add(form.getString("title", ""))
                .add(form.getString("description", ""))
                .add(form.getString("picture", ""))
                .add("NOW()").add("NOW()")
                .add(form.getString("date_opening", "NOW()"))
                .add(form.getString("date_ending", null))
                .add(form.getBoolean("multiple", false))
                .add(form.getBoolean("anonymous", false));

        Sql.getInstance().prepared(query, params, SqlResult.validUniqueResultHandler(handler));
    }

    @Override
    public void createMultiple(JsonArray forms, UserInfos user, Handler<Either<String, JsonArray>> handler) {
        String query = "";
        JsonArray params = new JsonArray();

        List<JsonObject> allForms = forms.getList();
        for (JsonObject form : allForms) {
            query += "INSERT INTO " + Formulaire.FORM_TABLE + " (owner_id, owner_name, title, description, " +
                    "picture, date_creation, date_modification, date_opening, date_ending, multiple, anonymous) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
            params.add(user.getUserId())
                    .add(user.getUsername())
                    .add(form.getString("title", ""))
                    .add(form.getString("description", ""))
                    .add(form.getString("picture", ""))
                    .add("NOW()").add("NOW()")
                    .add(form.getString("date_opening", "NOW()"))
                    .add(form.getString("date_ending", null))
                    .add(form.getBoolean("multiple", false))
                    .add(form.getBoolean("anonymous", false));
        }

        query += "RETURNING *;";
        Sql.getInstance().prepared(query, params, SqlResult.validResultHandler(handler));
    }

    @Override
    public void duplicate(int formId, UserInfos user, Handler<Either<String, JsonArray>> handler) {
        String query = "WITH dForm_id AS (INSERT INTO  " + Formulaire.FORM_TABLE + " (owner_id, owner_name, title, description, picture, date_opening, date_ending, multiple, anonymous) " +
                "SELECT ?, ?, concat(title, ' - Copie'), description, picture, date_opening, date_ending, multiple, anonymous FROM " + Formulaire.FORM_TABLE +
                " WHERE id = ? RETURNING id) " +
                "INSERT INTO " + Formulaire.QUESTION_TABLE + " (form_id, title, position, question_type, statement, mandatory, original_question_id) " +
                "SELECT (SELECT id from dForm_id), title, position, question_type, statement, mandatory, id FROM " + Formulaire.QUESTION_TABLE +
                " WHERE form_id = ? RETURNING id, original_question_id, question_type";
        JsonArray params = new JsonArray().add(user.getUserId()).add(user.getUsername()).add(formId).add(formId);
        Sql.getInstance().prepared(query, params, SqlResult.validResultHandler(handler));
    }

    @Override
    public void update(String formId, JsonObject form, Handler<Either<String, JsonObject>> handler) {
        String query = "WITH nbResponses AS (SELECT COUNT(*) FROM " + Formulaire.DISTRIBUTION_TABLE +
                " WHERE form_id = ? AND status = ?) " +
                "UPDATE " + Formulaire.FORM_TABLE + " SET title = ?, description = ?, picture = ?, date_modification = ?, " +
                "date_opening = ?, date_ending = ?, sent = ?, collab = ?, reminded = ?, archived = ?, " +
                "multiple = CASE (SELECT count > 0 FROM nbResponses) " +
                "WHEN false THEN ? WHEN true THEN (SELECT multiple FROM " + Formulaire.FORM_TABLE +" WHERE id = ?) END, " +
                "anonymous = CASE (SELECT count > 0 FROM nbResponses) " +
                "WHEN false THEN ? WHEN true THEN (SELECT anonymous FROM " + Formulaire.FORM_TABLE +" WHERE id = ?) END " +
                "WHERE id = ? RETURNING *;";

        JsonArray params = new JsonArray()
                .add(formId)
                .add(Formulaire.FINISHED)
                .add(form.getString("title", ""))
                .add(form.getString("description", ""))
                .add(form.getString("picture", ""))
                .add("NOW()")
                .add(form.getString("date_opening", "NOW()"))
                .add(form.getString("date_ending", null))
                .add(form.getBoolean("sent", false))
                .add(form.getBoolean("collab", false))
                .add(form.getBoolean("reminded", false))
                .add(form.getBoolean("archived", false))
                .add(form.getBoolean("multiple", false)).add(formId)
                .add(form.getBoolean("anonymous", false)).add(formId)
                .add(formId);

        Sql.getInstance().prepared(query, params, SqlResult.validUniqueResultHandler(handler));
    }

    @Override
    public void delete(String formId, Handler<Either<String, JsonObject>> handler) {
        String query = "DELETE FROM " + Formulaire.FORM_TABLE + " WHERE id = ?;";
        JsonArray params = new JsonArray().add(formId);
        Sql.getInstance().prepared(query, params, SqlResult.validUniqueResultHandler(handler));
    }

    @Override
    public void getMyFormRights(String formId, List<String> groupsAndUserIds, Handler<Either<String, JsonArray>> handler) {
        String query = "SELECT action FROM " + Formulaire.FORM_SHARES_TABLE +
                " WHERE resource_id = ? AND member_id IN " + Sql.listPrepared(groupsAndUserIds) + " AND action IN (?, ?, ?);";
        JsonArray params = new JsonArray()
                .add(formId)
                .addAll(new fr.wseduc.webutils.collections.JsonArray(groupsAndUserIds))
                .add(Formulaire.CONTRIB_RESOURCE_BEHAVIOUR)
                .add(Formulaire.MANAGER_RESOURCE_BEHAVIOUR)
                .add(Formulaire.RESPONDER_RESOURCE_BEHAVIOUR);
        Sql.getInstance().prepared(query, params, SqlResult.validResultHandler(handler));
    }

    @Override
    public void getAllMyFormRights(List<String> groupsAndUserIds, Handler<Either<String, JsonArray>> handler) {
        String query = "SELECT resource_id, action FROM " + Formulaire.FORM_SHARES_TABLE +
                " WHERE member_id IN " + Sql.listPrepared(groupsAndUserIds) + " AND action IN (?, ?, ?);";
        JsonArray params = new JsonArray()
                .addAll(new fr.wseduc.webutils.collections.JsonArray(groupsAndUserIds))
                .add(Formulaire.CONTRIB_RESOURCE_BEHAVIOUR)
                .add(Formulaire.MANAGER_RESOURCE_BEHAVIOUR)
                .add(Formulaire.RESPONDER_RESOURCE_BEHAVIOUR);
        Sql.getInstance().prepared(query, params, SqlResult.validResultHandler(handler));
    }

    @Override
    public void getImage(EventBus eb, String idImage, Handler<Either<String, JsonObject>> handler) {
        JsonObject action = new JsonObject().put("action", "getDocument").put("id", idImage);
        String WORKSPACE_BUS_ADDRESS = "org.entcore.workspace";
        eb.send(WORKSPACE_BUS_ADDRESS, action, handlerToAsyncHandler(message -> {
            if (idImage.equals("")) {
                handler.handle(new Either.Left<>("[DefaultFormService@getImage] An error id image"));
            } else {
                handler.handle(new Either.Right<>(message.body().getJsonObject("result")));
            }
        }));
    }
}
