/**
 * Title: Player Model
 * Description: It is responsible for for holding all kinds of player info
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:07
 */

import { Constants } from '../Constants';
import { Helper } from '../Generic/Helper';

export class Player {
    private mHighScore: number;
    private mCurrentGameLevel: number;
    private mRowCleared: number;
    public static create(): Player {
        return new Player();
    }
    constructor() {
        this.setGameLevel(1);
        this.setRowClearedCount(0);
        this.setHighScore(Helper.getLocalInt(Constants.LOCAL_STORAGE_KEYS.HighScore));
    }

    public setHighScore(score: number): void {
        this.mHighScore = score;
        Helper.setLocalInt(Constants.LOCAL_STORAGE_KEYS.HighScore, this.mHighScore);
    }

    public getHighScore(): number {
        return this.mHighScore;
    }

    /**
     *
     * @param level should be in between 1 to (Grid Height - 4)
     * @returns
     */
    public setGameLevel(level: number): void {
        if (level <= 0) {
            return;
        }
        this.mCurrentGameLevel = level;
    }

    public getGameLevel(): number {
        return this.mCurrentGameLevel;
    }

    public setRowClearedCount(count: number): void {
        this.mRowCleared = count;
    }

    public getRowClearedCount(): number {
        return this.mRowCleared;
    }

    reset(): void {
        this.setRowClearedCount(0);
    }
}
