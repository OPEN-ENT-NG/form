import {idiom, ng, notify} from 'entcore';
import http from 'axios';
import {
    IQuestionChoiceResponse, Question,
    QuestionChoice,
    QuestionChoicePayload
} from '../models';
import {DataUtils} from "../utils";

export interface QuestionChoiceService {
    list(questionId: number) : Promise<any>;
    listChoices(questionIds: number[]) : Promise<any>;
    save(choice: QuestionChoice) : Promise<any>;
    saveMultiple(choices: QuestionChoice[], formId: number) : Promise<QuestionChoice[]>;
    create(choice: QuestionChoice) : Promise<any>;
    createMultiple(choices: QuestionChoice[], formId: number) : Promise<QuestionChoice[]>;
    update(choice: QuestionChoice) : Promise<any>;
    updateMultiple(choices: QuestionChoice[], formId: number) : Promise<QuestionChoice[]>;
    delete(choiceId: number) : Promise<any>;
}

export const questionChoiceService: QuestionChoiceService = {

    async list(questionId: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.get(`/formulaire/questions/${questionId}/choices`, { headers: { Accept: 'application/json;version=1.9'} }));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionChoiceService.list'));
            throw err;
        }
    },

    async listChoices(questionIds: number[]) : Promise<any>{
        try{
            if (!questionIds || questionIds.length <= 0) return [];
            return DataUtils.getData(await http.get(`/formulaire/questions/choices/all`, { params: questionIds, headers: { Accept: 'application/json;version=1.9'} }));
        } catch(err){
            notify.error(idiom.translate('formulaire.error.questionChoiceService.list'));
            throw err;
        }
    },

    async save(choice: QuestionChoice) : Promise<any> {
        return choice.id ? await this.update(choice) : await this.create(choice);
    },

    async saveMultiple(choices: QuestionChoice[], formId: number) : Promise<QuestionChoice[]> {
        let choicesToUpdate: QuestionChoice[] = choices.filter((c: QuestionChoice) => c.id);
        let choicesToCreate: QuestionChoice[] = choices.filter((c: QuestionChoice) => !c.id);
        let promises: Promise<QuestionChoice[]>[] = [this.updateMultiple(choicesToUpdate, formId), this.createMultiple(choicesToCreate, formId)];
        try {
            let results: QuestionChoice[][] = await Promise.all(promises);
            return results[0].concat(results[1]);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionChoiceService.save'));
            throw err;
        }
    },

    async create(choice: QuestionChoice) : Promise<any> {
        try {
            let choicePayload: QuestionChoicePayload = new QuestionChoicePayload(choice);
            return DataUtils.getData(await http.post(`/formulaire/questions/${choice.question_id}/choices`, choicePayload, { headers: { Accept: 'application/json;version=1.9'} }));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionChoiceService.create'));
            throw err;
        }
    },

    async createMultiple(choices: QuestionChoice[], formId: number) : Promise<QuestionChoice[]> {
        try {
            if (!choices || choices.length <= 0) return [];
            let choicesPayload: QuestionChoicePayload[] = choices.map((c: QuestionChoice) => new QuestionChoicePayload(c));
            let data: IQuestionChoiceResponse[] = DataUtils.getData(await http.post(`/formulaire/${formId}/choices`, choicesPayload));
            return data.map((qcr: IQuestionChoiceResponse) => new QuestionChoice().build(qcr));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionChoiceService.create'));
            throw err;
        }
    },

    async update(choice: QuestionChoice) : Promise<any> {
        try {
            let choicePayload: QuestionChoicePayload = new QuestionChoicePayload(choice);
            return DataUtils.getData(await http.put(`/formulaire/choices/${choice.id}`, choicePayload, { headers: { Accept: 'application/json;version=1.9'} }));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionChoiceService.update'));
            throw err;
        }
    },

    async updateMultiple(choices: QuestionChoice[], formId: number) : Promise<QuestionChoice[]> {
        try {
            if (!choices || choices.length <= 0) return [];
            let choicesPayload: QuestionChoicePayload[] = choices.map((c: QuestionChoice) => new QuestionChoicePayload(c));
            let data: IQuestionChoiceResponse[] = DataUtils.getData(await http.put(`/formulaire/${formId}/choices`, choicesPayload));
            return data.map((qcr: IQuestionChoiceResponse) => new QuestionChoice().build(qcr));
        } catch (err) {
            throw err;
        }
    },

    async delete(choiceId: number) : Promise<any> {
        try {
            return DataUtils.getData(await http.delete(`/formulaire/choices/${choiceId}`));
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionChoiceService.delete'));
            throw err;
        }
    }
};

export const QuestionChoiceService = ng.service('QuestionChoiceService',(): QuestionChoiceService => questionChoiceService);