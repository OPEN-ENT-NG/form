package fr.openent.formulaire.service;

import fr.openent.form.core.models.Form;
import fr.openent.form.core.models.ShareMember;
import fr.wseduc.webutils.Either;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.user.UserInfos;
import java.util.List;
import java.util.Optional;

public interface FormService {

    /**
     * List all forms created by me or shared with me
     * @param groupsAndUserIds list of neo ids including the connected user
     * @param user user connected
     */
    Future<JsonArray> list(List<String> groupsAndUserIds, UserInfos user);

    /**
     * List all forms created by me or shared with me
     * @param groupsAndUserIds list of neo ids including the connected user
     * @param user user connected
     * @param handler function handler returning JsonArray data
     */
    void list(List<String> groupsAndUserIds, UserInfos user, Handler<Either<String, JsonArray>> handler);

    /**
     * @deprecated Should use {@link #listByIds(JsonArray)} instead
     * List all forms by ids
     * @param formIds list of form ids
     * @param handler function handler returning JsonArray data
     */
    @Deprecated
    void listByIds(JsonArray formIds, Handler<Either<String, JsonArray>> handler);

    /**
     * List all forms by ids
     * @param formIds list of form ids
     */
    Future<List<Form>> listByIds(JsonArray formIds);

    /**
     * List all the forms sent to me
     * @param user user connected
     * @param handler function handler returning JsonArray data
     */
    void listSentForms(UserInfos user, Handler<Either<String, JsonArray>> handler);

    /**
     * List all the forms for the linker
     * @param groupsAndUserIds list of neo ids including the connected user
     * @param user user connected
     */
    Future<JsonArray> listForLinker(List<String> groupsAndUserIds, UserInfos user);

    /**
     * List all the contributors to a form
     * @param formId form identifier
     */
    Future<List<ShareMember>> listContributors(String formId);

    /**
     * List all the managers of a form
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void listManagers(String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * List all sent forms opening today
     */
    Future<JsonArray> listSentFormsOpeningToday();

    /**
     * List all forms closing before a given number of days
     */
    Future<List<Form>> listFormsClosingSoon(Integer nbDaysBeforeClosing);

    /**
     * Get a specific form by id
     * @param formId form identifier
     */
    Future<Optional<Form>> get(String formId);

    /**
     * Get a specific form by id
     * @param formId form identifier
     * @param user user connected
     */
    Future<JsonObject> get(String formId, UserInfos user);

    /**
     * @deprecated Should use {@link #get(String, UserInfos)} instead
     * Get a specific form by id
     * @param formId form identifier
     * @param user user connected
     * @param handler function handler returning JsonObject data
     */
    void get(String formId, UserInfos user, Handler<Either<String, JsonObject>> handler);

    /**
     * Create a form
     * @param form JsonObject data
     * @param user user connected
     * @param handler function handler returning JsonObject data
     */
    void create(JsonObject form, UserInfos user, Handler<Either<String, JsonObject>> handler);

    /**
     * Create several forms
     * @param forms JsonArray data
     * @param user user connected
     * @param handler function handler returning JsonArray data
     */
    void createMultiple(JsonArray forms, UserInfos user, Handler<Either<String, JsonArray>> handler);

    /**
     * Duplicate several forms
     * @param formId form identifier
     * @param user user connected
     * @param locale locale language
     * @param handler function handler returning JsonArray data
     */
    void duplicate(int formId, UserInfos user, String locale, Handler<Either<String, JsonArray>> handler);

    /**
     * Update a specific form
     * @param formId form identifier
     * @param form JsonObject data
     * @param handler function handler returning JsonObject data
     */
    void update(String formId, JsonObject form, Handler<Either<String, JsonObject>> handler);

    /**
     * Update a specific form
     * @param form Form data
     */
    Future<Optional<Form>> update(Form form, boolean doesSwitchToPublic);

    /**
     * Update multiple forms
     * @param forms List of forms to update
     */
    Future<List<Form>> updateMultiple(List<Form> forms);

    /**
     * Delete a scpecific form
     * @param formId form identifier
     * @param handler function handler returning JsonObject data
     */
    void delete(String formId, Handler<Either<String, JsonObject>> handler);

    /**
     * Get my rights for a specific form
     * @param formId form identifier
     * @param groupsAndUserIds list of neo ids including the connected user
     * @param handler function handler returning JsonArray data
     */
    void getMyFormRights(String formId, List<String> groupsAndUserIds, Handler<Either<String, JsonArray>> handler);

    /**
     * Get my rights for all the forms
     * @param groupsAndUserIds list of neo ids including the connected user
     * @param handler function handler returning JsonArray data
     */
    void getAllMyFormRights(List<String> groupsAndUserIds, Handler<Either<String, JsonArray>> handler);

    /** Check if the connected user has the rights on a list of specific forms
     * @param groupsAndUserIds list of neo ids including the connected user
     * @param user user connected
     * @param right right to check
     * @param formIds form identifiers
     * @param handler function handler returning JsonObject data
     */
    void checkFormsRights (List<String> groupsAndUserIds, UserInfos user, String right, JsonArray formIds, Handler<Either<String, JsonObject>> handler);
}
