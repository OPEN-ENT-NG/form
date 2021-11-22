import {idiom, ng, notify, moment} from 'entcore';
import http from 'axios';
import {Question, Response, Types} from "../models";
import {DataUtils} from "../utils/data";

export interface ResponseService {
    list(question: Question, nbLines: number) : Promise<any>;
    countByQuestion(questionId : number) : Promise<any>;
    listMineByDistribution(questionId: number, distributionId: number) : Promise<any>;
    listByDistribution(distributionId: number) : Promise<any>;
    get(responseId: number) : Promise<any>;
    save(response: Response, questionType?: number) : Promise<any>;
    create(response: Response) : Promise<any>;
    fillResponses(formId: number, distributionId: number) : Promise<any>;
    update(response: Response) : Promise<any>;
    delete(responseId: number) : Promise<any>;
}

export const responseService: ResponseService = {
    async list(question: Question, nbLines: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.get(`/formulaire/questions/${question.id}/responses?nbLines=${nbLines}&formId=${question.form_id}`));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.list'));
            throw err;
        }
    },
    async countByQuestion (questionId:number):Promise<any>{ //count
        try{
            return DataUtils.getData(await http.get(`/formulaire/questions/${questionId}/responses/count`));
        }catch(err){
            notify.error(idiom.translate('formulaire.error.responseService.list'));
            throw err;
        }
    },

    async listMineByDistribution(questionId: number, distributionId: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.get(`/formulaire/questions/${questionId}/responses/${distributionId}`));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.list'));
            throw err;
        }
    },

    async listByDistribution(distributionId: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.get(`/formulaire/responses/distrib/${distributionId}`));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.list'));
            throw err;
        }
    },

    async get(responseId: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.get(`/formulaire/responses/${responseId}`));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.get'));
            throw err;
        }
    },

    async save(response: Response, questionType?: number) : Promise<any> {
        if (!response.answer) {
            response.answer = "";
        }
        else {
            if (questionType === Types.TIME) {
                if (typeof response.answer != "string") {
                    response.answer = moment(response.answer).format("HH:mm");
                }
            }
            else if (questionType === Types.DATE) {
                if (typeof response.answer != "string") {
                    response.answer = moment(response.answer).format("DD/MM/YYYY");
                }
            }
        }
        return response.id ? await this.update(response) : await this.create(response);
    },

    async create(response: Response) : Promise<any> {
        try {
            return DataUtils.getData(await http.post(`/formulaire/questions/${response.question_id}/responses`, response));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.create'));
            throw err;
        }
    },

    async fillResponses(formId: number, distributionId: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.post(`/formulaire/forms/${formId}/responses/fill/${distributionId}`, {}));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.create'));
            throw err;
        }
    },

    async update(response: Response) : Promise<any> {
        try {
            return DataUtils.getData(await http.put(`/formulaire/responses/${response.id}`, response));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.update'));
            throw err;
        }
    },

    async delete(responseId: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.delete(`/formulaire/responses/${responseId}`));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseService.delete'));
            throw err;
        }
    }
};

export const ResponseService = ng.service('ResponseService', (): ResponseService => responseService);