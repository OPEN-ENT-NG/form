import {idiom, ng, notify} from 'entcore';
import http, {AxiosResponse} from 'axios';
import {Distribution, Form} from '../models';

export interface DistributionService {
    list() : Promise<AxiosResponse>;
    listByResponder() : Promise<AxiosResponse>;
    listByForm(formId: number) : Promise<AxiosResponse>;
    listByFormAndStatus(formId: number, status: string, nbLines: number) : Promise<AxiosResponse>;
    listByFormAndResponder(formId: number) : Promise<AxiosResponse>;
    count(formId: number) : Promise<AxiosResponse>;
    get(formId: number) : Promise<AxiosResponse>;
    create(form: Form, distribution: Distribution) : Promise<AxiosResponse>;
    add(formId: number, distribution: Distribution) : Promise<AxiosResponse>;
    update(distribution: Distribution) : Promise<AxiosResponse>;
    delete(distributionId: number) : Promise<AxiosResponse>;
}

export const distributionService: DistributionService = {

    async list() : Promise<AxiosResponse> {
        try {
            return http.get(`/formulaire/distributions`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.list'));
            throw err;
        }
    },

    async listByResponder() : Promise<AxiosResponse> {
        try {
            return http.get(`/formulaire/distributions/listMine`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.list'));
            throw err;
        }
    },

    async listByForm(formId: number) : Promise<AxiosResponse> {
        try {
            return http.get(`/formulaire/distributions/forms/${formId}/list`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.list'));
            throw err;
        }
    },

    async listByFormAndStatus(formId: number, status: string, nbLines: number) : Promise<AxiosResponse> {
        try {
            return http.get(`/formulaire/distributions/forms/${formId}/list/${status}?nbLines=${nbLines}`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.list'));
            throw err;
        }
    },

    async listByFormAndResponder(formId: number) : Promise<AxiosResponse> {
        try {
            return http.get(`/formulaire/distributions/forms/${formId}/listMine`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.list'));
            throw err;
        }
    },

    async count(formId: number) : Promise<AxiosResponse> {
        try {
            return http.get(`/formulaire/distributions/forms/${formId}/count`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.count'));
            throw err;
        }
    },

    async get(formId: number) : Promise<AxiosResponse> {
        try {
            return http.get(`/formulaire/distributions/forms/${formId}`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.get'));
            throw err;
        }
    },

    async create(form: Form, distribution: Distribution) : Promise<AxiosResponse> {
        try {
            return http.post(`/formulaire/distributions/forms/${form.id}`, distribution);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.create'));
            throw err;
        }
    },

    async add(formId: number, distribution: Distribution) : Promise<AxiosResponse> {
        try {
            return http.post(`/formulaire/distributions/forms/${formId}/add`, distribution);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.create'));
            throw err;
        }
    },

    async update(distribution: Distribution) : Promise<AxiosResponse> {
        try {
            return http.put(`/formulaire/distributions/${distribution.id}`, distribution);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.update'));
            throw err;
        }
    },

    async delete(distributionId: number) : Promise<AxiosResponse> {
        try {
            return http.delete(`/formulaire/distributions/${distributionId}`);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.distributionService.delete'));
            throw err;
        }
    }
};

export const DistributionService = ng.service('DistributionService',(): DistributionService => distributionService);