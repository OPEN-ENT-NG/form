import {Directive, ng} from "entcore";
import {FormElements, Question, QuestionChoice} from "@common/models";
import {questionChoiceService, questionService} from "@common/services";
import {I18nUtils} from "@common/utils";

interface IViewModel {
    question: Question;
    hasFormResponses: boolean;
    formElements: FormElements;
    matrixType: number;

    I18n: I18nUtils;

    createNewChoice(): void;
    deleteChoice(index: number): Promise<void>;
    createNewChild(): void;
    deleteChild(index: number): Promise<void>;
}

export const questionTypeMatrix: Directive = ng.directive('questionTypeMatrix', () => {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            question: '=',
            hasFormResponses: '=',
            formElements: '<',
            matrixType: '<'
        },
        controllerAs: 'vm',
        bindToController: true,
        template: `
            <div class="twelve matrix">
                <!-- Define the columns' titles (= choices) -->
                <div class="matrix-columns">
                    <h4><i18n>formulaire.matrix.columns</i18n></h4>
                    <div class="choice" ng-repeat="choice in vm.question.choices.all | orderBy:'id'" guard-root="formTitle">
                        <label class="nine">
                            <span style="cursor: default"></span>
                            <input type="text" class="eleven ten-mobile" ng-if="!vm.question.selected" disabled
                                   ng-model="choice.value" placeholder="Option [[$index + 1]]">
                            <input type="text" class="eleven ten-mobile" ng-if="vm.question.selected" input-guard
                                   ng-model="choice.value" placeholder="Option [[$index + 1]]">
                        </label>
                        <i class="i-cancel lg-icon dontSave" ng-click="vm.deleteChoice($index)" ng-if="vm.question.selected && !vm.hasFormResponses"></i>
                    </div>
                    <div style="display: flex; justify-content: center;" ng-if="vm.question.selected && !vm.hasFormResponses">
                        <i class="i-plus-circle lg-icon" ng-click="vm.createNewChoice()"></i>
                    </div>
                </div>
                <!-- Define the lines' titles (= children questions) -->
                <div class="matrix-lines">
                    <h4><i18n>formulaire.matrix.lines</i18n></h4>
                    <div class="choice" ng-repeat="child in vm.question.children.all | orderBy:'id'" guard-root="formTitle">
                        <label class="nine">
                            <span style="cursor: default"></span>
                            <input type="text" class="eleven ten-mobile" ng-if="!vm.question.selected" disabled
                                   ng-model="child.title" placeholder="Option [[$index + 1]]">
                            <input type="text" class="eleven ten-mobile" ng-if="vm.question.selected" input-guard
                                   ng-model="child.title" placeholder="Option [[$index + 1]]">
                        </label>
                        <i class="i-cancel lg-icon dontSave" ng-click="vm.deleteChild($index)" ng-if="vm.question.selected && !vm.hasFormResponses"></i>
                    </div>
                    <div style="display: flex; justify-content: center;" ng-if="vm.question.selected && !vm.hasFormResponses">
                        <i class="i-plus-circle lg-icon" ng-click="vm.createNewChild()"></i>
                    </div>
                </div>
            </div>
        `,

        controller: async ($scope) => {
            const vm: IViewModel = <IViewModel> this;
        },
        link: ($scope, $element) => {
            const vm: IViewModel = $scope.vm;
            vm.I18n = I18nUtils;

            vm.createNewChoice = () : void => {
                vm.question.choices.all.push(new QuestionChoice(vm.question.id));
                $scope.$apply();
            };

            vm.deleteChoice = async (index: number) : Promise<void> => {
                if (vm.question.choices.all[index].id) {
                    await questionChoiceService.delete(vm.question.choices.all[index].id);
                }
                vm.question.choices.all.splice(index,1);
                $scope.$apply();
            };

            vm.createNewChild = () : void => {
                vm.question.children.all.push(new Question(vm.question.id, vm.matrixType));
                $scope.$apply();
            };

            vm.deleteChild = async (index: number) : Promise<void> => {
                if (vm.question.children.all[index].id) {
                    await questionService.delete(vm.question.children.all[index].id);
                }
                vm.question.children.all.splice(index,1);
                $scope.$apply();
            };
        }
    };
});
