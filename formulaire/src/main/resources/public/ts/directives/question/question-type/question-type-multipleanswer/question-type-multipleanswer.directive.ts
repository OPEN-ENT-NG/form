import {Directive, ng, template} from "entcore";
import {Question} from "@common/models";
import {I18nUtils} from "@common/utils";
import {Direction} from "@common/core/enums";
import {RootsConst} from "../../../../core/constants/roots.const";

interface IQuestionTypeMultipleanswerProps {
    question: Question;
    hasFormResponses: boolean;
}

interface IViewModel {
    i18n: I18nUtils;
    direction: typeof Direction;
    lightbox: any;
    // display: {
    //     lightbox: {
    //         attachment: boolean
    //     }
    // };

    deleteChoice(index: number): Promise<void>;
    openAttachmentLightbox(): Promise<void>;
    cancelAttachment(): void;
}

class Controller implements ng.IController, IViewModel {
    question: Question;
    hasFormResponses: boolean;
    i18n: I18nUtils;
    direction: typeof Direction;
    lightbox: any;

    constructor(private $scope: IQuestionTypeMultipleanswerProps, private $sce: ng.ISCEService) {
        this.i18n = I18nUtils;
        this.direction = Direction;
        this.lightbox = {
            attachment: false
        };
    }

    $onInit = async () : Promise<void> => {}

    $onDestroy = async () : Promise<void> => {}

    deleteChoice = async (index: number) : Promise<void> => {
        await this.question.deleteChoice(index);
        // $scope.$apply();
    }

    openAttachmentLightbox = async () : Promise<void> => {
        await template.open('lightbox', 'lightbox/attachment');
        this.lightbox.attachment = true;
    }

    cancelAttachment = () : void => {
        template.close('lightbox');
        this.lightbox.attachment = false;
    };
}

function directive() {
    return {
        restrict: 'E',
        templateUrl: `${RootsConst.directive}question/question-type/question-type-multipleanswer/question-type-multipleanswer.html`,
        transclude: true,
        scope: {
            question: '=',
            hasFormResponses: '='
        },
        controllerAs: 'vm',
        bindToController: true,
        controller: ['$scope', '$sce', Controller],
        /* interaction DOM/element */
        link: function ($scope: IQuestionTypeMultipleanswerProps,
                        element: ng.IAugmentedJQuery,
                        attrs: ng.IAttributes,
                        vm: IViewModel) {
        }
    }
}

export const questionTypeMultipleanswer: Directive = ng.directive('questionTypeMultipleanswer', directive);
