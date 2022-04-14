package fr.openent.formulaire.service;

import fr.wseduc.webutils.Either;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.user.UserInfos;

public interface ResponseService {
    /**
     * List all the responses to a specific question
     * @param questionId question identifier
     * @param nbLines number of lines already loaded
     * @param handler function handler returning JsonArray data
     */
    void list(String questionId, String nbLines, JsonArray distribs, Handler<Either<String, JsonArray>> handler);

    /**
     * List all my responses to a specific question for a specific distribution
     * @param questionId question identifier
     * @param distributionId distribution identifier
     * @param user user connected
     * @param handler function handler returning JsonArray data
     */
    void listMineByDistribution(String questionId, String distributionId, UserInfos user, Handler<Either<String, JsonArray>> handler);

    /**
     * List all responses for a specific distribution
     * @param distributionId distribution identifier
     * @param handler function handler returning JsonArray data
     */
    void listByDistribution(String distributionId, Handler<Either<String, JsonArray>> handler);

    /**
     * List all responses for a specific form
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void listByForm(String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * Count all the responses to a list of questions
     * @param questionIds questions identifiers
     * @param handler function handler returning JsonObject data
     */
    void countByQuestions(JsonArray questionIds, Handler<Either<String, JsonObject>> handler);

    /**
     * Get a specific response by id
     * @param responseId response identifier
     * @param handler function handler returning JsonObject data
     */
    void get(String responseId, Handler<Either<String, JsonObject>> handler);

    /**
     * Get question ids of a specific form where specific distribution has missing responses
     * @param formId form identifier
     * @param distributionId distribution identifier
     * @param handler function handler returning JsonArray data
     */
    void getMissingResponses(String formId, String distributionId, Handler<Either<String, JsonArray>> handler);

    /**
     * Create a response
     * @param response JsonObject data
     * @param user user connected
     * @param questionId question identifier
     * @param handler function handler returning JsonObject data
     */
    void create(JsonObject response, UserInfos user, String questionId, Handler<Either<String, JsonObject>> handler);

    /**
     * Create empty responses to fill missing ones for a specific distribution
     * @param questionIds JsonArray ids of missing questions
     * @param distributionId distribution identifier
     * @param user user connected
     * @param handler function handler returning JsonObject data
     */
    void fillResponses(JsonArray questionIds, String distributionId, UserInfos user, Handler<Either<String, JsonObject>> handler);

    /**
     * Update a specific response
     * @param user user connected
     * @param responseId response identifier
     * @param response JsonObject data
     * @param handler function handler returning JsonObject data
     */
    void update(UserInfos user, String responseId, JsonObject response, Handler<Either<String, JsonObject>> handler);

    /**
     * Delete specific responses
     * @param responseIds responses identifiers
     * @param handler function handler returning JsonArray data
     */
    void delete(JsonArray responseIds, Handler<Either<String, JsonArray>> handler);

    /**
     * Delete responses by distribution id
     * @param String distribution identifier
     * @param handler function handler returning JsonArray data
     */
    void deleteMultipleByDistribution(String String, Handler<Either<String, JsonArray>> handler);

    /**
     * Get all the responders of a specific form to export into a CSV file
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void getExportCSVResponders(String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * Get all the responses of a specific form to export into a CSV file
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void exportCSVResponses(String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * Get all the responses of a specific form to export into a PDF file
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void exportPDFResponses(String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * Delete responses too old according to lifetime RGPD chosen
     * @param distributionIds id of deleted distributions
     * @param handler function handler returning JsonObject data
     */
    void deleteOldResponse(JsonArray distributionIds, Handler<Either<String, JsonArray>> handler);
}