/**
 * Title: Game Controller
 * Description: It Controlls the game loop with the help of game scene, tetrimino and Persistent Component
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:37
 */

import PersistentComponent from '../Components/PersistentComponent';
import { Config } from '../Configs/Config';
import { Constants, MoveDirection, GameState } from '../Constants';
import { Helper } from '../Generic/Helper';
import Tetrimino from '../Components/Tetrimino';
import { Logger } from '../Generic/Logger';

export default class GameController {
    private mGameState: GameState = GameState.Ready;
    private mGridBlocksMap: number[][];
    private mPersistentComponent: PersistentComponent = null;
    private mUpcomingTetrimino: Tetrimino = null;
    private mCurrentTetrimino: Tetrimino = null;
    private mLogger: Logger = null;

    public static create(): GameController {
        return new GameController();
    }

    constructor() {
        this.mCurrentTetrimino = null;
        this.mUpcomingTetrimino = null;
        this.mGameState = GameState.Ready;
        this.mGridBlocksMap = [];
        this.mLogger = Logger.create('GameController', false);
    }

    public setPersistentComponent(persistentComponent: PersistentComponent) {
        this.mPersistentComponent = persistentComponent;
    }

    public getGridBlocksMap(): number[][] {
        return this.mGridBlocksMap;
    }

    public gameStart() {
        this.mLogger.Log('Starting game play');
        this.mUpcomingTetrimino = this.mPersistentComponent
            .getGameScene()
            .generateUpcomingTetrimino();
        this.setGameLevel(this.mPersistentComponent.getPlayer().getGameLevel() - 1);
        this.setGameState(GameState.Running);
        this.cloneUpcomingAndCreateAnotherTetrimino();
    }

    private setGameLevel(level: number): void {
        this.mGridBlocksMap = this.createBlocksGridMap(
            Config.GRID_SIZE.width,
            Config.GRID_SIZE.height,
            level
        );
        this.mCurrentTetrimino = null;
        this.updateBlocksGrid();
    }

    public setGameState(state: GameState): void {
        this.mGameState = state;
    }

    public getGameState(): GameState {
        return this.mGameState;
    }

    private cloneUpcomingAndCreateAnotherTetrimino(): void {
        this.mCurrentTetrimino = this.mPersistentComponent
            .getGameScene()
            .addMovingTerimino(this.mUpcomingTetrimino);

        this.mCurrentTetrimino.moveToTopPosition();
        this.mUpcomingTetrimino = this.mPersistentComponent
            .getGameScene()
            .generateUpcomingTetrimino();
    }

    public addStaticTetriminoBlocks(tetrimino: Tetrimino): void {
        let row = Constants.TETRIMINO_TEMPLATE_SIZE;

        while (row--) {
            for (let col = 0; col < Constants.TETRIMINO_TEMPLATE_SIZE; col++) {
                let blocksData = tetrimino.getBlocksPatternData();

                if (!blocksData[row][col]) {
                    continue;
                }

                let tetriGridPos = tetrimino.getTetriminoPosition();
                let gridPos = cc.v2(
                    tetriGridPos.x + col,
                    tetriGridPos.y + (Constants.TETRIMINO_TEMPLATE_SIZE - row - 1)
                );

                this.mGridBlocksMap[gridPos.y][gridPos.x] = tetrimino.getTetriminoColorIndex();
            }
        }

        tetrimino.node.removeFromParent();

        this.updateBlocksGrid();

        // Check if the game is over
        let gameOver = !Helper.isRowEmpty(this.mGridBlocksMap[Config.GRID_SIZE.height - 2]);

        if (gameOver) {
            this.mLogger.Warn('Game over!');
            this.mGameState = GameState.GameOver;
            this.mPersistentComponent.getGameScene().gameOver();
        } else {
            this.cloneUpcomingAndCreateAnotherTetrimino();
        }
    }

    private playClearSound() {}

    private removeAllCompletedLines() {
        let clearCount: number = 0;

        this.mGridBlocksMap = this.mGridBlocksMap.filter((row: number[]) => {
            if (!Helper.isRowFilled(row)) {
                return true;
            }
            clearCount++;
            return false;
        }, this);

        if (clearCount) {
            this.playClearSound();
            this.mPersistentComponent.getGameScene().onRowClearComplete(clearCount);
        }

        while (clearCount--) {
            this.mGridBlocksMap.push(this.createRow(Config.GRID_SIZE.width));
        }
    }

    private recreateGridBlocks() {
        this.mPersistentComponent.getGameScene().removeAllBlocksFromBlockHolder();

        // Recreate the grid
        for (let i = 0; i < Config.GRID_SIZE.height; i++) {
            for (let j = 0; j < Config.GRID_SIZE.width; j++) {
                if (this.mGridBlocksMap[i][j] == 0) {
                    continue;
                }

                let x = (j + 0.5) * Config.BLOCK_SIZE.width;
                let y = (i + 0.5) * Config.BLOCK_SIZE.height;
                let prevColorIndex = this.mGridBlocksMap[i][j];

                this.mPersistentComponent
                    .getGameScene()
                    .addBlockToBlocksHolder(cc.v2(x, y), prevColorIndex);
            }
        }
    }

    private updateBlocksGrid() {
        this.removeAllCompletedLines();
        this.recreateGridBlocks();
    }

    private createBlocksGridMap(width: number, height: number, gameLevel: number): number[][] {
        let blocksMap: number[][] = [];

        for (let i = 0; i < height; i++) {
            let rowHasBlocks: boolean = i < gameLevel;
            blocksMap.push(this.createRow(width, rowHasBlocks));
        }
        return blocksMap;
    }

    private createRow(width: number, needCreateBlocks?: boolean): number[] {
        let row = [];
        while (width--) {
            row.push(needCreateBlocks ? Math.round(Math.random()) : 0);
        }
        return row;
    }

    public onDirectionChange(direction: MoveDirection): void {
        if (this.mCurrentTetrimino) {
            this.mCurrentTetrimino.canPerformUserAction = true;
            this.mCurrentTetrimino.changeDirection(direction);
        }
    }

    public onDirectionCancel(): void {
        if (this.mCurrentTetrimino) {
            this.mCurrentTetrimino.canPerformUserAction = false;
            this.mCurrentTetrimino.cancelDirection();
        }
    }
}
