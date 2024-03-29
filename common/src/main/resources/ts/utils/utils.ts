import {model} from "entcore";

export class UtilsUtils {
    static safeApply = (scope, fn?) => {
        const phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            scope.$apply(fn);
        }
    };

    /**
     * Get a random value in a given list but excluding given values
     * @param list              List of values where to pick randomly (can be primitive, Array<primitive>, etc. but not object)
     * @param excludedValues    List of values to exclude from the random picking (should be same type as 'list')
     */
    static getRandomValueInList = (list: any[], excludedValues: any[]) : any => {
        if (list.every((item: any) => (<any>excludedValues).includes(item))) {
            return UtilsUtils.getRandomValueInList(list, []);
        }
        let randomIndex: number = Math.floor(Math.random() * list.length);
        let randomColor: string = list[randomIndex];
        return !(<any>excludedValues).includes(randomColor) ? randomColor : UtilsUtils.getRandomValueInList(list, excludedValues);
    }

    static getOwnerName = () : string => {
        return model.me.firstName + model.me.lastName;
    }

    static getOwnerNameWithUnderscore = () : string => {
        return UtilsUtils.getOwnerName() + "_";
    }

    static getFilenameWithoutOwnerName = (filename: string) : string => {
        let ownerNameUnderscore = UtilsUtils.getOwnerNameWithUnderscore();
        let indexStartFilename: number = filename.indexOf(ownerNameUnderscore) == 0 ?
            ownerNameUnderscore.length : 0;
        return filename.substring(indexStartFilename);
    }

    static areArrayEqual = <T extends string[] | number[]> (array1: T, array2: T) : boolean => {
        if (array1.length != array2.length) return false;
        for (let i: number = 0; i < array1.length; i++) if (array1[i] !== array2[i]) return false;
        return true;
    }
}