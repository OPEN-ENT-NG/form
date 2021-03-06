import {Directive, ng} from "entcore";
import {Question, QuestionChoice} from "../../models";
import {questionChoiceService} from "../../services";
import {FORMULAIRE_EMIT_EVENT} from "../../core/enums/formulaire-event";

interface IViewModel {
    question: Question,

    createNewChoice(): void,
    deleteChoice(index: number): Promise<void>
}

export const questionTypeMultipleanswer: Directive = ng.directive('questionTypeMultipleanswer', () => {

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
            <div class="eight twelve-mobile">
                <div ng-repeat="choice in vm.question.choices.all">
                    <label for="check-[[choice.id]]">
                        <input type="checkbox" id="check-[[choice.id]]" disabled>
                        <span style="cursor: default"></span>
                        <input type="text" class="ten eight-mobile" ng-model="choice.value" placeholder="Choix [[$index + 1]]" ng-if="!vm.question.selected" disabled>
                        <input type="text" class="ten eight-mobile" ng-model="choice.value" placeholder="Choix [[$index + 1]]" ng-if="vm.question.selected">
                    </label>
                    <i class="cancel lg-icon" ng-click="vm.deleteChoice($index)" ng-if="vm.question.selected"></i>
                </div>
                <div style="display: flex; justify-content: center;" ng-if="vm.question.selected">
                    <i class="plus-circle lg-icon" ng-click="vm.createNewChoice()"></i>
                </div>
            </div>
        `,

        controller: async ($scope) => {
            const vm: IViewModel = <IViewModel> this;
        },
        link: ($scope, $element) => {
            const vm: IViewModel = $scope.vm;

            vm.createNewChoice = () : void => {
                vm.question.choices.all.push(new QuestionChoice(vm.question.id));
                $scope.$emit(FORMULAIRE_EMIT_EVENT.REFRESH);
            };

            vm.deleteChoice = async (index: number) : Promise<void> => {
                if (!!vm.question.choices.all[index].id) {
                    await questionChoiceService.delete(vm.question.choices.all[index].id);
                }
                vm.question.choices.all.splice(index,1);
                $scope.$emit(FORMULAIRE_EMIT_EVENT.REFRESH);
            };
        }
    };
});
