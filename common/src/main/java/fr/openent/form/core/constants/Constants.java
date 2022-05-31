package fr.openent.form.core.constants;

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
    public static final List<Integer> RGPD_LIFETIME_VALUES = Arrays.asList(3,6,9,12);
    public static final List<Integer> GRAPH_QUESTIONS = Arrays.asList(4,5,9);
    public static final List<Integer> CONDITIONAL_QUESTIONS = Arrays.asList(4,5,9);

    private Constants() {
        throw new IllegalStateException("Utility class");
    }
}
