import {moment, ng, notify, template} from 'entcore';
import {
	Form,
	FormElement,
	FormElements,
	Question,
	QuestionChoice,
	Response,
	Responses,
	Section,
	Types
} from "@common/models";
import {FORMULAIRE_FORM_ELEMENT_EMIT_EVENT} from "@common/core/enums";
import {Mix} from "entcore-toolkit";
import {PublicUtils} from "@common/utils";

interface ViewModel {
	formKey: string;
	formElements: FormElements;
	allResponsesInfos: Map<FormElement, Map<Question, Responses>>;

	formElement: FormElement;

	form: Form;
	nbFormElements: number;
	historicPosition: number[];

	$onInit(): Promise<void>;
	prev() : void;
	next() : void;
}

export const respondQuestionController = ng.controller('RespondQuestionController', ['$scope',
	function ($scope) {

	const vm: ViewModel = this;
	vm.form = new Form();
	vm.formElements = new FormElements();
	vm.nbFormElements = 1;
	vm.allResponsesInfos = new Map();

	vm.$onInit = async () : Promise<void> => {
		await initRespondQuestionController();
	};

	const initRespondQuestionController = async () : Promise<void> => {
		syncWithStorageData();
		let formElementPosition = vm.historicPosition[vm.historicPosition.length - 1];
		vm.formElement = vm.formElements.all[formElementPosition - 1];
		initFormElementResponses();

		$scope.safeApply();
	}

	vm.prev = () : void => {
		formatResponses();
		let prevPosition = vm.historicPosition[vm.historicPosition.length - 2];
		if (prevPosition > 0) {
			vm.formElement = vm.formElements.all[prevPosition - 1];
			vm.historicPosition.pop();
			goToFormElement();
		}
	};

	vm.next = () : void => {
		formatResponses();
		let nextPosition = getNextPositionIfValid();
		if (nextPosition && nextPosition <= vm.nbFormElements) {
			vm.formElement = vm.formElements.all[nextPosition - 1];
			vm.historicPosition.push(vm.formElement.position);
			goToFormElement();
		}
		else if (nextPosition !== undefined) {
			updateStorage();
			template.open('main', 'containers/recap');
		}
	};

	// Utils

	const goToFormElement = () : void => {
		initFormElementResponses();
		updateStorage();
		window.scrollTo(0, 0);
		$scope.safeApply();
	};

	const getNextPositionIfValid = () : number => {
		let nextPosition: number = vm.formElement.position + 1;
		let conditionalQuestion: Question = null;
		let response: Response = null;

		if (vm.formElement instanceof Question && vm.formElement.conditional) {
			conditionalQuestion = vm.formElement;
			response = vm.allResponsesInfos.get(vm.formElement).get(vm.formElement)[0];
		}
		else if (vm.formElement instanceof Section) {
			let conditionalQuestions = vm.formElement.questions.all.filter((q: Question) => q.conditional);
			if (conditionalQuestions.length === 1) {
				conditionalQuestion = conditionalQuestions[0];
				response = vm.allResponsesInfos.get(vm.formElement).get(conditionalQuestion)[0];
			}
		}

		if (conditionalQuestion && response && !response.choice_id) {
			notify.info('formulaire.response.next.invalid');
			nextPosition = undefined;
		}
		else if (conditionalQuestion && response) {
			let choices: QuestionChoice[] = conditionalQuestion.choices.all.filter((c: QuestionChoice) => c.id === response.choice_id);
			let sectionId: number = choices.length === 1 ? choices[0].next_section_id : null;
			let filteredSections: Section[] = vm.formElements.getSections().all.filter((s: Section) => s.id === sectionId);
			let targetSection: Section = filteredSections.length === 1 ? filteredSections[0] : null;
			nextPosition = targetSection ? targetSection.position : null;
		}

		return nextPosition;
	};

	const formatResponses = () : void => {
		let questions: Question[] = vm.formElement instanceof Section ? vm.formElement.questions.all : [vm.formElement as Question];

		for (let i = 0; i < questions.length; i++) {
			let question: Question = questions[i];
			let questionResponses: Responses = vm.allResponsesInfos.get(vm.formElement).get(question);


			// for (let response of questionResponses) {
			for (let response of questionResponses.all) {
				if (!response.answer) {
					response.answer = "";
				}
				else {
					let questionType: number = question.question_type;
					if (questionType === Types.TIME && typeof response.answer != "string") {
						response.answer = moment(response.answer).format("HH:mm");
					} else if (questionType === Types.DATE && typeof response.answer != "string") {
						response.answer = moment(response.answer).format("DD/MM/YYYY");
					} else if (questionType === Types.CURSOR && typeof response.answer != "string") {
						response.answer = response.answer.toString();
					}
				}
			}
		}
	};

	const initFormElementResponses = () : void => {
		if (!vm.allResponsesInfos.has(vm.formElement)) {
			vm.allResponsesInfos.set(vm.formElement, new Map());

			let nbQuestions = vm.formElement instanceof Question ? 1 : (vm.formElement as Section).questions.all.length;
			for (let i = 0; i < nbQuestions; i++) {
				let question: Question = vm.formElement instanceof Question ? vm.formElement : (vm.formElement as Section).questions.all[i];
				let questionResponses: Responses = new Responses();

				if (question.question_type == Types.MULTIPLEANSWER || question.question_type == Types.MATRIX) {
					for (let choice of question.choices.all) {
						if (question.children.all.length > 0) {
							for (let child of question.children.all) {
								questionResponses.all.push(new Response(child.id, choice.id));
							}
						}
						else {
							questionResponses.all.push(new Response(question.id, choice.id));
						}
					}
				}
				else {
					questionResponses.all.push(new Response(question.id));
				}

				vm.allResponsesInfos.get(vm.formElement).set(question, questionResponses);
			}
		}

		$scope.safeApply();
		$scope.$broadcast(FORMULAIRE_FORM_ELEMENT_EMIT_EVENT.REFRESH_QUESTION);
	};

	const updateStorage = () : void => {
		sessionStorage.setItem('formKey', JSON.stringify(vm.formKey));
		sessionStorage.setItem('form', JSON.stringify(vm.form));
		sessionStorage.setItem('formElements', JSON.stringify(vm.formElements));
		sessionStorage.setItem('nbFormElements', JSON.stringify(vm.nbFormElements));
		sessionStorage.setItem('historicPosition', JSON.stringify(vm.historicPosition));
		sessionStorage.setItem('allResponsesInfos', JSON.stringify(vm.allResponsesInfos));
	};

	const syncWithStorageData = () : void => {
		vm.form = Mix.castAs(Form, JSON.parse(sessionStorage.getItem('form')));
		vm.formKey = JSON.parse(sessionStorage.getItem('formKey'));
		vm.nbFormElements = JSON.parse(sessionStorage.getItem('nbFormElements'));
		vm.historicPosition = JSON.parse(sessionStorage.getItem('historicPosition'));
		let dataFormElements = JSON.parse(sessionStorage.getItem('formElements'));
		let dataResponsesInfos = JSON.parse(sessionStorage.getItem('allResponsesInfos'));
		PublicUtils.formatStorageData(dataFormElements, vm.formElements, dataResponsesInfos, vm.allResponsesInfos);
	};

}]);