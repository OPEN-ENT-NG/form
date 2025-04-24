package fr.openent.form.core.constants;

public class ConfigFields {
    public static final String ZIMBRA_MAX_RECIPIENTS = "zimbra-max-recipients";
    public static final String DAYS_BEFORE_NOTIF_CLOSING = "days-before-notif-closing";
    public static final Integer DEFAULT_DAYS_BEFORE_NOTIF_CLOSING = 3;
    public static final String NOTIFY_CRON = "notify-cron";
    public static final String RGPD_CRON = "rgpd-cron";
    public static final String MAX_RESPONSE_EXPORT_PDF = "max-responses-export-PDF";
    public static final String MAX_USERS_SHARING = "max-users-sharing";
    public static final String NODE_PDF_GENERATOR = "node-pdf-generator";
    public static final String PDF_CONNECTOR_ID = "pdf-connector-id";
    public static final String AUTH = "auth";
    public static final String URL = "url";
    public static final String HOST = "host";
    public static final String THEME_PLATFORM = "theme-platform";


    private ConfigFields() {
        throw new IllegalStateException("Utility class");
    }
}

