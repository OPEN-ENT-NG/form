package fr.openent.form.core.constants;

import fr.openent.form.core.enums.QuestionTypes;

import java.util.Arrays;
import java.util.List;

public class Constants {
    public static final String ARCHIVE_ZIP_NAME = "Fichiers déposés";
    public static int MAX_RESPONSES_EXPORT_PDF;
    public static int MAX_USERS_SHARING;
    public static final int NB_NEW_LINES = 10;
    public static final String DELETED_USER = "Utilisateur supprimé";
    public static final String DELETED_USER_FILE = "utilisateurSupprimé_Fichier";
    public static final String UNKNOW_STRUCTURE = "Structure inconnue";
    public static final String COPY = "Copie";
    public static final List<Integer> RGPD_LIFETIME_VALUES = Arrays.asList(3,6,9,12);
    public static final List<Integer> GRAPH_QUESTIONS = QuestionTypes.getGraphQuestions();
    public static final List<Integer> CONDITIONAL_QUESTIONS = QuestionTypes.getConditionalQuestions();
    public static final List<Integer> CHOICES_TYPE_QUESTIONS = QuestionTypes.getChoicesTypeQuestions();
    public static final List<Integer> QUESTIONS_WITHOUT_RESPONSES = QuestionTypes.getQuestionsWithoutResponses();
    public static final List<Integer> FORBIDDEN_QUESTIONS = QuestionTypes.getForbiddenQuestions();
    public static final List<Integer> MATRIX_CHILD_QUESTIONS = QuestionTypes.getMatrixChildQuestions();

    private Constants() {
        throw new IllegalStateException("Utility class");
    }
}

