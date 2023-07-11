package fr.openent.formulaire.export;

import fr.openent.form.core.enums.I18nKeys;
import fr.openent.form.core.enums.QuestionTypes;
import fr.openent.form.helpers.I18nHelper;
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
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.bus.WorkspaceHelper;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.pdf.Pdf;
import org.entcore.common.pdf.PdfFactory;
import org.entcore.common.pdf.PdfGenerator;
import org.entcore.common.storage.Storage;

import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import static fr.openent.form.core.constants.ConfigFields.NODE_PDF_GENERATOR;
import static fr.openent.form.core.constants.Fields.*;
import static fr.openent.form.helpers.RenderHelper.renderInternalError;
import static fr.openent.form.helpers.UtilsHelper.getIds;

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
    private final Storage storage;
    private final EventBus eb;

    public FormQuestionsExportPDF(HttpServerRequest request, Vertx vertx, JsonObject config, Storage storage, EventBus eb, JsonObject form) {
        this.request = request;
        this.config = config;
        this.vertx = vertx;
        this.renders = new Renders(this.vertx, config);
        this.form = form;
        this.storage = storage;
        this.eb = eb;
        pdfFactory = new PdfFactory(vertx, new JsonObject().put(NODE_PDF_GENERATOR, config.getJsonObject(NODE_PDF_GENERATOR, new JsonObject())));
    }

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
                Map<Integer, JsonObject> mapQuestions = new HashMap<>();
                Map<Integer, JsonObject> mapSections = new HashMap<>();
                List<Future> imageInfos = new ArrayList<>();
                JsonArray form_elements = new JsonArray();

                fillMap(sectionsInfos, mapSections);
                fillMap(questionsInfos, mapQuestions);

                questionSpecificFieldsService.syncQuestionSpecs(questionsInfos)
                        .compose(questionsWithSpecifics -> questionChoiceService.listChoices(questionsIds))
                        .compose(listChoices -> {
                            promiseInfos.put(QUESTIONS_CHOICES, listChoices);
                            return questionService.listChildren(questionsIds);
                        })
                        .onSuccess(listChildren -> {
                            //CHOICES
                            //Set Title to choices if needed
                            promiseInfos.getJsonArray(QUESTIONS_CHOICES).stream()
                                    .filter(Objects::nonNull)
                                    .map(JsonObject.class::cast)
                                    .filter(choice -> choice.getInteger(NEXT_FORM_ELEMENT_ID) != null)
                                    .forEach(conditionalChoice -> {
                                        Integer nextQuestionId = conditionalChoice.getInteger(NEXT_FORM_ELEMENT_ID);
                                        if (nextQuestionId != null) {
                                            String titleNext = null;
                                            JsonObject nextQuestion = mapQuestions.get(nextQuestionId);
                                            JsonObject nextSection = mapSections.get(nextQuestionId);
                                            if (nextQuestion != null) {
                                                titleNext = nextQuestion.getString(TITLE);
                                            } else if (nextSection != null) {
                                                titleNext = nextSection.getString(TITLE);
                                            }
                                            if (titleNext != null) {
                                                conditionalChoice.put(TITLE_NEXT, titleNext);
                                            }
                                        } else {
                                            conditionalChoice.put(TITLE_NEXT, I18nHelper.getI18nValue(I18nKeys.END_FORM, request));
                                        }
                                    });


                            //Add Images to questionChoices
                            promiseInfos.getJsonArray(QUESTIONS_CHOICES).stream()
                                    .filter(Objects::nonNull)
                                    .map(JsonObject.class::cast)
                                    .filter(choice -> choice.containsKey(IMAGE))
                                    .forEach(choice -> imageInfos.add(getImageData(choice)));


                             //Get choices images, affect them to their respective choice and send the result
                            CompositeFuture.all(imageInfos).onComplete(evt -> {
                                if (evt.failed()) {
                                    log.error("[Formulaire@FormQuestionsExportPDF::FormQuestionsExportPDF] Failed to retrieve choices' image : " + evt.cause());
                                    Future.failedFuture(evt.cause());
                                    return;
                                }

                                Map<String, String> localChoicesMap = new HashMap<>();
                                imageInfos.stream()
                                        .map(Future::result)
                                        .map(JsonObject.class::cast)
                                        .filter(Objects::nonNull)
                                        .filter(imageInfo -> imageInfo.containsKey(ID) && imageInfo.containsKey(DATA))
                                        .forEach(imageInfo -> localChoicesMap.put(imageInfo.getString(ID), imageInfo.getString(DATA)));

                              // Affect images to corresponding choices (we have to iterate like previously to keep the same order)
                                promiseInfos.getJsonArray(QUESTIONS_CHOICES).stream()
                                    .filter(Objects::nonNull)
                                    .map(JsonObject.class::cast)
                                    .filter(choice -> choice.containsKey(IMAGE))
                                    .forEach(choice -> {
                                        String choiceImageId = getImageId(choice);
                                        String imageData = localChoicesMap.get(choiceImageId);
                                        choice.put(PARAM_CHOICE_IMAGE, imageData);
                                    });

                                //END CHOICES

                                //START QUESTIONS
                                //Set isQuestion && is_Conditional && type
                                questionsInfos.stream()
                                        .filter(Objects::nonNull)
                                        .map(JsonObject.class::cast)
                                        .forEach(q -> {
                                            if(q.getInteger(SECTION_ID) == null){
                                                q.put(IS_QUESTION, true);
                                            }
                                            setType(q);
                                        });


                                //Matrix questions
                                questionsInfos.stream()
                                    .filter(Objects::nonNull)
                                    .map(JsonObject.class::cast)
                                    .forEach(question -> {
                                        for (int k = 0; k < listChildren.size(); k++) {
                                            JsonObject child = listChildren.getJsonObject(k);
                                            if (Objects.equals(child.getInteger(MATRIX_ID), question.getInteger(ID))) {
                                                if (question.containsKey(CHILDREN)) {
                                                    question.getJsonArray(CHILDREN).add(child);
                                                    if (Integer.valueOf(QuestionTypes.SINGLEANSWERRADIO.getCode()).equals(child.getInteger(QUESTION_TYPE))) {
                                                        question.put(IS_MATRIX_SINGLE, true);
                                                    }
                                                    if (Integer.valueOf(QuestionTypes.MULTIPLEANSWER.getCode()).equals(child.getInteger(QUESTION_TYPE))) {
                                                        question.put(IS_MATRIX_MULTIPLE, true);
                                                    }
                                                } else {
                                                    question.put(CHILDREN, new JsonArray().add(child));
                                                }
                                            }
                                        }
                                    });


                                //Add choices to questions
                                questionsInfos.stream()
                                        .map(JsonObject.class::cast)
                                        .forEach(question -> {
                                            JsonArray choices = promiseInfos.getJsonArray(QUESTIONS_CHOICES).stream()
                                                    .map(JsonObject.class::cast)
                                                    .filter(choice -> Objects.equals(choice.getInteger(QUESTION_ID), question.getInteger(ID)))
                                                    .collect(JsonArray::new, JsonArray::add, JsonArray::addAll);

                                            List<JsonObject> choicesList = choices.getList();
                                            choicesList.sort(Comparator.nullsFirst(Comparator.comparingInt(a -> a.getInteger(POSITION))));
                                            choices = new JsonArray(choicesList);
                                            question.put(CHOICES, choices);

                                            if(mapSections.containsKey(question.getInteger(SECTION_ID))){
                                                JsonObject section = mapSections.get(question.getInteger(SECTION_ID));
                                                section.put(IS_SECTION, true);
                                                section.put("questions", question);
                                                form_elements.add(section);
                                            } else {
                                                form_elements.add(question);
                                            }
                                        });

                                //Add sections with no questions
                                List<Integer> formElementSectionIds = new ArrayList<>();
                                List<Integer> sectionsId = new ArrayList<>(mapSections.keySet());
                                form_elements.stream()
                                        .map(JsonObject.class::cast)
                                        .filter(element -> element.containsKey(IS_SECTION) && element.getBoolean(IS_SECTION))
                                        .forEach(section -> {
                                            formElementSectionIds.add(section.getInteger(ID));
                                        });

                                if(!sectionsId.isEmpty() && !formElementSectionIds.isEmpty()){
                                    sectionsId.removeAll(formElementSectionIds);
                                    sectionsId.forEach(remainSectionId -> {
                                                JsonObject section = mapSections.get(remainSectionId);
                                                section.put(IS_SECTION, true);
                                                form_elements.add(section);
                                            });
                                }

                                List<JsonObject> sorted_form_elements = form_elements.getList();
                                sorted_form_elements.removeIf(element -> element.getInteger(POSITION) == null);
                                sorted_form_elements.sort(Comparator.nullsFirst(Comparator.comparingInt(a -> a.getInteger(POSITION))));
                                JsonObject results = new JsonObject()
                                        .put(FORM_ELEMENTS, sorted_form_elements)
                                        .put(FORM_TITLE, form.getString(TITLE));

                                generatePDF(request, results,"questions.xhtml", pdf ->
                                        request.response()
                                                .putHeader("Content-Type", "application/pdf; charset=utf-8")
                                                .putHeader("Content-Disposition", "attachment; filename=Questions_" + form.getString(TITLE) + ".pdf")
                                                .end(pdf)
                                );
                            });
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





    /**
     * Fill a HashMap with the id of JsonObjects as key and JsonObject as value
     * @param jsonArray array to be streamed
     * @param hashMap to be filled
     */
    private void fillMap(JsonArray jsonArray, Map<Integer, JsonObject> hashMap){
        jsonArray.stream()
                .filter(Objects::nonNull)
                .map(JsonObject.class::cast)
                .forEach(infos -> {
                    hashMap.put(infos.getInteger(ID), infos);
                });
    }

    /**
     * Take a question and add its type corresponding to the question type integer value
     * @param question question which type must be defined
     */
    private void setType(JsonObject question){
        switch (QuestionTypes.values()[question.getInteger(QUESTION_TYPE) - 1]) {
            case FREETEXT:
                question.put(TYPE_FREETEXT, true);
                break;
            case SHORTANSWER:
                question.put(SHORT_ANSWER, true);
                break;
            case LONGANSWER:
                question.put(LONG_ANSWER, true);
                break;
            case SINGLEANSWERRADIO:
            case SINGLEANSWER:
                question.put(RADIO_BTN, true);
                break;
            case MULTIPLEANSWER:
                question.put(MULTIPLE_CHOICE, true);
                break;
            case DATE:
            case TIME:
                question.put(DATE_HOUR, true);
                break;
            case MATRIX:
                question.put(IS_MATRIX, true);
                break;
            case CURSOR:
                question.put(IS_CURSOR, true);
                break;
            case RANKING:
                question.put(IS_RANKING, true);
                break;
            default:
                break;
        }
    }

    /**
     * Get all the titles of next form element to add them in JsonArray question choices and then sort choices by position
     * @param questionChoices choices from conditional questions
     * @param mapSections map with all sections
     * @param mapQuestions map with all questions but not in sections
     */
    private void addNextTitleToQuestionChoices(JsonArray questionChoices, Map<Integer, JsonObject> mapSections, Map<Integer, JsonObject> mapQuestions){
        if( questionChoices == null || questionChoices.isEmpty())return;
        for (int j = 0; j < questionChoices.size(); j++) {
            JsonObject choice = questionChoices.getJsonObject(j);
            if (choice != null && choice.containsKey(NEXT_FORM_ELEMENT_ID)) {
                Integer nextQuestionId = choice.getInteger(NEXT_FORM_ELEMENT_ID);
                if (nextQuestionId != null) {
                    String titleNext = null;
                    JsonObject nextQuestion = mapQuestions.get(nextQuestionId);
                    JsonObject nextSection = mapSections.get(nextQuestionId);
                    if (nextQuestion != null) {
                        titleNext = nextQuestion.getString(TITLE);
                    } else if (nextSection != null) {
                        titleNext = nextSection.getString(TITLE);
                    }

                    if(titleNext != null){
                        choice.put(TITLE_NEXT, titleNext);
                    }
                } else {
                    choice.put(TITLE_NEXT, I18nHelper.getI18nValue(I18nKeys.END_FORM, request));
                }
            }
        }
        List<JsonObject> choicesList = questionChoices.getList();
        choicesList.sort(Comparator.nullsFirst(Comparator.comparingInt(a -> a.getInteger(POSITION))));
    }

    // Get image data thanks to its id
    public Future<JsonObject> getImageData(JsonObject choice) {
        Promise<JsonObject> promise = Promise.promise();

        String documentId = getImageId(choice);
        if (documentId == null || documentId.equals("")) {
            String errorMessage = "[Formulaire@FormQuestionsExportPDF::getImageData] The document id must not be empty.";
            log.error(errorMessage);
            promise.complete(null);
            return promise.future();
        }

        WorkspaceHelper workspaceHelper = new WorkspaceHelper(eb, storage);
        workspaceHelper.readDocument(documentId, documentEvt -> {
            String graph = Base64.getEncoder().encodeToString(documentEvt.getData().getBytes());
            graph = "data:" + documentEvt.getDocument().getJsonObject(METADATA, new JsonObject()).getString(CONTENT_TYPE, "image/png") + ";base64," + graph;
            JsonObject imageInfos = new JsonObject().put(ID, documentId).put(DATA, graph);
            promise.complete(imageInfos);
        });

        return promise.future();
    }

    private String getImageId(JsonObject questionChoice) {
        String imagePath = questionChoice.getString(IMAGE);
        return getImageId(imagePath);
    }

    private String getImageId(String imagePath) {
        if (imagePath == null) return null;
        int lastSeparator = imagePath.lastIndexOf(SLASH);
        return lastSeparator > 0 ? imagePath.substring(lastSeparator + 1) : imagePath;
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

                node = (String) vertx.sharedData().getLocalMap(SERVER).get(NODE);
                if (node == null) {
                    node = "";
                }

                actionObject.put(CONTENT, bytes).put(BASE_URL, baseUrl);
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
