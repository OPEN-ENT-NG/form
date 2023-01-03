package fr.openent.formulaire.service.test.impl;

import fr.openent.formulaire.service.impl.DefaultFormService;
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
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;

import static fr.openent.form.core.constants.EbFields.FORMULAIRE_ADDRESS;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.ShareRights.MANAGER_RESOURCE_BEHAVIOUR;
import static fr.openent.form.core.constants.Tables.*;

@RunWith(VertxUnitRunner.class)
public class DefaultFormServiceTest {
    private Vertx vertx;
    private DefaultFormService defaultFormService;

    @Before
    public void setUp(){
        vertx = Vertx.vertx();
        defaultFormService = new DefaultFormService();
        Sql.getInstance().init(vertx.eventBus(), FORMULAIRE_ADDRESS);
    }

    @Test
    public void testListByIds(TestContext ctx) {
        Async async = ctx.async();
        JsonArray formIds = new JsonArray().add("1").add("2").add("3");
        String expectedQuery = "SELECT * FROM " + FORM_TABLE + " WHERE id IN " + Sql.listPrepared(formIds) + ";";
        JsonArray expectedParams = new JsonArray().addAll(formIds);

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });
        defaultFormService.listByIds(formIds, null);
    }

    @Test
    public void testListForLinkerWithEmptyGroupsAndUser(TestContext ctx) {
        Async async = ctx.async();
        List<String> groupsAndUserIds = new ArrayList<>();
        UserInfos user = new UserInfos();
        user.setUserId("userId");

        String expectedQuery = "SELECT f.* FROM " + FORM_TABLE + " f " +
                "LEFT JOIN " + FORM_SHARES_TABLE + " fs ON f.id = fs.resource_id " +
                "LEFT JOIN " + MEMBERS_TABLE + " m ON (fs.member_id = m.id AND m.group_id IS NOT NULL) " +
                "WHERE f.archived = ? AND (f.sent = ? OR f.is_public = ?) AND (f.owner_id = ?) " +
                "GROUP BY f.id " +
                "ORDER BY f.date_modification DESC;";

        JsonArray expectedParams = new JsonArray().add(false).add(true).add(true).add(user.getUserId());

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });

        defaultFormService.listForLinker(groupsAndUserIds, user)
            .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }

    @Test
    public void testListForLinkerWithGroupsAndUser(TestContext ctx) {
        Async async = ctx.async();
        List<String> groupsAndUserIds = new ArrayList<>();
        groupsAndUserIds.add("groupId");
        UserInfos user = new UserInfos();
        user.setUserId("userId");

        String expectedQuery = "SELECT f.* FROM " + FORM_TABLE + " f " +
                "LEFT JOIN " + FORM_SHARES_TABLE + " fs ON f.id = fs.resource_id " +
                "LEFT JOIN " + MEMBERS_TABLE + " m ON (fs.member_id = m.id AND m.group_id IS NOT NULL) " +
                "WHERE f.archived = ? AND (f.sent = ? OR f.is_public = ?) " +
                "AND ((fs.member_id IN " + Sql.listPrepared(groupsAndUserIds.toArray()) +" AND fs.action = ?) OR f.owner_id = ?) " +
                "GROUP BY f.id " +
                "ORDER BY f.date_modification DESC;";

        JsonArray expectedParams = new JsonArray().add(false).add(true).add(true);
        for (String groupOrUser : groupsAndUserIds) {
            expectedParams.add(groupOrUser);
        }
        expectedParams.add(MANAGER_RESOURCE_BEHAVIOUR).add(user.getUserId());

        vertx.eventBus().consumer(FORMULAIRE_ADDRESS, message -> {
            JsonObject body = (JsonObject) message.body();
            ctx.assertEquals(PREPARED, body.getString(ACTION));
            ctx.assertEquals(expectedQuery, body.getString(STATEMENT));
            ctx.assertEquals(expectedParams.toString(), body.getJsonArray(VALUES).toString());
            async.complete();
        });

        defaultFormService.listForLinker(groupsAndUserIds, user)
                .onSuccess(result -> async.complete());

        async.awaitSuccess(10000);
    }
}
