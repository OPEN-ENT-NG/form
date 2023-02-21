import {Response, Responses} from "@common/models";

export class RankingUtils {
    static onEndRankingDragAndDrop = (evt: any, responses: Responses): boolean => {
        let oldIndex = evt.oldIndex;
        let newIndex = evt.newIndex;
        let indexes = RankingUtils.getStartEndIndexes(newIndex, oldIndex);

        RankingUtils.updateChoicePositionsAfter(responses, true, indexes.goUp, indexes.startIndex, indexes.endIndex);

        responses.all.sort((a: Response, b: Response) => a.choice_position - b.choice_position);
        return false;
    }

    static updateChoicePositionsAfter = (responses: Responses, isAdd: boolean, goUp: boolean, startIndex: number, endIndex?: number): void => {
        endIndex = responses.all.length;
        for (let i = startIndex; i < endIndex; i++) {
            let elt = responses.all[i];
            if (goUp === null) {
                isAdd ? elt.choice_position++ : elt.choice_position--;
            } else {
                goUp ? elt.choice_position++ : elt.choice_position--;
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
}