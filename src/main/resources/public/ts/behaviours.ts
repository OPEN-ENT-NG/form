import {_, Behaviours} from 'entcore';
import http from "axios";

const rights = {
    resources: {
        contrib: {
            right: "fr-openent-formulaire-controllers-FormController|initContribResourceRight"
        },
        manager: {
            right: "fr-openent-formulaire-controllers-FormController|initManagerResourceRight"
        },
        comment: {
            right: "fr-openent-formulaire-controllers-FormController|initResponderResourceRight"
        }
    },
    workflow: {
        access: 'fr.openent.formulaire.controllers.FormulaireController|render',
        creation: 'fr.openent.formulaire.controllers.FormController|initCreationRight',
        response: 'fr.openent.formulaire.controllers.FormController|initResponseRight'
    }
};

Behaviours.register('formulaire', {
    rights: rights,
    dependencies: {},
    loadResources: async function(): Promise<any>{
        const { data } = await http.get('/formulaire/linker');
        let forms =
            data.map(function(f) {
                if (!!!f.picture) f.picture = '../../../../formulaire/public/img/logo.svg';

                return {
                    id: f.id,
                    icon: f.picture,
                    title: f.title,
                    ownerName: f.owner_name,
                    path: '/formulaire#/form/' + f.id
                }
            });

        this.resources = forms;
    },

    resourceRights: function () {
        return ['contrib', 'manager', 'comment'];
    }
});