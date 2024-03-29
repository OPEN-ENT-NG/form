import {idiom, ng, notify} from 'entcore';
import http from 'axios';
import {DataUtils} from "../utils";

export interface QuestionTypeService {
    list() : Promise<any>;
}

export const questionTypeService: QuestionTypeService = {

    async list() : Promise<any> {
        try {
            return DataUtils.getData(await http.get(`/formulaire/types`));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionTypeService.list'));
            throw err;
        }
    }
};

export const QuestionTypeService = ng.service('QuestionTypeService', (): QuestionTypeService => questionTypeService);