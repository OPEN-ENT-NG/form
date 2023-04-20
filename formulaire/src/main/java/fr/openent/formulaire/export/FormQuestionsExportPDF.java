package fr.openent.formulaire.export;

import fr.openent.formulaire.service.QuestionService;
import fr.openent.formulaire.service.QuestionSpecificFieldsService;
import fr.openent.formulaire.service.SectionService;
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
import org.entcore.common.pdf.Pdf;
import org.entcore.common.pdf.PdfFactory;
import org.entcore.common.pdf.PdfGenerator;
import org.entcore.common.storage.Storage;

import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;

import static fr.openent.form.core.constants.ConfigFields.NODE_PDF_GENERATOR;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.core.constants.Fields.PARAM_ID_IMAGES_FILES;
import static fr.openent.form.helpers.RenderHelper.renderInternalError;
import static fr.wseduc.webutils.http.Renders.*;
import static fr.wseduc.webutils.http.Renders.badRequest;

public class FormQuestionsExportPDF {
    private static final Logger log = LoggerFactory.getLogger(FormQuestionsExportPDF.class);
    private String node;
    private final HttpServerRequest request;
    private final JsonObject config;
    private final Vertx vertx;
    private final Storage storage;
    private final Renders renders;
    private final JsonObject form;
    private final QuestionService questionService = new DefaultQuestionService();
    private final SectionService sectionService = new DefaultSectionService();
    private final QuestionSpecificFieldsService questionSpecificFieldsService = new DefaultQuestionSpecificFieldsService();
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

                questionService.listForFormAndSection(formId)
                        .onSuccess(listQuestionsEvt -> {
                            questionSpecificFieldsService.syncQuestionSpecs(listQuestionsEvt);
                            JsonObject results = listQuestionsEvt.getJsonObject(0);
                            results.put(IS_QUESTION, true);
                            results.put(FORM_TITLE, form.getString(TITLE));

                            // Finish to fill final object with useful form's data
                            results.put(FORM_TITLE, form.getString(TITLE));
                            results.put(ANONYMOUS, form.getBoolean(ANONYMOUS));

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
        this.storage = storage;
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

                            // Remove image files generated for graph display on PDF
                            JsonArray removesFiles = templateProps.getJsonArray(PARAM_ID_IMAGES_FILES);
                            if (removesFiles != null) {
                                storage.removeFiles(removesFiles, removeEvt -> {
                                    log.info(" [Formulaire@FormQuestionsExportPDF::generatePDF] " + removeEvt.encode());
                                });
                            }
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
