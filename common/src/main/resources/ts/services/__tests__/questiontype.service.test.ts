import {http} from 'entcore-toolkit';
import {questionTypeService} from "../QuestionTypeService";
import {mockHttpResponse} from "../../test-utils/httpMock";

jest.mock('entcore-toolkit', () => ({
   ...jest.requireActual('entcore-toolkit'),
   http: {get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn(), postFile: jest.fn(), putFile: jest.fn()}
}));

describe('QuestionTypeService', () => {
   test('returns data in list when retrieve is correctly called', done => {
      const data = {response: true};
      (http.get as jest.Mock).mockResolvedValueOnce(mockHttpResponse(data));
      questionTypeService.list().then(response => {
         expect(response).toEqual(data);
         done();
      });
   });

   test('return data in list when retrieve is correctly called other method', done => {
      (http.get as jest.Mock).mockResolvedValueOnce(mockHttpResponse({}));
      questionTypeService.list().then(() => {
         expect(http.get).toHaveBeenCalledWith('/formulaire/types');
         done();
      });
   });
});
