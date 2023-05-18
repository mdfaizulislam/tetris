/**
 * Title: Helper Class
 * Description: It contains static utility methods which will be used inside tetris game
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:27
 */

import { Constants } from '../Constants';
import { Paddings } from '../Models/Paddings';

export class Helper {
    private static mNextColorIndex: number = -1;
    static getEventHandler(
        node: cc.Node,
        component: string,
        functionName: string,
        data?: any
    ): cc.Component.EventHandler {
        var eHandler: cc.Component.EventHandler = new cc.Component.EventHandler();
        eHandler.target = node;
        eHandler.component = component;
        eHandler.handler = functionName;
        eHandler.customEventData = data;
        return eHandler;
    }

    public static isRowEmpty(row: number[]): boolean {
        let i = row.length;
        while (i--) {
            if (row[i]) {
                return false;
            }
        }
        return true;
    }

    public static isColEmpty(twoDiArray: number[][], col: number): boolean {
        let i = twoDiArray.length;
        while (i--) {
            if (twoDiArray[i][col]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check whether the specified line can be deleted
     * @param row
     * @returns {boolean}
     */
    public static isRowFilled(row: number[]): boolean {
        let colIndex = row.length;
        while (colIndex--) {
            if (row[colIndex] == 0) {
                return false;
            }
        }
        return true;
    }

    public static getRandomInt(num: number): number {
        return Math.floor(Math.random() * num);
    }

    public static getShuffledTetriminoPatterns(): number[][][] {
        // create temp array
        let tempArray = [];
        for (let index in Constants.TETRIMINO_PATTERNS) {
            tempArray.push(Constants.TETRIMINO_PATTERNS[index]);
        }

        let length: number = Constants.TETRIMINO_PATTERNS.length;

        // shuffle and
        let result = [];
        for (let i = 0; i < length; i++) {
            let arrayIndex = Helper.getRandomInt(tempArray.length);
            result[i] = tempArray[arrayIndex];
            tempArray.splice(arrayIndex, 1);
        }
        return result[0];
    }

    public static getTetriPaddings(blocksMap: number[][]): Paddings {
        let paddings = Paddings.create();
        let row = Constants.TETRIMINO_TEMPLATE_SIZE;

        while (row--) {
            if (!Helper.isRowEmpty(blocksMap[row])) {
                break;
            }
            paddings.top++;
        }

        for (let i = 0; i < Constants.TETRIMINO_TEMPLATE_SIZE; i++) {
            if (!Helper.isColEmpty(blocksMap, i)) {
                break;
            }
            paddings.left++;
        }

        let col = Constants.TETRIMINO_TEMPLATE_SIZE;

        while (col--) {
            if (!Helper.isColEmpty(blocksMap, col)) {
                break;
            }
            paddings.right++;
        }

        return paddings;
    }

    public static getLocalInt(key: string): number {
        let v = cc.sys.localStorage.getItem(key);
        if (v !== null) {
            return parseInt(v);
        }
        Helper.setLocalInt(key, 0);
        return 0;
    }

    public static setLocalInt(key: string, value: number): void {
        cc.sys.localStorage.setItem(key, value);
    }

    public static getNextColorIndex(): number {
        Helper.mNextColorIndex += 1;
        if (Helper.mNextColorIndex >= Constants.BLOCK_COLORS) {
            Helper.mNextColorIndex = 0;
        }
        return Helper.mNextColorIndex;
    }
}
