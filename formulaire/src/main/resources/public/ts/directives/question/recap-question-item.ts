import {Directive, idiom, ng} from "entcore";
import {
    Distribution,
    DistributionStatus,
    Form,
    FormElements,
    Question,
    QuestionChoice,
    Response,
    Responses,
    Types
} from "../../models";
import {FORMULAIRE_EMIT_EVENT} from "@common/core/enums";

interface IViewModel {
    question: Question;
    responses: Responses;
    form: Form;
    formElements: FormElements;
    distribution: Distribution;
    historicPosition: number[];
    Types: typeof Types;
    DistributionStatus: typeof DistributionStatus;

    getStringResponse(): string;
    isSelectedChoice(choice: QuestionChoice, child?: Question) : boolean;
    getResponseFileNames() : string[];
    openQuestion(): void;
}

export const recapQuestionItem: Directive = ng.directive('recapQuestionItem', () => {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            question: '=',
            responses: '=',
            form: '=',
            formElements: '<',
            distribution: '=',
            historicPosition: '<'
        },
        controllerAs: 'vm',
        bindToController: true,
        template: `
                <div class="question">
                    <div class="question-title">
                        <h4>[[vm.question.title]]<span ng-if="vm.question.mandatory" style="color:red; margin-left:10px">*</span></h4>
                    </div>
                    <div class="question-main">
                        <div ng-if="vm.question.question_type == vm.Types.FREETEXT">
                            <div ng-if="vm.question.statement" ng-bind-html="vm.question.statement"></div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.SHORTANSWER">
                            <div ng-bind-html="vm.getStringResponse(vm.question)"></div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.LONGANSWER">
                            <div ng-bind-html="vm.getStringResponse(vm.question)"></div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.SINGLEANSWER">
                            <div ng-bind-html="vm.getStringResponse(vm.question)"></div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.MULTIPLEANSWER">
                            <div ng-repeat="choice in vm.question.choices.all | orderBy:['position', 'id']">
                                <label>
                                    <input type="checkbox" disabled checked ng-if="vm.isSelectedChoice(choice)">
                                    <input type="checkbox" disabled ng-if="!vm.isSelectedChoice(choice)">
                                    <span style="cursor: default"></span>
                                    <span class="ten eight-mobile">[[choice.value]]</span>
                                </label>
                            </div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.DATE">
                            <div ng-bind-html="vm.getStringResponse(vm.question)"></div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.TIME">
                            <div ng-bind-html="vm.getStringResponse(vm.question)"></div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.FILE">
                            <div ng-repeat="filename in vm.getResponseFileNames()">
                                <span ng-bind-html="[[filename]]"></span>
                            </div>
                        </div>
                        <div ng-if="vm.question.question_type == vm.Types.SINGLEANSWERRADIO">
                            <div ng-repeat="choice in vm.question.choices.all | orderBy:['position', 'id']">
                                <label>
                                    <input type="radio" disabled checked ng-if="vm.isSelectedChoice(choice)">
                                    <input type="radio" disabled ng-if="!vm.isSelectedChoice(choice)">
                                    <span style="cursor: default"></span>
                                    <span class="ten eight-mobile">[[choice.value]]</span>
                                </label>
                            </div>
                        </div>
                        <table ng-if="vm.question.question_type == vm.Types.MATRIX" class="twelve matrix-table">
                            <thead>
                                <tr>
                                    <th class="two"></th>
                                    <th ng-repeat="choice in vm.question.choices.all | orderBy:['position', 'id']">[[choice.value]]</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="child in vm.question.children.all | orderBy:matrix_position" ng-init="childIndex = $index">
                                    <td>[[child.title]]</td>
                                    <td ng-repeat ="choice in vm.question.choices.all | orderBy:['position', 'id']">
                                        <label>
                                            <input type="radio" disabled checked ng-if="vm.isSelectedChoice(choice, child)">
                                            <input type="radio" disabled ng-if="!vm.isSelectedChoice(choice, child)">
                                            <span style="cursor: default"></span>
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div ng-if="vm.question.question_type == vm.Types.CURSOR">
                            <div ng-bind-html="vm.getStringResponse(vm.question)"></div>
                        </div>
                    </div>
                    <div class="question-edit" ng-if="(vm.form.editable || vm.distribution.status != vm.DistributionStatus.FINISHED) && vm.question.question_type != vm.Types.FREETEXT">
                        <a ng-click="vm.openQuestion()"><i18n>formulaire.edit</i18n></a>
                    </div>
                </div>
        `,

        controller: function ($scope) {
            const vm: IViewModel = <IViewModel> this;
        },
        link: function ($scope, $element) {
            const vm: IViewModel = $scope.vm;
            vm.Types = Types;
            vm.DistributionStatus = DistributionStatus;
            let missingResponse = "<em>" + idiom.translate('formulaire.response.missing') + "</em>";

            // Display helper functions

            vm.getStringResponse = () : string => {
                let responses = vm.responses.all.filter(r => r.question_id === vm.question.id);
                if (responses && responses.length > 0) {
                    let answer = responses[0].answer.toString();
                    return answer ? answer : missingResponse;
                }
                return missingResponse;
            };

            vm.isSelectedChoice = (choice, child?) : boolean => {
                let selectedChoices: any = vm.responses.all
                    .filter((r: Response) => r.question_id === vm.question.id || (child && r.question_id === child.id))
                    .map((r: Response) => r.choice_id);
                return selectedChoices.includes(choice.id);
            };

            vm.getResponseFileNames = () : string[] => {
                let responses = vm.responses.all.filter(r => r.question_id === vm.question.id);
                if (responses && responses.length === 1 && responses[0].files.all.length > 0) {
                    return responses[0].files.all.map(rf => rf.filename.substring(rf.filename.indexOf("_") + 1));
                }
                else {
                    return [missingResponse];
                }
            };

            vm.openQuestion = () : void => {
                let formElementPosition = vm.question.position;
                if (!vm.question.position) {
                    let sections = vm.formElements.getSections().all.filter(s => s.id === vm.question.section_id);
                    formElementPosition = sections.length === 1 ? sections[0].position : null;
                }
                let newHistoric = vm.historicPosition.slice(0, vm.historicPosition.indexOf(formElementPosition) + 1);
                let data = {
                    path: `/form/${vm.form.id}/${vm.distribution.id}`,
                    position: formElementPosition,
                    historicPosition: newHistoric
                };
                $scope.$emit(FORMULAIRE_EMIT_EVENT.REDIRECT, data);
            };
        }
    };
});
