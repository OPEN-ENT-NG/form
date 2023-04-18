import {Selectable} from "entcore-toolkit";
import {FormElementType} from "@common/core/enums/form-element-type";
import {FormElements, Question, Section, Types} from "@common/models";

export abstract class FormElement implements Selectable {
    id: number;
    form_id: number;
    title: string;
    position: number;
    form_element_type: FormElementType;
    nb_responses: number;
    selected: boolean;

    protected constructor() {
        this.id = null;
        this.form_id = null;
        this.title = null;
        this.position = null;
        this.nb_responses = 0;
        this.selected = null;
    }

    toJson() : Object {
        return {
            id: this.id,
            form_id: this.form_id,
            title: this.title,
            position: this.position,
            form_element_type: this.form_element_type,
            nb_responses: this.nb_responses,
            selected: this.selected
        }
    }

    isSection = () : boolean => {
        return this.form_element_type === FormElementType.SECTION;
    }

    isQuestion = () : boolean => {
        return this.form_element_type === FormElementType.QUESTION;
    }

    isSameQuestionType = (formElement: FormElement) : boolean => {
        return this instanceof Question && this.isSameQuestionType(formElement);
    }

    isSameQuestionTypeOfType = (formElement: FormElement, type: Types) : boolean => {
        return this instanceof Question && this.isSameQuestionTypeOfType(formElement, type);
    }

    equals = (formElement: FormElement) : boolean => {
        return this.form_element_type === formElement.form_element_type && this.id === formElement.id;
    }

    getPosition = (formElements: FormElements) : number => {
        return this.position ?
            this.position :
            formElements.all.filter((e: FormElement) => this instanceof Question && e.id === this.section_id)[0].position;
    }

    getFollowingFormElement = (formElements: FormElements) : FormElement => {
        // Case formElement is not formElement but question inside a section
        if (this instanceof Question && this.section_id) {
            let parent: Section = this.getParentSection(formElements);
            let nextElements: FormElement[] = formElements.all.filter((e: FormElement) => e.id === parent.position + 1);
            return nextElements.length == 1 ? nextElements[0] : null;
        }

        // Case formElement is section without target or just a solo question
        let nextPosition: number = this.position + 1;
        let nextElements: FormElement[] = formElements.all.filter((e: FormElement) => e.position === nextPosition);
        return nextElements.length == 1 ? nextElements[0] : null;
    }

    getFollowingFormElementPosition = (formElements: FormElements) : number => {
        let nextFormElement: FormElement = this.getFollowingFormElement(formElements);
        return nextFormElement ? nextFormElement.position : null;
    }
}