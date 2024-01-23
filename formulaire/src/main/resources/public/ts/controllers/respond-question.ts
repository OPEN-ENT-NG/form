import {idiom, ng, notify} from "entcore";
import {
    Distribution, FilePayload, Files,
    Form,
    FormElement,
    FormElements,
    Question,
    QuestionChoice,
    Response,
    Responses,
    Section,
    Types
} from "../models";
import {responseFileService, responseService} from "../services";
import {FORMULAIRE_BROADCAST_EVENT, FORMULAIRE_EMIT_EVENT} from "@common/core/enums";
import {FormElementUtils} from "@common/utils";
import {Constants, Fields} from "@common/core/constants";
interface ViewModel {
    formElements: FormElements;
    formElement: FormElement;
    distribution: Distribution;
    selectedIndexList: any;
    responsesChoicesList: any;
    filesList: any;
    form: Form;
    nbFormElements: number;
    longestPath: number;
    loading : boolean;
    historicPosition: number[];
    currentResponses: Map<Question, Responses>;
    currentFiles: Map<Question, Files>;
    isProcessing: boolean;
    longestPathsMap: Map<string, number>;

    $onInit() : Promise<void>;
    prev() : Promise<void>;
    prevGuard() : void;
    next() : Promise<void>;
    nextGuard() : void;
    saveAndQuit() : Promise<void>;
    saveAndQuitGuard() : void;
    getHtmlDescription(description: string) : string;
}

export const respondQuestionController = ng.controller('RespondQuestionController', ['$scope', '$sce',
    function ($scope, $sce) {

    const vm: ViewModel = this;
    vm.formElements = new FormElements();
    vm.distribution = new Distribution();
    vm.form = new Form();
    vm.nbFormElements = 1;
    vm.longestPath = 1;
    vm.loading = true;
    vm.currentResponses = new Map();
    vm.currentFiles = new Map();

    vm.$onInit = async () : Promise<void> => {
        await initRespondQuestionController();
    };

    const initRespondQuestionController = async () : Promise<void> => {
        vm.loading = true;
        vm.form = $scope.form;
        vm.distribution = $scope.distribution;
        await vm.formElements.sync(vm.form.id);
        vm.formElement = vm.formElements.all[$scope.responsePosition - 1];
        vm.nbFormElements = vm.formElements.all.length;
        vm.historicPosition = $scope.historicPosition.length > 0 ? $scope.historicPosition : [1];
        vm.longestPathsMap = FormElementUtils.getLongestPaths(vm.formElements);
        vm.longestPath = vm.formElement.getCurrentLongestPath(vm.longestPathsMap);
        await initFormElementResponses();
        window.setTimeout(() => vm.loading = false,500);
        $scope.safeApply();
    }

    const initFormElementResponses = async (): Promise<void> => {
        let nbQuestions: number = vm.formElement instanceof Question ? 1 : (vm.formElement as Section).questions.all.length;
        for (let i = 0; i < nbQuestions; i++) {
            //Check if it's a question or a section
            let question: Question = vm.formElement instanceof Question ? vm.formElement : (vm.formElement as Section).questions.all[i];
            let questionResponses: Responses = new Responses();

            if (question.isTypeMultipleRep()) {
                for (let choice of question.choices.all) {
                    if (question.children.all.length > 0) {
                        for (let child of question.children.all) {
                            questionResponses.all.push(new Response(child.id, choice.id, choice.value, vm.distribution.id));
                        }
                    } else if (!choice.is_custom) {
                        questionResponses.all.push(new Response(question.id, choice.id, choice.value, vm.distribution.id));
                    } else {
                        questionResponses.all.push(new Response(question.id, choice.id, null, vm.distribution.id));
                    }
                }
            }
            else if (question.question_type === Types.CURSOR && question.specific_fields) {
                let newResponse: Response = new Response(question.id, null, question.specific_fields.cursor_min_val, vm.distribution.id)
                //Check if the answer is a number
                newResponse.answer = !Number.isFinite(newResponse.answer) ? question.specific_fields.cursor_min_val : newResponse.answer;
                questionResponses.all.push(newResponse);
            }
            else if (question.isRanking()) {
                let questionChoices: QuestionChoice[] = question.choices.all;
                for (let i: number = 0; i < questionChoices.length; i++) {
                    let questionChoice: QuestionChoice = questionChoices[i];
                    questionResponses.all.push(new Response(question.id, questionChoice.id, questionChoice.value, vm.distribution.id, questionChoice.position));
                }
            } else {
                questionResponses.all.push(new Response(question.id, null, null, vm.distribution.id));
            }

            vm.currentResponses.set(question, questionResponses);
            if (!vm.currentFiles.has(question)) vm.currentFiles.set(question, new Files());
        }
        await fillResponses();
        $scope.safeApply();
    };

    const fillResponses = async (): Promise<void> => {
        //Check if formElement is a Question or a Section
        let questions: Question[] = vm.formElement instanceof Question ? [vm.formElement] : (vm.formElement as Section).questions.all;

        // Add questionIds of children to deal with matrix
        let matrixQuestions: Question[] = questions.filter((q: Question) => q.question_type == Types.MATRIX);
        let questionsToSyncResponses = questions.concat((matrixQuestions as any).flatMap((q: Question) => q.children.all));

        // Retrieve responses
        let allResponses: Responses = new Responses();
        await allResponses.syncMineByQuestionIds(questionsToSyncResponses.map((q: Question) => q.id), vm.distribution.id);

        // Group responses by question id
        let responsesByQuestionId: Map<Question, Responses> = new Map();
        for (let question of questions) {
            let responses: Responses = new Responses();
            let childrenIds: number[] = question.children.all.map((q: Question) => q.id);
            responses.all = allResponses.all.filter((response: Response) => response.question_id === question.id || (childrenIds as any).includes(response.question_id));
            responsesByQuestionId.set(question, responses);
        }

        responsesByQuestionId.forEach((responses: Responses, question: Question) => processResponses(question, responses));
    }

    const processResponses = (question: Question, existingResponses: Responses): void => {
        //Contain blank responses initialised in initFormElementResponses for question we are processing
        let blankResponses: Responses = vm.currentResponses.get(question);

        if (question.isTypeMultipleRep()) {
            for (let response of blankResponses.all) {
                let existingResponse: Response = existingResponses.all.find((existingResponse: Response) => {
                    let checkChoiceId: boolean = existingResponse.choice_id == response.choice_id;
                    let checkQuestionId: boolean = question.question_type == Types.MATRIX ? existingResponse.question_id == response.question_id : true;
                    return checkChoiceId && checkQuestionId;
                });
                if (existingResponse) {
                    existingResponse.selected = true;
                    let index: number = blankResponses.all.indexOf(response);
                    blankResponses.all[index] = existingResponse;
                }
            }

            // Replace blankResponses by modified ones
            vm.currentResponses.set(question, blankResponses);
        }
        else {
            if (existingResponses.all.length >= 1) {
                if (question.question_type == Types.TIME) {
                    existingResponses.all[0].answer = new Date(Fields.JANUARY_01_1970 + existingResponses.all[0].answer);
                } else if (question.question_type == Types.CURSOR) {
                    let answer: number = Number.parseInt(existingResponses.all[0].answer.toString());
                    existingResponses.all[0].answer = Number.isNaN(answer) ? this.question.specific_fields.cursor_min_val : answer;
                }
                // replace blankResponses by the one from the user
                blankResponses.all = existingResponses.all;
                vm.currentResponses.set(question, blankResponses);
            }
        }
        blankResponses.hasLoaded = true;
    };


    vm.prev = async () : Promise<void> => {
        let prevPosition: number = vm.historicPosition[vm.historicPosition.length - 2];
        vm.isProcessing = true;
        if (prevPosition > 0) {
            unloadLastResponses();
            await saveResponses();
            vm.formElement = vm.formElements.all[prevPosition - 1];
            vm.historicPosition.pop();
            vm.longestPath = vm.formElement.getCurrentLongestPath(vm.longestPathsMap);
            goToFormElement();
        }
        vm.isProcessing = false;
    };

    vm.prevGuard = () => {
        vm.prev().then();
    };

    vm.next = async () : Promise<void> => {
        let nextPosition: number = getNextPositionIfValid();
        vm.isProcessing = true;
        if (nextPosition && nextPosition <= vm.nbFormElements) {
            unloadLastResponses();
            await saveResponses();
            vm.formElement = vm.formElements.all[nextPosition - 1];
            vm.historicPosition.push(vm.formElement.position);
            vm.longestPath = vm.formElement.getCurrentLongestPath(vm.longestPathsMap);
            vm.isProcessing = false;
            goToFormElement();
        }
        else if (nextPosition !== undefined) {
            await saveResponses();
            let data = {
                path: `/form/${vm.form.id}/${vm.distribution.id}/questions/recap`,
                historicPosition: vm.historicPosition
            };
            vm.isProcessing = false;
            $scope.$emit(FORMULAIRE_EMIT_EVENT.REDIRECT, data);
        }
        vm.isProcessing = false;
    };

    vm.nextGuard = () => {
        vm.next().then();
    };

    const goToFormElement = () : void => {
        initFormElementResponses();
        window.scrollTo(0, 0);
        $scope.safeApply();
    };

    const getNextPositionIfValid = () : number => {
        let nextPosition: number = vm.formElement.position + 1;
        let conditionalQuestion: Question = null;
        let response: Response = null;

        if (vm.formElement instanceof Question && vm.formElement.conditional) {
            conditionalQuestion = vm.formElement;
            response = vm.currentResponses.get(conditionalQuestion).all[0];
        }
        else if (vm.formElement instanceof Section) {
            let conditionalQuestions = vm.formElement.questions.all.filter((q: Question) => q.conditional);
            if (conditionalQuestions.length === 1) {
                conditionalQuestion = conditionalQuestions[0];
                response = vm.currentResponses.get(conditionalQuestion).all[0];
            }
        }

        if (conditionalQuestion && response && !response.choice_id) {
            notify.info('formulaire.response.next.invalid');
            nextPosition = undefined;
        }
        else if (conditionalQuestion && response) {
            let choices: QuestionChoice[] = conditionalQuestion.choices.all.filter((c: QuestionChoice) => c.id === response.choice_id);
            let targetedElement: FormElement = choices.length === 1 ? choices[0].getNextFormElement(vm.formElements, conditionalQuestion) : null;
            nextPosition = targetedElement ? targetedElement.position : null;
        }
        else if (vm.formElement instanceof Section && vm.formElement.questions.all.filter((q: Question) => q.conditional).length == 0) {
            nextPosition = vm.formElement.getNextFormElementPosition(vm.formElements);
        }

        return nextPosition;
    };

    vm.saveAndQuit = async () : Promise<void> => {
        if (await saveResponses()) {
            notify.success(idiom.translate('formulaire.success.responses.save'));
            window.setTimeout(function () { $scope.redirectTo(`/list/responses`); }, 1000);
        }
    };

    vm.saveAndQuitGuard = () => {
        vm.saveAndQuit().then();
    };

    vm.getHtmlDescription = (description: string) : string => {
        return !!description ? $sce.trustAsHtml(description) : null;
    }

    const saveResponses = async () : Promise<boolean> => {
        let isSavingOk: boolean = false;

        if (!vm.loading) {
            if (vm.formElement instanceof Question) {
                isSavingOk = await saveQuestionsResponses([vm.formElement]);
            }
            else if (vm.formElement instanceof Section) {
                isSavingOk = await saveQuestionsResponses(vm.formElement.questions.all);
            }
        }

        return isSavingOk;
    };

    const saveQuestionsResponses = async (questions: Question[]) : Promise<boolean> => {
        let questionIdsResponseToDelete: number[] = [];
        let mapQuestionsResponsesToSave: Map<Question, Response[]> = new Map<Question, Response[]>();
        let responsesFilePayloads: FilePayload[] = [];
        let responseIdOfResponseFilesToDelete: number[] = [];

        for (let question of questions) {
            let responsesToSave: Response[] = [];
            let questionResponses: Responses = vm.currentResponses.get(question);
            let files: Files = vm.currentFiles.get(question);

            if (question.isTypeMultipleRep() || question.isRanking()) {
                questionIdsResponseToDelete.push(question.id);
                // Add questionIds of children to deal with matrix
                questionIdsResponseToDelete = questionIdsResponseToDelete.concat(question.children.all.map((q: Question) => q.id));

                if (questionResponses.selected.length > 0) {
                    for (let questionResponse of questionResponses.selected) {
                        questionResponse.id = null; // to force creation instead of update
                        responsesToSave.push(questionResponse);
                    }
                }
                else if (question.children.all.length > 0) {
                    for (let child of question.children.all) {
                        responsesToSave.push(new Response(child.id, null, null, vm.distribution.id));
                    }
                }
                else if (question.isRanking()) { // In case of question type ranking, we need to add a choice index to each Response
                    if (questionResponses.all.length > question.choices.all.length) {
                        notify.info(idiom.translate('???'));
                        let rankingResponses: Responses = new Responses();
                        let questionChoices: QuestionChoice[] = question.choices.all;
                        for (let i: number = 0; i < questionChoices.length; i++) {
                            let questionChoice: QuestionChoice = questionChoices[i];
                            rankingResponses.all.push(new Response(question.id, questionChoice.id, questionChoice.value, vm.distribution.id, questionChoice.position));
                        }
                        vm.currentResponses.set(question, rankingResponses);
                        return false;
                    }
                    for (let questionResponse of questionResponses.all) {
                        responsesToSave.push(new Response(question.id, questionResponse.choice_id, questionResponse.answer, vm.distribution.id, questionResponse.choice_position));
                    }
                }
                else {
                    responsesToSave.push(new Response(question.id, null, null, vm.distribution.id));
                }
            }
            else if (questionResponses.all[0].choice_id) { // Custom answer security/formatting
                let questionResponse: Response = questionResponses.all[0];
                let matchingChoices: QuestionChoice[] = question.choices.all.filter((c: QuestionChoice) => c.id === questionResponse.choice_id);
                if (matchingChoices.length == 1) {
                    if (!matchingChoices[0].is_custom) {
                        questionResponse.answer = matchingChoices[0].value;
                        questionResponse.custom_answer = null;
                    }
                    else {
                        questionResponse.answer = null;
                    }
                }
                responsesToSave.push(questionResponses.all[0]);
            }
            else if (question.question_type === Types.FILE && files) { // Files management
                if (files.all.length > Constants.MAX_FILES_SAVE) {
                    notify.info(idiom.translate('formulaire.response.file.tooMany'));
                    return false;
                }

                let questionResponse: Response = questionResponses.all[0];
                questionResponse.answer = files.all.length > 0 ? idiom.translate('formulaire.response.file.send') : "";
                responsesToSave.push(questionResponse);

                if (questionResponse.id) responseIdOfResponseFilesToDelete.push(questionResponse.id);

                vm.currentFiles.set(question, files);
                responsesFilePayloads.push(...files.all.map((f: File) => new FilePayload(f, questionResponse.id, question.id, vm.form)));
            }
            else {
                responsesToSave.push(questionResponses.all[0]);
            }

            mapQuestionsResponsesToSave.set(question, responsesToSave);
        }

        if (responseIdOfResponseFilesToDelete.length > 0) await responseFileService.deleteAllMultiple(responseIdOfResponseFilesToDelete);  // Delete all files
        await responseService.deleteMultipleByQuestionAndDistribution(questionIdsResponseToDelete, vm.distribution.id); // Delete all responses of multiple types
        let updatedResponses : Response[] = await responseService.saveMultiple(mapQuestionsResponsesToSave, vm.distribution.id); // Save and retrieve all responses (update or create)

        // Save all files (update or create)
        if (responsesFilePayloads.length > 0) {
            let filePayloadsToUpdate: FilePayload[] = responsesFilePayloads.filter((fp: FilePayload) => !fp.responseId);
            for (let fp of filePayloadsToUpdate) fp.responseId = updatedResponses.find((r: Response) => r.question_id === fp.questionId).id;
            await saveFiles(responsesFilePayloads);
        }

        return true;
    };

    const saveFiles = async (filePayloads: FilePayload[]) : Promise<boolean> => {
        try {
            let promises: Promise<Responses>[] = [];
            for (let filePayload of filePayloads) {
                promises.push(await responseFileService.create(filePayload.responseId, filePayload.formData));
            }
            await Promise.all(promises);
            return true;
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.responseFileService.create'));
            throw err;
        }
    };

    const unloadLastResponses = () : void => {
        if (vm.formElement instanceof Question) {
            vm.currentResponses.get(vm.formElement).hasLoaded = false;
        }
        else if (vm.formElement instanceof Section) {
            for (let question of vm.formElement.questions.all) {
                vm.currentResponses.get(question).hasLoaded = false;
            }
        }
    }

    $scope.$on(FORMULAIRE_BROADCAST_EVENT.INIT_RESPOND_QUESTION, () => { initRespondQuestionController() });
}]);