package fr.openent.formulaire.service;

import fr.wseduc.webutils.security.SecuredAction;
import java.util.Map;

public class ServiceFactory {

    private static volatile ServiceFactory instance;
    private final Map<String, SecuredAction> securedActions;

    private ServiceFactory(Map<String, SecuredAction> securedActions) {
        this.securedActions = securedActions;
    }

    public static void initialize(Map<String, SecuredAction> securedActions) {
        if (instance == null) {
            synchronized (ServiceFactory.class) {
                if (instance == null) {
                    instance = new ServiceFactory(securedActions);
                } else {
                    throw new IllegalStateException("ServiceFactory is already initialized");
                }
            }
        } else {
            throw new IllegalStateException("ServiceFactory is already initialized");
        }
    }

    public static ServiceFactory getInstance() {
        if (instance == null) {
            throw new IllegalStateException("ServiceFactory not initialized yet");
        }
        return instance;
    }

    public Map<String, SecuredAction> getSecuredActions() {
        return securedActions;
    }
}