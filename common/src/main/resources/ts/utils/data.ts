import {HttpError, HttpResponse} from "entcore-toolkit";

export class DataUtils {
    static isStatusSuccess = (response: HttpResponse) : any => {
        return response.status >= 200 && response.status < 300;
    };

    static isStatusXXX = (response: HttpResponse, status: number) : any => {
        return response.status === status;
    };

    static getData = (response: HttpResponse) : any => {
        if (DataUtils.isStatusSuccess(response)) { return response.data; }
        else { return null; }
    };

    static getDataIfXXX = (response: HttpResponse, status: number) : any => {
        if (DataUtils.isStatusXXX(response, status)) { return response.data; }
        else { return null; }
    };

    static getDataIf200 = (response: HttpResponse) : any => {
        if (DataUtils.isStatusXXX(response, 200)) { return response.data; }
        else { return null; }
    };

    static getSpecificError = (error: HttpError) : string => {
        if (error && error.response && error.response.data && (error.response.data as any).error) {
            return (error.response.data as any).error;
        }
        return null;
    };
}