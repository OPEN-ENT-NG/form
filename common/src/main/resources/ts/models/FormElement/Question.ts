import {Mix, Selection} from "entcore-toolkit";
import {idiom, notify} from "entcore";
import {questionChoiceService, questionService} from "../../services";
import {QuestionChoice, QuestionChoices} from "../QuestionChoice";
import {Types} from "../QuestionType";
import {FormElement} from "./FormElement";
import {Distribution, Distributions} from "../Distribution";
import {Response} from "../Response";
import {Constants} from "@common/core/constants";
import {FormElementUtils} from "@common/utils";
import {PropPosition} from "@common/core/enums/prop-position";

export class Question extends FormElement {
    question_type: number;
    statement: string;
    mandatory: boolean;
    section_id: number;
    section_position: number;
    conditional: boolean;
    matrix_id: number;
    matrix_position: number;
    choices: QuestionChoices;
    placeholder: string;
    children: Questions;
    cursor_min_val: number;
    cursor_max_val: number;
    cursor_step: number;
    cursor_min_label: string;
    cursor_max_label: string;

    constructor(matrixId?: number, questionType?: number, matrixPosition?: number) {
        super();
        this.question_type = questionType ? questionType : null;
        this.statement = null;
        this.mandatory = false;
        this.section_id = null;
        this.section_position = null;
        this.conditional = false;
        this.matrix_id = matrixId ? matrixId : null;
        this.matrix_position = matrixPosition ? matrixPosition : null;
        this.choices = new QuestionChoices();
        this.children = new Questions();
        this.placeholder = null;
        this.cursor_min_val = null;
        this.cursor_max_val = null;
        this.cursor_step = null;
        this.cursor_min_label = null;
        this.cursor_max_label = null;
    }

    toJson() : Object {
        return {
            id: this.id,
            form_id: this.form_id,
            title: this.title,
            placeholder: this.placeholder,
            position: this.position,
            selected: this.selected,
            question_type: this.question_type,
            statement: this.statement,
            mandatory: this.mandatory,
            section_id: this.section_id,
            section_position: this.section_position,
            conditional: this.conditional,
            matrix_id: this.matrix_id,
            matrix_position: this.matrix_position,
            choices: this.choices,
            children: this.children,
            cursor_min_val: this.cursor_min_val,
            cursor_max_val: this.cursor_max_val,
            cursor_step: this.cursor_step,
            cursor_min_label: this.cursor_min_label,
            cursor_max_label: this.cursor_max_label
        }
    }

    // Choices functions

    createNewChoice = (isCustom: boolean = false) : void => {
        let existingCustomChoice: QuestionChoice = this.choices.all.find((c: QuestionChoice) => c.is_custom);
        if (existingCustomChoice && isCustom) return; // Cannot have two custom choices
        else if (existingCustomChoice && !isCustom) {
            // If a custom choice was existing we keep it positioned at the end by making room for the new choice
            existingCustomChoice.position = this.choices.all.length + 1;
        }

        let nbNotCustomChoices: number = this.choices.all.filter((c: QuestionChoice) => !c.is_custom).length;
        let choice: QuestionChoice = new QuestionChoice(this.id, nbNotCustomChoices + 1);
        if (isCustom) {
            choice.is_custom = true;
            choice.value = idiom.translate('formulaire.other');
        }

        this.choices.all.push(choice);
        this.choices.all.sort((a, b) => a.position - b.position);
    }

    moveChoice = (choice: QuestionChoice, direction: string) : void => {
        FormElementUtils.switchPositions(this.choices, choice.position - 1, direction, PropPosition.POSITION);
        this.choices.all.sort((a, b) => a.position - b.position);
    }

    deleteChoice = async (index: number) : Promise<void> => {
        if (this.choices.all[index].id) {
            await questionChoiceService.delete(this.choices.all[index].id);
        }
        for (let i = index + 1; i < this.choices.all.length; i++) {
            this.choices.all[i].position--;
        }
        this.choices.all.splice(index,1);
        this.choices.all.sort((a, b) => a.position - b.position);
        return;
    }

    fillChoicesInfo = (distribs: Distributions, results: Response[]) : void => {
        if (this.question_type === Types.MATRIX) {
            return this.fillChoicesInfoForMatrix(results);
        }

        // Count responses for each choice
        results = results.filter((r: Response) => r.question_id === this.id);
        for (let result of results) {
            for (let choice of this.choices.all) {
                if (result.choice_id === choice.id) {
                    choice.nbResponses++;
                }
            }
        }

        // Deal with no choice responses
        let finishedDistribIds : number[] = distribs.all.map((d: Distribution) => d.id);
        let noResponseChoice: QuestionChoice = new QuestionChoice(this.id, this.choices.all.length + 1);
        noResponseChoice.value = idiom.translate('formulaire.response.empty');
        noResponseChoice.nbResponses = results.filter(r => !r.choice_id && (<any>finishedDistribIds).includes(r.distribution_id)).length;

        this.choices.all.push(noResponseChoice);
    }

    fillChoicesInfoForMatrix = (results: Response[]) : void => {
        if (this.question_type != Types.MATRIX) {
            return this.fillChoicesInfo(null, results);
        }

        // Count responses for each choice
        let childrenIds: number[] = this.children.all.map((q:Question) => q.id);
        results = results.filter((r: Response) => childrenIds.indexOf(r.question_id) >= 0);
        for (let child of this.children.all) {

            // Create child choices based on copy of parent choices
            child.choices.all = [];
            for (let choice of this.choices.all) {
                child.choices.all.push(new QuestionChoice(this.id, choice.position, choice.value));
            }

            let matchingResults: Response[] = results.filter((r: Response) => r.question_id === child.id);
            for (let result of matchingResults) {
                for (let choice of this.choices.all) {
                    if (result.choice_id === choice.id) {
                        child.choices.all.filter((c: QuestionChoice) => c.value === choice.value)[0].nbResponses++;
                    }
                }
            }
        }
    }

    hasCustomChoice = () : boolean => {
        return this.choices.all.filter((c: QuestionChoice) => c.is_custom).length > 0;
    }

    // Types functions

    isTypeGraphQuestion = () : boolean => {
        return this.question_type == Types.SINGLEANSWER
            || this.question_type == Types.MULTIPLEANSWER
            || this.question_type == Types.SINGLEANSWERRADIO
            || this.question_type == Types.MATRIX
            || this.question_type == Types.CURSOR
            || this.question_type == Types.RANKING;
    }

    isTypeChoicesQuestion = () : boolean => {
        return this.question_type == Types.SINGLEANSWER
            || this.question_type == Types.MULTIPLEANSWER
            || this.question_type == Types.SINGLEANSWERRADIO
            || this.question_type == Types.MATRIX
            || this.question_type == Types.RANKING
    }

    isTypeMultipleRep = () : boolean => {
        return this.question_type == Types.MULTIPLEANSWER
            || this.question_type == Types.MATRIX;
    }

    isMatrixSingle = () : boolean => {
        return this.question_type == Types.MATRIX
            && this.children.all.length > 0 &&
            this.children.all[0].question_type == Types.SINGLEANSWER;
    }

    isMatrixMultiple = () : boolean => {
        return this.question_type == Types.MATRIX
            && this.children.all.length > 0 &&
            this.children.all[0].question_type == Types.MULTIPLEANSWER;
    }

    isRanking = () : boolean => {
        return this.question_type == Types.RANKING;
    }

    canHaveCustomAnswers = () : boolean => {
        return this.question_type == Types.SINGLEANSWER
            || this.question_type == Types.MULTIPLEANSWER
            || this.question_type == Types.SINGLEANSWERRADIO;
    }
}

export class Questions extends Selection<Question> {
    all: Question[];

    constructor() {
        super([]);
    }

    sync = async (id: number, isForSection= false) : Promise<void> => {
        try {
            let data = await questionService.list(id, isForSection);
            this.all = Mix.castArrayAs(Question, data);
            if (this.all.length > 0) {
                await this.syncChoices();
                await this.syncChildren();
            }
        } catch (e) {
            notify.error(idiom.translate('formulaire.error.question.sync'));
            throw e;
        }
    }

    syncChoices = async () : Promise<void> => {
        let choicesQuestions: Question[] = this.all.filter((q: Question) => q.isTypeChoicesQuestion());
        if (choicesQuestions.length > 0) {
            let data = await questionChoiceService.listChoices(this.all.map((q: Question) => q.id));
            let listChoices: QuestionChoice[] = Mix.castArrayAs(QuestionChoice, data);
            for (let question of choicesQuestions) {
                question.choices.all = listChoices.filter((c: QuestionChoice) => c.question_id === question.id);
                let nbChoices: number = question.choices.all.length;
                if (nbChoices <= 0) {
                    for (let j = 0; j < Constants.DEFAULT_NB_CHOICES; j++) {
                        question.choices.all.push(new QuestionChoice(question.id, j+1));
                    }
                }
                question.choices.all.sort((a: QuestionChoice, b: QuestionChoice) => a.position - b.position);
            }
        }
    }

    syncChildren = async () : Promise<void> => {
        let matrixQuestions: Question[] = this.all.filter((q: Question) => q.question_type == Types.MATRIX);
        if (matrixQuestions.length > 0) {
            let data = await questionService.listChildren(matrixQuestions);
            let listChildrenQuestions: Question[] = Mix.castArrayAs(Question, data);
            for (let question of matrixQuestions) {
                question.children.all = listChildrenQuestions.filter((q: Question) => q.matrix_id === question.id);
                let nbChildren: number = question.children.all.length;
                if (nbChildren <= 0) {
                    for (let j = 0; j < Constants.DEFAULT_NB_CHILDREN; j++) {
                        question.children.all.push(new Question(question.id, Types.SINGLEANSWERRADIO, j+1));
                    }
                }
                question.children.all.sort((a: Question, b: Question) => a.matrix_position - b.matrix_position);
            }
        }
    }
}