package fr.openent.formulaire.export;

import fr.openent.form.core.enums.QuestionTypes;
import fr.openent.formulaire.service.QuestionChoiceService;
import fr.openent.formulaire.service.QuestionService;
import fr.openent.formulaire.service.QuestionSpecificFieldsService;
import fr.openent.formulaire.service.SectionService;
import fr.openent.formulaire.service.impl.DefaultQuestionChoiceService;
import fr.openent.formulaire.service.impl.DefaultQuestionService;
import fr.openent.formulaire.service.impl.DefaultQuestionSpecificFieldsService;
import fr.openent.formulaire.service.impl.DefaultSectionService;
import fr.wseduc.webutils.data.FileResolver;
import fr.wseduc.webutils.http.Renders;
import io.vertx.core.*;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.pdf.Pdf;
import org.entcore.common.pdf.PdfFactory;
import org.entcore.common.pdf.PdfGenerator;
import org.entcore.common.storage.Storage;

import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

import static fr.openent.form.core.constants.ConfigFields.NODE_PDF_GENERATOR;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.helpers.RenderHelper.renderInternalError;
import static fr.openent.form.helpers.UtilsHelper.*;

public class FormQuestionsExportPDF extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(FormQuestionsExportPDF.class);
    private String node;
    private final HttpServerRequest request;
    private final JsonObject config;
    private final Vertx vertx;
    private final Renders renders;
    private final JsonObject form;
    private final QuestionService questionService = new DefaultQuestionService();
    private final SectionService sectionService = new DefaultSectionService();
    private final QuestionSpecificFieldsService questionSpecificFieldsService = new DefaultQuestionSpecificFieldsService();
    private final QuestionChoiceService questionChoiceService = new DefaultQuestionChoiceService();
    private final PdfFactory pdfFactory;

    public void launch() {
        String formId = form.getInteger(ID).toString();
        questionService.export(formId, true, getQuestionsEvt -> {
            if (getQuestionsEvt.isLeft()) {
                log.error("[Formulaire@FormQuestionsExportPDF::launch] Failed to retrieve all questions for the form with id " + formId);
                renderInternalError(request, getQuestionsEvt);
                return;
            }
            if (getQuestionsEvt.right().getValue().isEmpty()) {
                String errMessage = "[Formulaire@FormQuestionsExportPDF::launch] No questions found for form with id " + formId;
                log.error(errMessage);
                notFound(request, errMessage);
                return;
            }

            sectionService.list(formId, getSectionsEvt -> {
                if (getSectionsEvt.isLeft()) {
                    log.error("[Formulaire@FormResponsesExportPDF::launch] Failed to retrieve all sections for the form with id " + formId);
                    renderInternalError(request, getSectionsEvt);
                    return;
                }

                JsonArray sectionsInfos = getSectionsEvt.right().getValue();
                JsonArray questionsInfos = getQuestionsEvt.right().getValue();
                JsonArray questionsIds = getIds(questionsInfos);
                JsonObject promiseInfos = new JsonObject();

                questionService.listForFormAndSection(formId)
                        .compose(listQuestions -> questionSpecificFieldsService.syncQuestionSpecs(questionsInfos))
                        .compose(questionsWithSpecifics -> questionChoiceService.listChoices(questionsIds))
                        .compose(listChoices -> {
                            promiseInfos.put(QUESTIONS_CHOICES, listChoices);
                            return questionService.listChildren(questionsIds);
                        })
                        .onSuccess(listChildren -> {
                            JsonArray form_elements = new JsonArray();

                            for (int i = 0; i < sectionsInfos.size(); i++) {
                                JsonObject sectionInfo = sectionsInfos.getJsonObject(i);
                                sectionInfo.put(IS_SECTION, true)
                                           .put(QUESTIONS, new JsonArray());
                                form_elements.add(sectionInfo);
                            }

                            for (int i = 0; i < questionsInfos.size(); i++) {
                                JsonObject question = questionsInfos.getJsonObject(i);
                                if (question.containsKey(SECTION_ID) && question.getInteger(SECTION_ID) == null) {
                                    question.put(IS_QUESTION, true);
                                }
                                if (question.containsKey(SECTION_ID) && question.getInteger(SECTION_ID) != null) {
//                                    retrouver la section qui correspond dans la liste des questions
                                    // faire un mapping
                                    // recup l'object question dans la section et l'ajouter dans la liste
                                }

                                for (int j = 0; j < promiseInfos.getJsonArray(QUESTIONS_CHOICES).size(); j++) {
                                    JsonObject choice = promiseInfos.getJsonArray(QUESTIONS_CHOICES).getJsonObject(j);
                                    if (Objects.equals(choice.getInteger(QUESTION_ID), question.getInteger(ID))) {
                                        if (!question.containsKey(CHOICES)) {
                                            // If first choice, create new JsonArray
                                            JsonArray choicesArray = new JsonArray();
                                            choicesArray.add(choice);
                                            question.put(CHOICES, choicesArray);

                                        } else {
                                            // If already exist, add choice to JsonArray
                                            JsonArray choicesArray = question.getJsonArray(CHOICES);
                                            choicesArray.add(choice);
                                        }
                                    }
                                }

                                for (int k = 0; k < listChildren.size(); k ++) {
                                    JsonObject child = listChildren.getJsonObject(k);
                                    if (Objects.equals(child.getInteger(MATRIX_ID), question.getInteger(ID))) {
                                        if (!question.containsKey(CHILD)) {
                                            // If first choice, create new JsonArray
                                            JsonArray matrixChild = new JsonArray();
                                            matrixChild.add(child);
                                            question.put(CHILD, matrixChild);

                                        } else {
                                            // If already exist, add choice to JsonArray
                                            JsonArray matrixChild = question.getJsonArray(CHILD);
                                            matrixChild.add(child);
                                        }
                                    }
                                }

                                if (question.getInteger(QUESTION_TYPE) == QuestionTypes.FREETEXT.getCode()
                                        || question.getInteger(QUESTION_TYPE) == QuestionTypes.SHORTANSWER.getCode()
                                        || question.getInteger(QUESTION_TYPE) == QuestionTypes.LONGANSWER.getCode()) {
                                    question.put(TYPE_TEXT, true);
                                }

                                if (question.getInteger(QUESTION_TYPE) == QuestionTypes.SINGLEANSWERRADIO.getCode()
                                        || question.getInteger(QUESTION_TYPE) == QuestionTypes.SINGLEANSWER.getCode()) {
                                    question.put(RADIO_BTN, true);
                                }

                                if (question.getInteger(QUESTION_TYPE) == QuestionTypes.MULTIPLEANSWER.getCode()) {
                                    question.put(MULTIPLE_CHOICE, true);
                                }

                                if (question.getInteger(QUESTION_TYPE) == QuestionTypes.DATE.getCode()
                                    || question.getInteger(QUESTION_TYPE) == QuestionTypes.TIME.getCode()) {
                                    question.put(DATE_HOUR, true);
                                }

                                if (question.getInteger(QUESTION_TYPE) == QuestionTypes.MATRIX.getCode()) {
                                    question.put(IS_MATRICE, true);
                                }

                                if (question.getInteger(QUESTION_TYPE) == QuestionTypes.CURSOR.getCode()) {
                                    question.put(IS_CURSOR, true);
                                }

                                if (question.getInteger(QUESTION_TYPE) == QuestionTypes.RANKING.getCode()) {
                                    question.put(IS_RANKING, true);
                                }
                                form_elements.add(question);
                            }

                            JsonObject results = new JsonObject()
                                    .put(FORM_ELEMENTS, form_elements)
                                    .put(FORM_TITLE, form.getString(TITLE));

                            generatePDF(request, results,"questions.xhtml", pdf ->
                                    request.response()
                                            .putHeader("Content-Type", "application/pdf; charset=utf-8")
                                            .putHeader("Content-Disposition", "attachment; filename=Questions_" + form.getString(TITLE) + ".pdf")
                                            .end(pdf)
                            );
                        })
                        .onFailure(error -> {
                            String errMessage = String.format("[Formulaire@FormQuestionsExportPDF::launch]  " +
                                            "No questions found for form with id: %s" + formId,
                                    this.getClass().getSimpleName(), error.getMessage());
                            log.error(errMessage);
                        });
            });
        });
    }

    public FormQuestionsExportPDF(HttpServerRequest request, Vertx vertx, JsonObject config, Storage storage, JsonObject form) {
        this.request = request;
        this.config = config;
        this.vertx = vertx;
        this.renders = new Renders(this.vertx, config);
        this.form = form;
        pdfFactory = new PdfFactory(vertx, new JsonObject().put(NODE_PDF_GENERATOR, config.getJsonObject(NODE_PDF_GENERATOR, new JsonObject())));
    }

    private void generatePDF(HttpServerRequest request, JsonObject templateProps, String templateName, Handler<Buffer> handler) {
        Promise<Pdf> promise = Promise.promise();
        final String templatePath = "./public/template/pdf/";
        final String baseUrl = getScheme(request) + "://" + Renders.getHost(request) + config.getString("app-address") + "/public/";

        final String path = FileResolver.absolutePath(templatePath + templateName);

        vertx.fileSystem().readFile(path, result -> {
            if (!result.succeeded()) {
                badRequest(request);
                return;
            }

            StringReader reader = new StringReader(result.result().toString(StandardCharsets.UTF_8));
            renders.processTemplate(request, templateProps, templateName, reader, writer -> {
                String processedTemplate = ((StringWriter) writer).getBuffer().toString();
                if (processedTemplate.isEmpty()) {
                    badRequest(request);
                    return;
                }
                JsonObject actionObject = new JsonObject();
                byte[] bytes;
                bytes = processedTemplate.getBytes(StandardCharsets.UTF_8);

                node = (String) vertx.sharedData().getLocalMap("server").get("node");
                if (node == null) {
                    node = "";
                }

                actionObject.put("content", bytes).put("baseUrl", baseUrl);
                generatePDF(TITLE, processedTemplate)
                        .onSuccess(res -> {
                            handler.handle(res.getContent());
                        })
                        .onFailure(error -> {
                            String message = "[Formulaire@FormQuestionsExportPDF::generatePDF] Failed to generatePDF : " + error.getMessage();
                            log.error(message);
                            promise.fail(message);
                        });
            });
        });
    }

    public Future<Pdf> generatePDF(String filename, String buffer) {
        Promise<Pdf> promise = Promise.promise();
        try {
            PdfGenerator pdfGenerator = pdfFactory.getPdfGenerator();
            pdfGenerator.generatePdfFromTemplate(filename, buffer, ar -> {
                if (ar.failed()) {
                    log.error("[Formulaire@FormQuestionsExportPDF::generatePDF] Failed to generatePdfFromTemplate : " + ar.cause().getMessage());
                    promise.fail(ar.cause().getMessage());
                } else {
                    promise.complete(ar.result());
                }
            });
        }
        catch (Exception e) {
            log.error("[Formulaire@FormQuestionsExportPDF::generatePDF] Failed to generatePDF: " + e.getMessage());
            promise.fail(e.getMessage());
        }
        return promise.future();
    }
}
