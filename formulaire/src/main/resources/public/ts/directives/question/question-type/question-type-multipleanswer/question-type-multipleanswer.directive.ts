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
    selectedChoiceIndex: number;

    deleteChoice(index: number): Promise<void>;
    openAttachmentLightbox(): Promise<void>;
    cancelAttachment(): void;
    displayImageSelect(index: number): void;
    deleteImageSelect(index: number): void;
}

class Controller implements ng.IController, IViewModel {
    question: Question;
    hasFormResponses: boolean;
    i18n: I18nUtils;
    direction: typeof Direction;
    lightbox: any;
    selectedChoiceIndex: number;

    constructor(private $scope: IQuestionTypeMultipleanswerProps, private $sce: ng.ISCEService) {
        this.i18n = I18nUtils;
        this.direction = Direction;
        this.lightbox = {
            attachment: false
        };
        this.selectedChoiceIndex = -1;
    }

    $onInit = async () : Promise<void> => {}

    $onDestroy = async () : Promise<void> => {}

    deleteChoice = async (index: number) : Promise<void> => {
        if (index === this.selectedChoiceIndex) {
            this.selectedChoiceIndex = -1; // Réinitialisez la valeur si le choix supprimé correspond à selectedChoiceIndex
        }
        await this.question.deleteChoice(index);
    }

    openAttachmentLightbox = async () : Promise<void> => {
        await template.open('lightbox', 'lightbox/attachment');
        this.lightbox.attachment = true;
    }

    cancelAttachment = () : void => {
        template.close('lightbox');
        this.lightbox.attachment = false;
    };

    displayImageSelect(index: number): void {
        this.selectedChoiceIndex = index;
    }

    deleteImageSelect(index: number): void {
        if (this.selectedChoiceIndex === index) {
            this.selectedChoiceIndex = -1;
        }
        this.question.choices.all[index].image = null; // Image par défaut à gérer ?
    }
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
