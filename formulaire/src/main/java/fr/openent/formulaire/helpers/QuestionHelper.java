package fr.openent.formulaire.helpers;

import fr.openent.form.helpers.UtilsHelper;
import fr.openent.formulaire.controllers.QuestionController;
import fr.openent.formulaire.service.QuestionSpecificFieldService;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import static fr.openent.form.helpers.UtilsHelper.getIds;
import static fr.wseduc.webutils.http.Renders.renderError;

public class QuestionHelper {

    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);
    private final QuestionSpecificFieldService questionSpecificFieldService;

    public QuestionHelper(QuestionSpecificFieldService questionSpecificFieldService) {
        this.questionSpecificFieldService = questionSpecificFieldService;
    }

    public void syncQuestionSpecs(JsonArray questions, HttpServerRequest request) {
        JsonArray questionIds = getIds(questions);
        if (!questions.isEmpty()) {
            questionSpecificFieldService.listByIds(questionIds)
                    .onSuccess(specEvt -> {
                        JsonArray questionSpecs = specEvt;
                        UtilsHelper.mergeQuestionsAndSpecifics(questions, questionSpecs);
                    })
                    .onFailure(error -> {
                        String message = String.format("[Formulaire@%s::QuestionController] An error has occured" +
                                " when getting specific field: %s", this.getClass().getSimpleName(), error.getMessage());
                        log.error(message, error.getMessage());
                        renderError(request);
                    });
        }
    }
}
