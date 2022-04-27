import {ng, template} from "entcore";
import {Delegates, Form, FormElements} from "../../models";
import {pocService} from "../../services";
import {Mix} from "entcore-toolkit";
import {PublicUtils} from "../../utils/public";

interface ViewModel {
    formKey: string;
    distributionKey: string;
    form: Form;
    formElements: FormElements;
    delegates: Delegates;

    $onInit() : Promise<void>;
    startForm() : Promise<void>;
}

export const publicRgpdController = ng.controller('PublicRgpdController', ['$scope',
    function ($scope) {

    const vm: ViewModel = this;
    vm.form = new Form();
    vm.formElements = new FormElements();
    vm.delegates = new Delegates();

    vm.$onInit = async () : Promise<void> => {
        vm.formKey = $scope.formKey;

        if (PublicUtils.getCookie(`distribution_key_${vm.formKey}`) != null) {
            template.open('main', 'containers/public/end/sorry');
            $scope.safeApply();
        }
        else {
            if (!sessionStorage.getItem('formKey')) {
                let form = await pocService.getPublicFormByKey(vm.formKey)
                    .catch(reason => {
                        template.open('main', 'containers/public/end/sorry');
                        $scope.safeApply();
                        return;
                    });

                vm.form.setFromJson(form);
                vm.form.formatFormElements(vm.formElements);
                vm.distributionKey = vm.form.getDistributionKey();
                updateStorage();
            }
            else {
                vm.form = Mix.castAs(Form, JSON.parse(sessionStorage.getItem('form')));
            }

            if (vm.form) { await vm.delegates.sync(); }
            $scope.safeApply();
        }
    };

    vm.startForm = async () : Promise<void> => {
        sessionStorage.setItem('historicPosition', JSON.stringify([1]));
        template.open('main', 'containers/public/respond-question');
        $scope.safeApply();
    };

    // Utils

    const updateStorage = () : void => {
        sessionStorage.setItem('formKey', JSON.stringify(vm.formKey));
        sessionStorage.setItem('distributionKey', JSON.stringify(vm.distributionKey));
        sessionStorage.setItem('form', JSON.stringify(vm.form));
        sessionStorage.setItem('formElements', JSON.stringify(vm.formElements));
        sessionStorage.setItem('nbFormElements', JSON.stringify(vm.formElements.all.length));
        sessionStorage.setItem('historicPosition', JSON.stringify([1]));
        sessionStorage.setItem('allResponsesInfos', JSON.stringify(new Map()));
    };
}]);