/**
 * Title: Tetrimino Component
 * Description: tetrimino which is create using tetrimino pattern and performs it's
 * actions and notify game controller once it's actions are done.
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:31
 */

import { Config } from '../Configs/Config';
import { Constants, MoveDirection, GameState } from '../Constants';
import { Helper } from '../Generic/Helper';
import { Logger } from '../Generic/Logger';
import Block from './Block';
import PersistentComponent from './PersistentComponent';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tetrimino extends cc.Component {
    @property(cc.Prefab)
    private mBlockPrefab: cc.Prefab = null;
    private mPersistentComponent: PersistentComponent = null;
    private mLogger: Logger = null;

    private mIsAcceptingActions: boolean = false;
    private mIsDynamic: boolean = true;
    private mAccelerateMovingDown: boolean = false;
    private mIsInitialized: boolean = false;

    private mColorIndex: number = 0;
    private mRotationIndex: number;

    private mMovigDownInterval: number;
    private mChangeActionInterval: number;
    private mFallElapsedTime: number;
    private mChangeElapsedTime: number;

    private mMooveDirection: MoveDirection;
    private mTetriminoPosition: cc.Vec2;
    private mTemplateData: number[][][];
    private mCurrentBlockPatternData: number[][];

    public set movable(value: boolean) {
        this.mIsDynamic = value;
    }

    public get movable() {
        return this.mIsDynamic;
    }

    public set canPerformUserAction(value: boolean) {
        this.mIsAcceptingActions = value;
    }

    public get canPerformUserAction(): boolean {
        return this.mIsAcceptingActions;
    }

    protected onLoad() {
        this.mPersistentComponent = cc.find('PersistantNode').getComponent(PersistentComponent);
        this.mLogger = Logger.create('Tetrimino', false);
        this.mMovigDownInterval = Config.BLOCK_MOVING_INTERVAL;
        this.mChangeActionInterval = Config.BLOCK_ACTOION_CHANGE_INTERVAL;
        this.mMooveDirection = MoveDirection.None;

        this.mFallElapsedTime = 0;
        this.mChangeElapsedTime = -1;

        if (!this.mIsInitialized) {
            this.mTemplateData = Helper.getShuffledTetriminoPatterns();
            this.mRotationIndex = Helper.getRandomInt(this.mTemplateData.length);
        }

        this.mCurrentBlockPatternData = [];
        this.mTetriminoPosition = cc.v2(0, 0);

        this.node.setContentSize(
            Config.BLOCK_SIZE.width * Constants.TETRIMINO_TEMPLATE_SIZE,
            Config.BLOCK_SIZE.height * Constants.TETRIMINO_TEMPLATE_SIZE
        );

        this.updateTetriminoBlocks();
    }

    public setTetriminoColorIndex(index: number) {
        this.mColorIndex = index;
    }

    public getTetriminoColorIndex(): number {
        return this.mColorIndex;
    }

    public getTetriminoPatternTemplateData(): number[][][] {
        return this.mTemplateData;
    }

    public getBlocksPatternData(): number[][] {
        return this.mCurrentBlockPatternData;
    }

    private getCurrentRotationIndex(): number {
        return this.mRotationIndex;
    }

    private setTetriminoPosition(pos: cc.Vec2): void {
        this.mTetriminoPosition.x = pos.x;
        this.mTetriminoPosition.y = pos.y;

        let x = this.mTetriminoPosition.x * Config.BLOCK_SIZE.width;
        let y = this.mTetriminoPosition.y * Config.BLOCK_SIZE.height;

        this.node.setPosition(cc.v2(x, y));
    }

    public getTetriminoPosition(): cc.Vec2 {
        return this.mTetriminoPosition;
    }

    public initializeWithTetrimino(tetrimino: Tetrimino) {
        this.mTemplateData = tetrimino.getTetriminoPatternTemplateData();
        this.mRotationIndex = tetrimino.getCurrentRotationIndex();

        this.setTetriminoColorIndex(tetrimino.getTetriminoColorIndex());
        this.updateTetriminoBlocks();

        this.mIsInitialized = true;
    }

    public moveToTopPosition(): void {
        let positionX = Math.floor(
            Config.GRID_SIZE.width / 2 - Constants.TETRIMINO_TEMPLATE_SIZE / 2
        );
        this.mLogger.Log('moveToTopPosition -> PositionX: ', positionX);
        this.setTetriminoPosition(
            cc.v2(positionX, Config.GRID_SIZE.height - Constants.TETRIMINO_TEMPLATE_SIZE)
        );
    }

    private updateTetriminoBlocks(): void {
        // remove old blocks
        this.node.removeAllChildren();

        // Refresh the current grid data
        this.mCurrentBlockPatternData = this.mTemplateData[this.mRotationIndex];

        let row = Constants.TETRIMINO_TEMPLATE_SIZE;

        // add all blocks
        while (row--) {
            for (let col = 0; col < Constants.TETRIMINO_TEMPLATE_SIZE; col++) {
                if (!this.mCurrentBlockPatternData[row][col]) {
                    continue;
                }

                let block = cc.instantiate(this.mBlockPrefab);
                let x = (col + 0.5) * Config.BLOCK_SIZE.width;
                let y = (Constants.TETRIMINO_TEMPLATE_SIZE - row - 0.5) * Config.BLOCK_SIZE.height;
                block.setPosition(cc.v2(x, y));
                block.getComponent(Block).setSpriteFrame(this.mColorIndex);

                this.node.addChild(block);
            }
        }
    }

    private isTetriminoPositionValid(tetriminoPosition: cc.Vec2, blocksData?: number[][]): boolean {
        if (blocksData == null) {
            blocksData = this.mCurrentBlockPatternData;
        }

        let row = Constants.TETRIMINO_TEMPLATE_SIZE;

        while (row--) {
            for (let col = 0; col < Constants.TETRIMINO_TEMPLATE_SIZE; col++) {
                if (!blocksData[row][col]) {
                    continue;
                }

                let blockPosition = cc.v2(
                    tetriminoPosition.x + col,
                    tetriminoPosition.y + Constants.TETRIMINO_TEMPLATE_SIZE - row - 1
                );
                let outOfBounds =
                    blockPosition.y < 0 ||
                    blockPosition.x < 0 ||
                    blockPosition.x >= Config.GRID_SIZE.width ||
                    blockPosition.y >= Config.GRID_SIZE.height;

                // check is it out of the grid boundary
                if (outOfBounds) {
                    return false;
                }

                // check if is there already a block or not
                let gridBlocksMap = this.mPersistentComponent
                    .getGameController()
                    .getGridBlocksMap();
                let isCollideWithOtherBlock = gridBlocksMap[blockPosition.y][blockPosition.x];

                if (isCollideWithOtherBlock) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * rotate element
     */
    private rotateOnce(): void {
        // Rotated index and template data
        let rotationIndex = (this.mRotationIndex + 1) % this.mTemplateData.length;
        let rotatedBlocksMap: number[][] = this.mTemplateData[rotationIndex];
        let rotatedPaddings = Helper.getTetriPaddings(rotatedBlocksMap);

        let canRotate = false;

        if (this.isTetriminoPositionValid(this.mTetriminoPosition, rotatedBlocksMap)) {
            // There are no other obstacles and boundaries around, and can be rotated directly
            canRotate = true;
        } else {
            // Boundary detection
            var leftLedge = -(this.mTetriminoPosition.x + rotatedPaddings.left);
            var rightLedge =
                this.mTetriminoPosition.x +
                Constants.TETRIMINO_TEMPLATE_SIZE -
                rotatedPaddings.right -
                Config.GRID_SIZE.width;

            var correctToLeftPosition = cc.v2(
                this.mTetriminoPosition.x - rightLedge,
                this.mTetriminoPosition.y
            );
            var correctToRightPosition = cc.v2(
                this.mTetriminoPosition.x + leftLedge,
                this.mTetriminoPosition.y
            );

            if (
                leftLedge > 0 &&
                this.isTetriminoPositionValid(correctToRightPosition, rotatedBlocksMap)
            ) {
                this.setTetriminoPosition(correctToRightPosition);
                canRotate = true;
            } else if (
                rightLedge > 0 &&
                this.isTetriminoPositionValid(correctToLeftPosition, rotatedBlocksMap)
            ) {
                this.setTetriminoPosition(correctToLeftPosition);
                canRotate = true;
            }
        }

        if (canRotate) {
            this.mRotationIndex = rotationIndex;
        }
    }

    private slideRightOnce(): void {
        let newPosition = this.mTetriminoPosition.add(cc.v2(1, 0));

        if (this.isTetriminoPositionValid(newPosition)) {
            this.setTetriminoPosition(newPosition);
        }
    }

    private slideLeftOnce(): void {
        let newPosition = this.mTetriminoPosition.sub(cc.v2(1, 0));

        if (this.isTetriminoPositionValid(newPosition)) {
            this.setTetriminoPosition(newPosition);
        }
    }

    private slideDownOnce(): void {
        if (this.canMoveDown()) {
            this.setTetriminoPosition(this.mTetriminoPosition.sub(cc.v2(0, 1)));
        }
    }

    private canMoveDown(): boolean {
        return this.isTetriminoPositionValid(this.mTetriminoPosition.sub(cc.v2(0, 1)));
    }

    private setSlidingDownAcceleration(isAccelerate: boolean): void {
        this.mAccelerateMovingDown = isAccelerate;
    }

    public changeDirection(dir: MoveDirection): void {
        this.mMooveDirection = dir;
    }

    public cancelDirection(): void {
        // If it is currently in the falling acceleration state, cancel the acceleration
        if (!this.canPerformUserAction && this.mMooveDirection === MoveDirection.Down) {
            this.setSlidingDownAcceleration(false);
        }

        this.mChangeElapsedTime = -1;
        this.mMooveDirection = MoveDirection.None;
    }

    protected update(dt: number): void {
        if (
            !this.movable ||
            this.mPersistentComponent.getGameController().getGameState() !== GameState.Running
        ) {
            return;
        }

        this.updateDirection(dt);
        this.updateMoveDown(dt);
        this.updateAcceleration(dt);

        this.updateTetriminoBlocks();
    }

    private updateDirection(dt: number): void {
        if (!this.canPerformUserAction) {
            return;
        }

        if (
            this.mChangeElapsedTime !== -1 &&
            this.mChangeElapsedTime < this.mChangeActionInterval
        ) {
            this.mChangeElapsedTime += dt;
            return;
        }

        this.mChangeElapsedTime = 0;

        switch (this.mMooveDirection) {
            case MoveDirection.Left:
                this.slideLeftOnce();
                break;

            case MoveDirection.Right:
                this.slideRightOnce();
                break;

            case MoveDirection.Down:
                this.setSlidingDownAcceleration(true);
                break;

            case MoveDirection.Rotate:
                this.rotateOnce();
                break;
        }
    }

    private updateAcceleration(dt: number) {
        if (this.mAccelerateMovingDown) {
            this.slideDownOnce();
        }
    }

    private updateMoveDown(dt: number): void {
        this.mFallElapsedTime += dt;

        if (this.mFallElapsedTime >= this.mMovigDownInterval) {
            this.mFallElapsedTime = 0;

            if (this.canMoveDown()) {
                this.slideDownOnce();
            } else {
                // Has reached the bottom, lock the element and can no longer move
                this.movable = false;
                this.mPersistentComponent.getGameController().addStaticTetriminoBlocks(this);
            }
        }
    }
}
