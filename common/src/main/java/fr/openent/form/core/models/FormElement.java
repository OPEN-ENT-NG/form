package fr.openent.form.core.models;

import static fr.openent.form.core.constants.Fields.*;

import fr.openent.form.core.enums.FormElementTypes;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.List;
import java.util.stream.Collectors;

public abstract class FormElement {
    protected Number id;
    protected Number formId;
    protected String title;
    protected Number position;
    protected FormElementTypes formElementType;


    // Constructors

    public FormElement() {}

    public FormElement(JsonObject formElement) {
        this.id = formElement.getNumber(ID, null);
        this.formId = formElement.getNumber(FORM_ID, null);
        this.title = formElement.getString(TITLE, "");
        this.position = formElement.getNumber(POSITION, null);
        this.formElementType = FormElementTypes.getFormElementType(formElement.getString(FORM_ELEMENT_TYPE, null));
    }


    // Getters

    public Number getId() { return id; }

    public Number getFormId() { return formId; }

    public String getTitle() { return title; }

    public Number getPosition() { return position; }

    public FormElementTypes getFormElementType() { return formElementType; }


    // Setters

    public FormElement setId(Number id) {
        this.id = id;
        return this;
    }

    public FormElement setFormId(Number formId) {
        this.formId = formId;
        return this;
    }

    public FormElement setTitle(String title) {
        this.title = title;
        return this;
    }

    public FormElement setPosition(Number position) {
        this.position = position;
        return this;
    }

    public FormElement setFormElementType(FormElementTypes formElementType) {
        this.formElementType = formElementType;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return new JsonObject()
                .put(ID, this.id)
                .put(FORM_ID, this.formId)
                .put(TITLE, this.title)
                .put(POSITION, this.position)
                .put(FORM_ELEMENT_TYPE, this.formElementType);
    }

    public static List<FormElement> toListFormElements(JsonArray formElements) {
        return formElements.stream()
                .filter(JsonObject.class::isInstance)
                .map(JsonObject.class::cast)
                .map(formElement -> formElement.getString(FORM_ELEMENT_TYPE).equals(FormElementTypes.SECTION.getName())
                        ? new Section(formElement)
                        : new Question(formElement))
                .collect(Collectors.toList());
    }

    public static JsonArray toJsonArrayFormElements(List<FormElement> formElements) {
        return new JsonArray(formElements.stream().map(FormElement::toJson).collect(Collectors.toList()));
    }

    public static List<Section> getSections(List<FormElement> formElements) {
        return formElements.stream()
                .filter(Section.class::isInstance)
                .map(Section.class::cast)
                .collect(Collectors.toList());
    }

    public static List<Question> getQuestions(List<FormElement> formElements) {
        return formElements.stream()
                .filter(Question.class::isInstance)
                .map(Question.class::cast)
                .collect(Collectors.toList());
    }
}

