import {
    Distribution,
    Form,
    FormElement, FormElementIdType,
    FormElements,
    Question, QuestionChoice,
    Questions,
    Response,
    Responses,
    Section, Types
} from "../models";
import {Mix} from "entcore-toolkit";
import {Direction} from "../core/enums";
import {idiom, notify} from "entcore";
import {formElementService, questionChoiceService, questionService} from "../services";
import {PropPosition} from "@common/core/enums/prop-position";
import {Constants} from "@common/core/constants";

export class FormElementUtils {
    static castFormElement = (formElement: any) : Question|Section => {
        if (formElement.statement !== undefined) {
            return Mix.castAs(Question, formElement);
        }
        else {
            return Mix.castAs(Section, formElement);
        }
    };

    static switchPositions = (elements: any, index: number, direction: string, propPosition: PropPosition) : void => {
        switch (direction) {
            case Direction.UP: {
                elements.all[index][propPosition]--;
                elements.all[index - 1][propPosition]++;
                break;
            }
            case Direction.DOWN: {
                elements.all[index][propPosition]++;
                elements.all[index + 1][propPosition]--;
                break;
            }
            default:
                notify.error(idiom.translate('formulaire.error.question.reorganization'));
                break;
        }
    }

    // Checking functions for validation form ending

    static hasRespondedLastQuestion = async (form: Form, distribution: Distribution) : Promise<boolean> => {
        let formElements = new FormElements();
        let responses = new Responses();
        await formElements.sync(form.id);
        if (this.isElementAValidLast(formElements)) {
            return true;
        }
        else {
            let lastQuestions = this.getConditionalQuestionsTargetingEnd(formElements);
            await responses.syncByDistribution(distribution.id);
            return responses.all.filter((r: Response) => this.isValidLastResponse(r, lastQuestions)).length > 0;
        }
    };

    static isElementAValidLast = (formElements: FormElements) : boolean => {
        let lastElement = formElements.all[formElements.all.length - 1];
        // Last question should not be conditional or should have all choices targeting end
        let isLastElementValidQuestion = lastElement instanceof Question && (!lastElement.conditional || lastElement.choices.all.every((c: QuestionChoice) => !c.next_form_element_id));
        // Last section should have one conditional question with all choices targeting end
        let isLastElementValidSectionAndHasConditionalQuestion = lastElement instanceof Section
            && lastElement.questions.all.filter((q: Question) => q.conditional).length === 1
            && lastElement.questions.all.filter((q: Question) => q.conditional)[0].choices.all.every((c: QuestionChoice) => !c.next_form_element_id);
        // Or last section should have no conditional question but a next_form_element_id targeting end (= null)
        let isLastElementValidSectionAndHasNotConditionalQuestion = lastElement instanceof Section
            && lastElement.questions.all.filter((q: Question) => q.conditional).length === 0
            && lastElement.next_form_element_id == null;
        return isLastElementValidQuestion || isLastElementValidSectionAndHasConditionalQuestion || isLastElementValidSectionAndHasNotConditionalQuestion;
    };

    static getConditionalQuestionsTargetingEnd = (formElements: FormElements) : any => {
        let lastQuestions = [];
        for (let e of formElements.all) {
            if (e instanceof Question) {
                if (e.conditional && e.choices.all.filter((c: QuestionChoice) => !c.next_form_element_id).length > 0) {
                    lastQuestions.push(e);
                }
            }
            else if (e instanceof Section) {
                let conditionalQuestions = e.questions.all.filter((q: Question) => q.conditional);
                if (conditionalQuestions.length == 0 && e.next_form_element_id == null) {
                    lastQuestions.concat(e.questions.all);
                }
                else if (conditionalQuestions.length === 1 && conditionalQuestions[0].choices.all.filter((c: QuestionChoice) => !c.next_form_element_id).length > 0) {
                    lastQuestions.push(conditionalQuestions[0]);
                }
            }
        }
        return lastQuestions;
    };

    static isValidLastResponse = (response: Response, lastQuestions: any) : boolean => {
        let matchingQuestions = lastQuestions.filter((q: Question) => q.id === response.question_id);
        let question = matchingQuestions.length > 0 ? matchingQuestions[0] : null;
        return question && (question.conditional ? !!response.answer : true);
    };

    // Drag and drop

    static onEndDragAndDrop = async (evt: any, formElements: FormElements) : Promise<void> => {
        let newSectionId: number = evt.to.id.split("-")[1] != "0" ? parseInt(evt.to.id.split("-")[1]) : null;
        let oldContainerId: number = evt.from.id.split("-")[1] != "0" ? parseInt(evt.from.id.split("-")[1]) : null;
        let oldSection: Section = oldContainerId ? (formElements.all.filter((e: FormElement) => e instanceof Section && e.id === oldContainerId)[0]) as Section : null;
        let item: any = null;
        if (evt.item.childElementCount === 2) {
            item = formElements.all[evt.oldIndex] as Section;
        }
        else if (evt.item.childElementCount === 1) {
            let oldSiblings: any = oldSection ? oldSection.questions : formElements;
            item = oldSiblings.all[evt.oldIndex] as Question;
        }
        else { // Error, it should be either 1 or 2 (Question or Section)
            return;
        }
        let oldIndex: number = evt.oldIndex;
        let newIndex: number = evt.newIndex;
        let indexes: any = this.getStartEndIndexes(newIndex, oldIndex);

        // We cannot move a section into another section
        if (newSectionId && item instanceof Section) {
            return;
        }

        if (!newSectionId) {
            if (oldSection) { // Item moved FROM oldSection TO vm.formElements
                this.updateSiblingsPositions(oldSection.questions, false, null, oldIndex);
                this.updateSiblingsPositions(formElements, true, null, newIndex);
                item.position = newIndex + 1;
                item.section_id = null;
                item.section_position = null;
                oldSection.questions.all = oldSection.questions.all.filter((q: Question) => q.id != item.id);
                formElements.all.push(item);
                this.rePositionFormElements(oldSection.questions, PropPosition.SECTION_POSITION);
                this.rePositionFormElements(formElements, PropPosition.POSITION);
                this.updateNextFormElementValues(formElements);
                // Check new organisation and update
                let checksResult: boolean = FormElementUtils.checkFormElementsBeforeSave(formElements);
                if (!checksResult) return;
                await formElementService.update(this.concatConditionalQuestionsInsideSections(formElements));
                await questionService.update(oldSection.questions.all);
            }
            else { // Item moved FROM vm.formElements TO vm.formElements
                this.updateSiblingsPositions(formElements, true, indexes.goUp, indexes.startIndex, indexes.endIndex);
                item.position = newIndex + 1;
                item.section_id = null;
                item.section_position = null;
                this.rePositionFormElements(formElements, PropPosition.POSITION);
                this.updateNextFormElementValues(formElements);
                // Check new organisation and update
                let checksResult: boolean = FormElementUtils.checkFormElementsBeforeSave(formElements);
                if (!checksResult) return;
                await formElementService.update(this.concatConditionalQuestionsInsideSections(formElements));
            }
        }
        else {
            let newSection: Section = (formElements.all.filter((e: FormElement) => e instanceof Section && e.id === newSectionId)[0]) as Section;
            if (oldSection) { // Item moved FROM oldSection TO section with id 'newSectionId'
                if (newSection.id != oldSection.id) {
                    this.updateSiblingsPositions(oldSection.questions, false, null, oldIndex);
                    this.updateSiblingsPositions(newSection.questions, true, null, newIndex);
                }
                else {
                    this.updateSiblingsPositions(newSection.questions, true, indexes.goUp, indexes.startIndex, indexes.endIndex);
                }
                item.position = null;
                item.section_id = newSectionId;
                item.section_position = newIndex + 1;
                if (newSection.id != oldSection.id) {
                    oldSection.questions.all = oldSection.questions.all.filter((q: Question) => q.id != item.id);
                    newSection.questions.all.push(item);
                    this.rePositionFormElements(oldSection.questions, PropPosition.SECTION_POSITION);
                }
                this.rePositionFormElements(newSection.questions, PropPosition.SECTION_POSITION);
                this.updateNextFormElementValues(formElements);
                // Check new organisation and update
                let checksResult: boolean = FormElementUtils.checkFormElementsBeforeSave(formElements);
                if (!checksResult) return;
                let questionsToUpdate: Question[] = newSection.questions.all;
                if (newSection.id != oldSection.id) questionsToUpdate.concat(oldSection.questions.all);
                await questionService.update(questionsToUpdate);
            }
            else { // Item moved FROM vm.formElements TO section with id 'newSectionId'
                this.updateSiblingsPositions(formElements, false, null, oldIndex);
                this.updateSiblingsPositions(newSection.questions, true, null, newIndex);
                item.position = null;
                item.section_id = newSectionId;
                item.section_position = newIndex + 1;
                newSection.questions.all.push(item);
                formElements.all = formElements.all.filter((e: FormElement) => e.id != item.id);
                this.rePositionFormElements(newSection.questions, PropPosition.SECTION_POSITION);
                this.rePositionFormElements(formElements, PropPosition.POSITION);
                this.updateNextFormElementValues(formElements);
                // Check new organisation and update
                let checksResult: boolean = FormElementUtils.checkFormElementsBeforeSave(formElements);
                if (!checksResult) return;
                await questionService.update(newSection.questions.all);
                await formElementService.update(this.concatConditionalQuestionsInsideSections(formElements));
            }
        }

        try {
            // No need to do the checks because we did it in one of the previous if/else
            await questionChoiceService.updateMultiple(this.getConditionalQuestionsChoices(formElements), item.form_id);
        } catch (err) {
            notify.error(idiom.translate('formulaire.error.questionChoiceService.update'));
            throw err;
        }
    };

    static onEndOrgaDragAndDrop = async (evt: any, formElements: FormElements) : Promise<boolean> => {
        let elem: HTMLElement = evt.item.firstElementChild.firstElementChild;
        let newSectionId: number = evt.to.id.split("-")[2] != "0" ? parseInt(evt.to.id.split("-")[2]) : null;
        newSectionId ? elem.classList.add("sectionChild") : elem.classList.remove("sectionChild");
        let oldContainerId: number = evt.from.id.split("-")[2] != "0" ? parseInt(evt.from.id.split("-")[2]) : null;
        let oldSection: Section = oldContainerId ? (formElements.all.filter((e: FormElement) => e instanceof Section && e.id === oldContainerId)[0]) as Section : null;
        let item: any = null;
        if (evt.item.childElementCount === 2) {
            item = formElements.all[evt.oldIndex] as Section;
        }
        else if (evt.item.childElementCount === 1) {
            let oldSiblings: any = oldSection ? oldSection.questions : formElements;
            item = oldSiblings.all[evt.oldIndex] as Question;
        }
        else { // Error, it should be either 1 or 2 (Question or Section)
            return true;
        }
        let oldIndex: number = evt.oldIndex;
        let newIndex: number = evt.newIndex;
        let indexes: any = this.getStartEndIndexes(newIndex, oldIndex);

        // We cannot move a section into another section
        if (newSectionId && item instanceof Section) {
            return true;
        }

        if (!newSectionId) {
            if (oldSection) { // Item moved FROM oldSection TO vm.formElements
                this.updateSiblingsPositions(oldSection.questions, false, null, oldIndex);
                this.updateSiblingsPositions(formElements, true, null, newIndex);
                item.position = newIndex + 1;
                item.section_id = null;
                item.section_position = null;
                formElements.all.push(item);
                oldSection.questions.all = oldSection.questions.all.filter((q: Question) => q.id != item.id);
                this.rePositionFormElements(formElements, PropPosition.POSITION);
                this.rePositionFormElements(oldSection.questions, PropPosition.SECTION_POSITION);
                this.updateNextFormElementValues(formElements);
            }
            else { // Item moved FROM vm.formElements TO vm.formElements
                this.updateSiblingsPositions(formElements, true, indexes.goUp, indexes.startIndex, indexes.endIndex);
                item.position = newIndex + 1;
                item.section_id = null;
                item.section_position = null;
                this.rePositionFormElements(formElements, PropPosition.POSITION);
                this.updateNextFormElementValues(formElements);
            }
        }
        else {
            let newSection: Section = (formElements.all.filter((e: FormElement) => e instanceof Section && e.id === newSectionId)[0]) as Section;
            if (oldSection) { // Item moved FROM oldSection TO section with id 'newSectionId'
                if (newSection.id != oldSection.id) {
                    this.updateSiblingsPositions(oldSection.questions, false, null, oldIndex);
                    this.updateSiblingsPositions(newSection.questions, true, null, newIndex);
                }
                else {
                    this.updateSiblingsPositions(newSection.questions, true, indexes.goUp, indexes.startIndex, indexes.endIndex);
                }
                item.position = null;
                item.section_id = newSectionId;
                item.section_position = newIndex + 1;
                if (newSection.id != oldSection.id) {
                    oldSection.questions.all = oldSection.questions.all.filter((q: Question) => q.id != item.id);
                    newSection.questions.all.push(item);
                    this.rePositionFormElements(oldSection.questions, PropPosition.SECTION_POSITION);
                }
                this.rePositionFormElements(newSection.questions, PropPosition.SECTION_POSITION);
                this.updateNextFormElementValues(formElements);
            }
            else { // Item moved FROM vm.formElements TO section with id 'newSectionId'
                this.updateSiblingsPositions(formElements, false, null, oldIndex);
                this.updateSiblingsPositions(newSection.questions, true, null, newIndex);
                item.position = null;
                item.section_id = newSectionId;
                item.section_position = newIndex + 1;
                newSection.questions.all.push(item);
                formElements.all = formElements.all.filter((e: FormElement) => e.id != item.id);
                this.rePositionFormElements(newSection.questions, PropPosition.SECTION_POSITION);
                this.rePositionFormElements(formElements, PropPosition.POSITION);
                this.updateNextFormElementValues(formElements);
            }
        }

        formElements.all.sort((a: FormElement, b: FormElement) => a.position - b.position);
        return false;
    };

    static updateSiblingsPositions = (formElements: FormElements|Questions, isAdd: boolean, goUp: boolean, startIndex: number, endIndex?: number) : void => {
        if (formElements instanceof Questions) {
            this.updateSectionPositionsAfter(formElements, isAdd, goUp, startIndex, endIndex);
        }
        else {
            this.updatePositionsAfter(formElements, isAdd, goUp, startIndex, endIndex);
        }
    };

    static updatePositionsAfter = (formElements: FormElements|Questions, isAdd: boolean, goUp: boolean, startIndex: number, endIndex?: number) : void => {
        endIndex = endIndex ? endIndex : formElements.all.length;
        for (let i = startIndex; i < endIndex; i++) {
            let formElement = formElements.all[i];
            if (goUp === null) {
                isAdd ? formElement.position++ : formElement.position--;
            }
            else {
                goUp ? formElement.position++ : formElement.position--;
            }
        }
    };

    static updateSectionPositionsAfter = (questions: Questions, isAdd: boolean, goUp: boolean, startIndex: number, endIndex?: number) : void => {
        endIndex = endIndex ? endIndex : questions.all.length;
        for (let i = startIndex; i < endIndex; i++) {
            let question = questions.all[i];
            if (goUp === null) {
                isAdd ? question.section_position++ : question.section_position--;
            }
            else {
                goUp ? question.section_position++ : question.section_position--;
            }
        }
    };

    static getStartEndIndexes = (newIndex: number, oldIndex: number) : any => {
        let indexes = {startIndex: -1, endIndex: -1, goUp: false};
        if (newIndex < oldIndex) {
            indexes.goUp = true;
            indexes.startIndex = newIndex;
            indexes.endIndex = oldIndex;
        }
        else {
            indexes.goUp = false;
            indexes.startIndex = oldIndex;
            indexes.endIndex = newIndex + 1;
        }
        return indexes;
    }

    static rePositionFormElements = (formElements: FormElements|Questions, propPosition: PropPosition) : void => {
        formElements.all.sort((a, b) => a[propPosition] - b[propPosition]);
        for (let i: number = 0; i < formElements.all.length; i++) {
            formElements.all[i][propPosition] = i + 1;
        }
    }

    static updateNextFormElementValues = (formElements: FormElements) : void => {
        let elementsToUpdate: FormElement[] = formElements.getAllSectionsAndAllQuestions();
        for (let element of elementsToUpdate) {
            if (element instanceof Section && element.is_next_form_element_default) {
                element.setNextFormElementValuesWithDefault(formElements);
            }
            else if (element instanceof Section && !element.is_next_form_element_default) {
                let nextElementPosition: number = element.getNextFormElementPosition(formElements);
                if (nextElementPosition && nextElementPosition <= element.position) {
                    element.setNextFormElementValuesWithDefault(formElements);
                }
            }
            else if (element instanceof Question && element.conditional) {
                for (let choice of element.choices.all) {
                    if (choice.is_next_form_element_default) {
                        choice.setNextFormElementValuesWithDefault(formElements, element);
                    }
                    else {
                        let nextElementPosition: number = choice.getNextFormElementPosition(formElements);
                        if (nextElementPosition && nextElementPosition <= element.getPosition(formElements)) {
                            choice.setNextFormElementValuesWithDefault(formElements, element);
                        }
                    }
                }
            }
        }
    }

    static concatConditionalQuestionsInsideSections = (formElements: FormElements) : FormElement[] => {
        let insideConditionalQuestions: FormElement[] = (formElements.all as any)
            .filter((e: FormElement) => e instanceof Section)
            .flatMap((s: Section) => s.questions.all)
            .filter((q: Question) => q.conditional);
        return formElements.all.concat(insideConditionalQuestions);
    }

    static getConditionalQuestionsChoices = (formElements: FormElements) : QuestionChoice[] => {
        let conditionalQuestions: Question[] = formElements.getAllQuestions().all.filter((q: Question) => q.conditional);
        return (<any>conditionalQuestions).flatMap((q: Question) => q.choices.all);
    }

    // Progress-bar

    static getLongestPaths = (formElements: FormElements): Map<string, number> => {
        let pathsMap: Map<string, FormElementIdType[]> = this.getPathsMap(formElements);
        let longestPathsMap: Map<string, number> = new Map<string, number>();
        this.fillLongestPathsMap(pathsMap.keys().next().value, pathsMap, longestPathsMap);
        return longestPathsMap;
    }

    static getPathsMap = (formElements: FormElements): Map<string, FormElementIdType[]> => {
        let pathsMap: Map<string, FormElementIdType[]> = new Map<string, FormElementIdType[]>();
        for (let formElement of formElements.all) {
            pathsMap.set(formElement.getIdType().toString(), formElement.getAllPotentialNextFormElementsIdTypes(formElements));
        }
        return pathsMap;
    }

    static fillLongestPathsMap = (formElementIdType: string, pathsMap: Map<string, FormElementIdType[]>, longestPathsMap: Map<string, number>): number => {
        let stringFormElementIdType: string = formElementIdType.toString();
        let currentLongestPath: number = longestPathsMap.get(stringFormElementIdType);
        let targets: FormElementIdType[] = pathsMap.get(formElementIdType);

        // End of the form, there's no next element
        if (!targets || targets.every(((feit: FormElementIdType) => !feit))) {
            longestPathsMap.set(stringFormElementIdType, 0);
            return 0;
        }

        // If we got some targets we keep the max of their respective longestPaths
        let targetsLengths: number[] = targets
            .filter((feit: FormElementIdType) => feit)
            .map((feit: FormElementIdType) => this.fillLongestPathsMap(feit.toString(), pathsMap, longestPathsMap));
        let myLongestPath = (targetsLengths.length > 0 ? Math.max(...targetsLengths) : 0) + 1;
        if (!currentLongestPath || currentLongestPath < myLongestPath) longestPathsMap.set(stringFormElementIdType, myLongestPath);
        return myLongestPath;
    }

    // Checks

    /**
     * Check form elements before saving them
     * @param formElements FormElements to check
     */
    static checkFormElementsBeforeSave = (formElements: FormElements): boolean => {
        this.checkChoiceImages(formElements);
        return this.checkConditionalQuestions(formElements) &&
            this.checkTitles(formElements) &&
            this.checkCursorValues(formElements);
    }

    /**
     * Check if sections don't have more than one conditional question
     * @param formElements FormElements to check
     */
    static checkConditionalQuestions = (formElements: FormElements): boolean => {
        let sectionQuestionsList: Question[][] = formElements.getSections().all
            .filter((s: Section) => s.id)
            .map((s: Section) => s.questions.all);

        for (let sectionQuestions of sectionQuestionsList) {
            let conditionalQuestions: Question[] = sectionQuestions.filter(q => q.conditional);
            if (conditionalQuestions.length >= 2) {
                notify.error(idiom.translate('formulaire.section.save.multiple.conditional'));
                return false;
            }
        }

        return true;
    }

    /**
     * Check if form element titles are not empty
     * @param formElements FormElements to check
     */
    static checkTitles = (formElements: FormElements): boolean => {
        let elementsWithoutTitles: FormElement[] = formElements.all.filter(fe => !fe.title); // TODO check more than just titles later
        if (elementsWithoutTitles.length > 0) {
            notify.error(idiom.translate('formulaire.question.save.missing.field'));
            return false;
        }

        return true;
    }

    /**
     * Check if cursor values are ok
     * @param formElements FormElements to check
     */
    static checkCursorValues = (formElements: FormElements): boolean => {
        let questionsTypeCursor: Question[] = formElements.getAllQuestions().filter((q: Question) => q.question_type == Types.CURSOR);
        if (questionsTypeCursor.length > 0) {
            // We search for question where : (maxVal - minVal) % step == 0
            let inconsistencyCursorChoice: Question[] = questionsTypeCursor.filter((q: Question) => (
                ((q.specific_fields.cursor_max_val != null ? q.specific_fields.cursor_max_val : Constants.DEFAULT_CURSOR_MAX_VALUE) -
                    (q.specific_fields.cursor_min_val != null ? q.specific_fields.cursor_min_val : Constants.DEFAULT_CURSOR_MIN_VALUE)) %
                (q.specific_fields.cursor_step != null ? q.specific_fields.cursor_step : Constants.DEFAULT_CURSOR_STEP) != 0));

            if (inconsistencyCursorChoice.length > 0) {
                notify.error(idiom.translate('formulaire.question.cursor.inconsistency.between.values'));
                return false;
            }
        }

        return true;
    }

    /**
     * Check image and value of choices of MULTIPLEANSWER or SINGLEANSWER questions
     * @param formElements FormElements to check
     */
    static checkChoiceImages = (formElements: FormElements): void => { // Not a boolean 'cause we display error but it's not ap roblem for saving
        let multipleanswerOrSingleanswer: Question[] = formElements.getAllQuestions().filter((q: Question) => q.canHaveImages());
        const foundChoice = (<any>multipleanswerOrSingleanswer)
            .flatMap((q: Question) => q.choices.all)
            .find((c: QuestionChoice) => (c.image && !c.value));

        if (foundChoice) {
            notify.error(idiom.translate('formulaire.question.save.missing.field'));
        }
    }
}