import {Directive, ng} from "entcore";
import {Question, QuestionChoice, Response, Responses, Types} from "@common/models";
import {FORMULAIRE_FORM_ELEMENT_EMIT_EVENT} from "@common/core/enums";
import {I18nUtils} from "@common/utils";

interface IViewModel {
    question: Question;
    responses: Responses;
    Types: typeof Types;
    I18n: I18nUtils;
    mapChoiceResponseIndex: Map<QuestionChoice, number>;

    $onInit() : Promise<void>;
}

export const publicQuestionItem: Directive = ng.directive('publicQuestionItem', () => {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            question: '=',
            responses: '='
        },
        controllerAs: 'vm',
        bindToController: true,
        template: `
            <div class="question" guard-root>
                <div class="question-title flex-spaced">
                    <h4>[[vm.question.title]]<span ng-if="vm.question.mandatory" style="color:red;margin-left:10px">*</span></h4>
                </div>
                <div class="question-main">
                    <div ng-if="vm.question.question_type == vm.Types.FREETEXT">
                        <div ng-if="vm.question.statement" ng-bind-html="vm.question.statement"></div>
                    </div>
                    <div ng-if="vm.question.question_type == vm.Types.SHORTANSWER">
                        <textarea ng-model="vm.responses.all[0].answer" i18n-placeholder="[[vm.question.placeholder]]" input-guard></textarea>
                    </div>
                    <div ng-if="vm.question.question_type == vm.Types.LONGANSWER">
                        <textarea ng-model="vm.responses.all[0].answer" input-guard></textarea>
                    </div>
                    <div ng-if="vm.question.question_type == vm.Types.SINGLEANSWER">
                        <select ng-model="vm.responses.all[0].selected" input-guard>
                            <option ng-value="">[[vm.I18n.translate('formulaire.public.options.select')]]</option>
                            <option ng-repeat="choice in vm.question.choices.all" ng-value="true">[[choice.value]]</option>
                        </select>
                    </div>
                    <div ng-if="vm.question.question_type == vm.Types.MULTIPLEANSWER">
                        <div ng-repeat="choice in vm.question.choices.all | orderBy:['position', 'id']">
                            <label>
                                <input type="checkbox" ng-model="vm.responses.all[vm.mapChoiceResponseIndex.get(choice)].selected" input-guard>
                                <span>[[choice.value]]</span>
                            </label>
                        </div>
                    </div>
                    <div ng-if="vm.question.question_type == vm.Types.DATE">
                        <date-picker ng-model="vm.responses.all[0].answer" input-guard></date-picker>
                    </div>
                    <div ng-if="vm.question.question_type == vm.Types.TIME">
                        <input type="time" ng-model="vm.responses.all[0].answer" input-guard/>
                    </div>
                    <div ng-if ="vm.question.question_type == vm.Types.SINGLEANSWERRADIO">
                        <div ng-repeat ="choice in vm.question.choices.all | orderBy:['position', 'id']">
                            <label>
                                <input type="radio" ng-model="vm.responses.all[0].selected" ng-value="true" input-guard>[[choice.value]]
                            </label>
                        </div>
                    </div>
                    <div ng-if ="vm.question.question_type == vm.Types.CURSOR">
                        <div class="formulaire-cursor-input-wrapper">
                            <div>
                                <label>[[vm.question.cursor_label_min_val]]</label> <!-- label minimum value (optional) -->
                            </div>
                            <div class="formulaire-cursor-input-range">
                                <!-- input range -->
                                <input type="range" ng-model="vm.responses.all[0].answer"
                                       ng-value="[[vm.question.cursor_min_val]]" value="[[vm.question.cursor_min_val]]"
                                       min="[[vm.question.cursor_min_val]]" max="[[vm.question.cursor_max_val]]" 
                                       step="[[vm.question.cursor_step]]" oninput="rangevalue.value = value">
                               <div class="formulaire-cursor-input-range-values">
                                    <output>[[vm.question.cursor_min_val]]</output> <!-- minimum value -->
                                    <output>[[vm.question.cursor_max_val]]</output> <!-- maximum value -->
                               </div>
                            </div>
                            <div>
                                <label>[[vm.question.cursor_label_max_val]]</label> <!-- label maximum value (optional) -->
                            </div>
                        </div>
                        
                        <!-- chosen value -->
                        <label><i18n>formulaire.public.question.selected.result</i18n></label>
                        <output id="rangevalue">[[vm.question.cursor_min_val]]</output>
                    </div>
                </div>
            </div>
        `,

        controller: function ($scope) {
            const vm: IViewModel = <IViewModel> this;

            vm.$onInit = async () : Promise<void> => {
                if (vm.question.question_type === Types.TIME && vm.responses.all[0].answer) {
                    vm.responses.all[0].answer = new Date("January 01 1970 " + vm.responses.all[0].answer);
                }

                if (vm.question.question_type == Types.MULTIPLEANSWER) {
                    vm.mapChoiceResponseIndex = new Map();
                    for (let choice of vm.question.choices.all) {
                        let matchingResponses: Response[] = vm.responses.all.filter((r:Response) => r.choice_id == choice.id);
                        if (matchingResponses.length != 1) console.error("Be careful, 'vm.responses' has been badly implemented !!");
                        vm.mapChoiceResponseIndex.set(choice, vm.responses.all.indexOf(matchingResponses[0]));
                    }
                }
            };
        },
        link: function ($scope, $element) {
            const vm: IViewModel = $scope.vm;
            vm.Types = Types;
            vm.I18n = I18nUtils;

            $scope.$on(FORMULAIRE_FORM_ELEMENT_EMIT_EVENT.REFRESH_QUESTION, () => { vm.$onInit(); });
        }
    };
});
