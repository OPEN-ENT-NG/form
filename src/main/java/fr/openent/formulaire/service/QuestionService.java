package fr.openent.formulaire.service;

import fr.wseduc.webutils.Either;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public interface QuestionService {
    /**
     * List all the questions of a specific form
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void list(String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * List all the questions of a specific form without freetext questions
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void export(String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * Count the number of questions in a specific form
     * @param formId form identifier
     * @param handler function handler returning JsonObject data
     */
    void countQuestions(String formId, Handler<Either<String, JsonObject>> handler);

    /**
     * Get a specific question by id
     * @param questionId question identifier
     * @param handler function handler returning JsonObject data
     */
    void get(String questionId, Handler<Either<String, JsonObject>> handler);

    /**
     * Get a specific question by position in a specific form
     * @param formId form identifier
     * @param position position of the specific question
     * @param handler function handler returning JsonObject data
     */
    void getByPosition(String formId, String position, Handler<Either<String, JsonObject>> handler);

    /**
     * Create a question in a specific form
     * @param question JsonObject data
     * @param formId form identifier
     * @param handler function handler returning JsonObject data
     */
    void create(JsonObject question, String formId, Handler<Either<String, JsonObject>> handler);

    /**
     * Create several questions in a specific form
     * @param questions JsonArray data
     * @param formId form identifier
     * @param handler function handler returning JsonArray data
     */
    void createMultiple(JsonArray questions, String formId, Handler<Either<String, JsonArray>> handler);

    /**
     * Update a specific question
     * @param questionId question identifier
     * @param question JsonObject data
     * @param handler function handler returning JsonObject data
     */
    void update(String questionId, JsonObject question, Handler<Either<String, JsonObject>> handler);

    /**
     * Delete a specific question
     * @param questionId question identifier
     * @param handler function handler returning JsonObject data
     */
    void delete(String questionId, Handler<Either<String, JsonObject>> handler);
}
