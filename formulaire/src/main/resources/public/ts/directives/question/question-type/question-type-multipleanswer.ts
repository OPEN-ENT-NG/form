import {Directive, ng, template} from "entcore";
import {Question} from "@common/models";
import {I18nUtils} from "@common/utils";
import {Direction} from "@common/core/enums";

interface IViewModel {
    question: Question,
    hasFormResponses: boolean,
    I18n: I18nUtils;
    Direction: typeof Direction;
    display: {
        lightbox: {
            attachment: boolean
        }
    };

    deleteChoice(index: number): Promise<void>;
    openAttachmentLightbox(): Promise<void>;
    cancelAttachment(): void;
}

export const questionTypeMultipleanswer: Directive = ng.directive('questionTypeMultipleanswer', () => {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            question: '=',
            hasFormResponses: '='
        },
        controllerAs: 'vm',
        bindToController: true,
        template: `
            
        `,

        controller: async ($scope) => {
            const vm: IViewModel = <IViewModel> this;
        },
        link: ($scope, $element) => {
            const vm: IViewModel = $scope.vm;
            vm.I18n = I18nUtils;
            vm.Direction = Direction;
            vm.display = {
                lightbox: {
                    attachment: false
                }
            };

            vm.deleteChoice = async (index: number) : Promise<void> => {
                await vm.question.deleteChoice(index);
                $scope.$apply();
            }

            vm.openAttachmentLightbox = async () : Promise<void> => {
                await template.open('lightbox', 'lightbox/attachment');
                vm.display.lightbox.attachment = true;
                $scope.$apply();
            }

            vm.cancelAttachment = () : void => {
                template.close('lightbox');
                $scope.display.lightbox.attachment = false;
                $scope.$apply();
            };

        }
    };
});
