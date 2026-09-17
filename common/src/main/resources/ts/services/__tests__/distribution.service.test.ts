import {http} from 'entcore-toolkit';
import {distributionService} from "../DistributionService";
import {mockHttpResponse} from "../../test-utils/httpMock";

jest.mock('entcore-toolkit', () => ({
   ...jest.requireActual('entcore-toolkit'),
   http: {get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn(), postFile: jest.fn(), putFile: jest.fn()}
}));

describe('DistributionService', () => {
   test('returns data when API request is correctly called for listByFormAndStatusAndQuestion method', done => {
      const formId = 1;
      const questionId = 1;
      const status = "status";
      const nbLines = 10;
      const data = { response: true };
      (http.get as jest.Mock).mockResolvedValueOnce(mockHttpResponse(data));
      distributionService.listByFormAndStatusAndQuestion(formId, status, questionId, nbLines).then(response => {
         expect(response).toEqual(data);
         expect(http.get).toHaveBeenCalledWith(`/formulaire/distributions/forms/${formId}/questions/${questionId}/list/${status}?nbLines=${nbLines}`);
         done();
      });
   });
});
