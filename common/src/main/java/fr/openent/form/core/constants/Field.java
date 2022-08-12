package fr.openent.form.core.constants;

public class Field {
    // SQL columns
    public static final String ANSWER = "answer";
    public static final String CHOICE_ID = "choice_id";
    public static final String DISTRIBUTION_ID = "distribution_id";
    public static final String FORM_ID = "form_id";
    public static final String ID = "id";
    public static final String QUESTION_ID = "question_id";
    public static final String RESPONDER_ID = "responder_id";
    public static final String STATUS = "status";

    // Request params
    public static final String PARAM_FORM_ID = "formId";
    public static final String PARAM_NB_LINES = "nbLines";
    public static final String PARAM_QUESTION_ID = "questionId";


    private Field() {
        throw new IllegalStateException("Utility class");
    }
}
