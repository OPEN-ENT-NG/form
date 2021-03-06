import {Directive, ng} from "entcore";
import {Question, Types} from "../models";

interface IViewModel {
    question: Question,
    types: typeof Types
}

export const questionType: Directive = ng.directive('questionType', () => {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            question: '='
        },
        controllerAs: 'vm',
        bindToController: true,
        replace: true,
        template: `
            <div class="question-type">
                <question-type-freetext question="vm.question" ng-if="vm.question.question_type == vm.types.FREETEXT"></question-type-freetext>
                <question-type-shortanswer question="vm.question" ng-if="vm.question.question_type == vm.types.SHORTANSWER"></question-type-shortanswer>
                <question-type-longanswer question="vm.question" ng-if="vm.question.question_type == vm.types.LONGANSWER"></question-type-longanswer>
                <question-type-singleanswer question="vm.question" ng-if="vm.question.question_type == vm.types.SINGLEANSWER"></question-type-singleanswer>
                <question-type-multipleanswer question="vm.question" ng-if="vm.question.question_type == vm.types.MULTIPLEANSWER"></question-type-multipleanswer>
                <question-type-date question="vm.question" ng-if="vm.question.question_type == vm.types.DATE"></question-type-date>
                <question-type-time question="vm.question" ng-if="vm.question.question_type == vm.types.TIME"></question-type-time>
                <question-type-file question="vm.question" ng-if="vm.question.question_type == vm.types.FILE"></question-type-file>
            </div>
        `,

        controller: async ($scope) => {
            const vm: IViewModel = <IViewModel> this;
        },
        link: ($scope, $element) => {
            const vm: IViewModel = $scope.vm;
            vm.types = Types;
        }
    };
});
