// import {Directive, ng} from "entcore";
// import {FormElements, Question, QuestionChoice} from "@common/models";
// import {questionChoiceService, questionService} from "@common/services";
// import {FormElementUtils, I18nUtils} from "@common/utils";
// import {Direction} from "@common/core/enums";
// import {PropPosition} from "@common/core/enums/prop-position";
//
// interface IViewModel {
//     question: Question;
//     hasFormResponses: boolean;
//     formElements: FormElements;
//     matrixType: number;
//     I18n: I18nUtils;
//     Direction: typeof Direction;
//
//     createNewChoice(): void;
//     moveChoice(choice: QuestionChoice, direction: string): void;
//     deleteChoice(index: number): Promise<void>;
//     createNewChild(): void;
//     moveChild(child: Question, direction: string): void;
//     deleteChild(index: number): Promise<void>;
// }
//
// export const questionTypeMatrix: Directive = ng.directive('questionTypeMatrix', () => {
//
//     return {
//         restrict: 'E',
//         transclude: true,
//         scope: {
//             question: '=',
//             hasFormResponses: '=',w
//             formElements: '<',
//             matrixType: '<'
//         },
//         controllerAs: 'vm',
//         bindToController: true,
//         template: `
//
//         `,
//
//         controller: async ($scope) => {
//             const vm: IViewModel = <IViewModel> this;
//         },
//         link: ($scope, $element) => {
//             const vm: IViewModel = $scope.vm;
//             vm.I18n = I18nUtils;
//             vm.Direction = Direction;
//
//             vm.createNewChoice = () : void => {
//                 vm.question.choices.all.push(new QuestionChoice(vm.question.id, vm.question.choices.all.length + 1));
//                 $scope.$apply();
//             };
//
//             vm.moveChoice = (choice: QuestionChoice, direction: string) : void => {
//                 FormElementUtils.switchPositions(vm.question.choices, choice.position - 1, direction, PropPosition.POSITION);
//                 vm.question.choices.all.sort((a: QuestionChoice, b: QuestionChoice) => a.position - b.position);
//                 $scope.$apply();
//             };
//
//             vm.deleteChoice = async (index: number) : Promise<void> => {
//                 if (vm.question.choices.all[index].id) {
//                     await questionChoiceService.delete(vm.question.choices.all[index].id);
//                 }
//                 for (let i = index + 1; i < vm.question.choices.all.length; i++) {
//                     vm.question.choices.all[i].position--;
//                 }
//                 vm.question.choices.all.splice(index,1);
//                 $scope.$apply();
//             };
//
//             vm.createNewChild = () : void => {
//                 vm.question.children.all.push(new Question(vm.question.id, vm.matrixType, vm.question.children.all.length + 1));
//                 $scope.$apply();
//             };
//
//             vm.moveChild = (child: Question, direction: string) : void => {
//                 FormElementUtils.switchPositions(vm.question.children, child.matrix_position - 1, direction, PropPosition.MATRIX_POSITION);
//                 vm.question.children.all.sort((a: Question, b: Question) => a.matrix_position - b.matrix_position);
//                 $scope.$apply();
//             };
//
//             vm.deleteChild = async (index: number) : Promise<void> => {
//                 if (vm.question.children.all[index].id) {
//                     await questionService.delete(vm.question.children.all[index].id);
//                 }
//                 for (let i = index + 1; i < vm.question.children.all.length; i++) {
//                     vm.question.children.all[i].matrix_position--;
//                 }
//                 vm.question.children.all.splice(index,1);
//                 $scope.$apply();
//             };
//         }
//     };
// });
