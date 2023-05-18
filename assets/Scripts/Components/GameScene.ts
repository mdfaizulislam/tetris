/**
 * Title: Game Scene Component
 * Description: It contains all game components including block, tetrimino, grid viewer,
 * event handlers(button, keyboard, and node), popups etc.
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 14:07
 */

import Block from './Block';
import GridViewComponent from './/GridViewComponent';
import PopupsContainerComponent from './PopupsContainerComponent';
import ScoreHudComponent from './ScoreHudComponent';
import GameOverPopupComponent from './popups/GameOverPopupComponent';
import PlayGamePopupComponent from './popups/PlayGamePopupComponent';
import { Config } from '../Configs/Config';
import { Constants, MoveDirection, GameState } from '../Constants';
import { Helper } from '../Generic/Helper';
import { Logger } from '../Generic/Logger';
import { Player } from '../Models/Player';
import PersistentComponent from './PersistentComponent';
import Tetrimino from './Tetrimino';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {
    @property(ScoreHudComponent)
    private mScoreHudComponent: ScoreHudComponent = null;
    @property(PopupsContainerComponent)
    private mPopupsContainer: PopupsContainerComponent = null;
    @property(cc.Node)
    private mGameComponentsHolder: cc.Node = null;
    @property(cc.Node)
    private mButtonRotate: cc.Node = null;
    @property(cc.Node)
    private mButtonAccelerate: cc.Node = null;
    @property(cc.Node)
    private mButtonLeft: cc.Node = null;
    @property(cc.Node)
    private mButtonRight: cc.Node = null;
    @property(cc.Prefab)
    private mTetriminoPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    private mGridViewPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    private mBlockPrefab: cc.Prefab = null;

    private mPersistentComponent: PersistentComponent = null;
    private mGameOver: boolean = false;
    private mNextTetrimino: cc.Node = null;
    private mPlayer: Player = null;
    private mLogger: Logger = null;
    private mNextTetriminoHolder: cc.Node = null;
    private mEmptyGrid: cc.Node = null;
    private mBlocksHolder: cc.Node = null;
    private mTetriMovingLayer: cc.Node = null;
    private mVisibilityChangeCallback: (event: {}) => void;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.mPersistentComponent = cc.find('PersistantNode').getComponent(PersistentComponent);
        this.mLogger = Logger.create('GameScene', false);
        this.mPersistentComponent.setGameScene(this);
        this.mPlayer = this.mPersistentComponent.getPlayer();
        this.mGameOver = false;

        this.addKeyEventHandlers();
        this.addButtonTouchEventHandlers();
        this.addPersistentNodeEventHandlers();

        this.mVisibilityChangeCallback = this.onVisibilityChange.bind(this);
        document.addEventListener('visibilitychange', this.mVisibilityChangeCallback);
    }

    onDestroy() {
        this.removeKeyEventHandlers();
        this.removeButtonTouchEventHandlers();
        this.removePersistentNodeEventHandlers();
        document.removeEventListener('visibilitychange', this.mVisibilityChangeCallback);
    }

    protected onEnable(): void {
        this.addGameEmptyGrid();
        this.addNextTetriminoViewer();
        this.addBlocksHolder();
        this.addTetriMovingLayer();
        this.mPopupsContainer.getPlayGamePopupComponent().showPopup();
        this.mPopupsContainer
            .getPlayGamePopupComponent()
            .getComponent(PlayGamePopupComponent)
            .initialize();
    }

    start() {
        this.mScoreHudComponent.updateScoreHudInfos();
    }

    private addGameEmptyGrid(): void {
        this.mEmptyGrid = cc.instantiate(this.mGridViewPrefab);
        this.mEmptyGrid.getComponent(GridViewComponent).initialize(Config.GRID_SIZE);
        let posX = -this.mEmptyGrid.width / 2 - (cc.winSize.width / 2 - this.mEmptyGrid.width / 2);
        let posY =
            -this.mEmptyGrid.height / 2 - -(cc.winSize.height / 2 - this.mEmptyGrid.height / 2);
        this.mEmptyGrid.setPosition(posX, posY);
        this.mGameComponentsHolder.addChild(this.mEmptyGrid, 1);
        this.mLogger.Log('x: ' + posX + ' y: ' + posY);
    }

    private addNextTetriminoViewer(): void {
        this.mNextTetriminoHolder = cc.instantiate(this.mGridViewPrefab);
        this.mNextTetriminoHolder
            .getComponent(GridViewComponent)
            .initialize(
                cc.size(Constants.TETRIMINO_TEMPLATE_SIZE, Constants.TETRIMINO_TEMPLATE_SIZE)
            );
        let gridPosition = this.mEmptyGrid.position;
        let middle = cc.winSize.width - this.mEmptyGrid.width;
        let viewerPosition = cc.v2(
            gridPosition.x +
                this.mEmptyGrid.width +
                middle / 2 -
                this.mNextTetriminoHolder.width / 2,
            gridPosition.y
        );
        this.mNextTetriminoHolder.setPosition(viewerPosition);
        this.mGameComponentsHolder.addChild(this.mNextTetriminoHolder, 2);
        this.mLogger.Log('viwer x: ' + viewerPosition.x + ' y: ' + viewerPosition.y);
    }

    private addBlocksHolder(): void {
        this.mBlocksHolder = new cc.Node('BlocksHolder');
        this.mBlocksHolder.setAnchorPoint(cc.v2(0, 0));
        this.mBlocksHolder.setContentSize(this.mEmptyGrid.getContentSize());
        this.mBlocksHolder.setPosition(this.mEmptyGrid.getPosition());
        this.mGameComponentsHolder.addChild(this.mBlocksHolder, 3);
    }

    private startGame(): void {
        this.mGameOver = false;
        this.mPopupsContainer.getGameOverPopupComponent().hidePopup();
        this.mPlayer.reset();
        this.mPersistentComponent.getGameController().gameStart();
    }

    private addTetriMovingLayer(): void {
        this.mTetriMovingLayer = new cc.Node('BlocksHolder');
        this.mTetriMovingLayer.setAnchorPoint(cc.v2(0, 0));
        this.mTetriMovingLayer.setContentSize(this.mEmptyGrid.getContentSize());
        this.mTetriMovingLayer.setPosition(this.mEmptyGrid.getPosition());
        this.mGameComponentsHolder.addChild(this.mTetriMovingLayer, 4);
    }

    public removeAllBlocksFromBlockHolder(): void {
        this.mBlocksHolder.removeAllChildren();
    }

    public addBlockToBlocksHolder(position: cc.Vec2, colorIndex: number): void {
        let block = cc.instantiate(this.mBlockPrefab);
        block.setPosition(position);
        block.getComponent(Block).setSpriteFrame(colorIndex);
        this.mBlocksHolder.addChild(block, 1);
    }

    public generateUpcomingTetrimino(): Tetrimino {
        if (this.mNextTetrimino) {
            this.mNextTetrimino.destroy();
            this.mNextTetrimino.removeFromParent();
            this.mNextTetrimino = null;
        }

        let spriteFrameIndex = Helper.getNextColorIndex() + 1;

        let tetrimino = cc.instantiate(this.mTetriminoPrefab);
        let tetriComponent = tetrimino.getComponent(Tetrimino);
        tetriComponent.setTetriminoColorIndex(spriteFrameIndex);
        tetriComponent.movable = false;

        this.mNextTetriminoHolder.addChild(tetrimino);
        this.mNextTetrimino = tetrimino;

        return tetriComponent;
    }

    public addMovingTerimino(component: Tetrimino): Tetrimino {
        let newTetrimino = cc.instantiate(this.mTetriminoPrefab);
        let tetriminoComponent = newTetrimino.getComponent(Tetrimino);
        tetriminoComponent.initializeWithTetrimino(component);
        this.mTetriMovingLayer.addChild(newTetrimino);
        return tetriminoComponent;
    }

    public onRowClearComplete(rowClearedCount: number): void {
        this.mPlayer.setRowClearedCount(this.mPlayer.getRowClearedCount() + rowClearedCount);
        this.mScoreHudComponent.updateScoreHudInfos();
    }

    public gameOver() {
        this.mGameOver = true;
        this.mPopupsContainer.getGameOverPopupComponent().showPopup();
        this.mPopupsContainer
            .getGameOverPopupComponent()
            .getComponent(GameOverPopupComponent)
            .initialize();
    }

    private onVisibilityChange() {
        let visibleStatus = !document.hidden;
        this.mLogger.Warn('game visibility: ' + (visibleStatus ? 'visible' : 'not visible'));
        let gameController = this.mPersistentComponent.getGameController();
        let oldState = gameController.getGameState();
        if (!this.mGameOver && (oldState == GameState.Running || oldState == GameState.Paused)) {
            let newState = visibleStatus ? GameState.Running : GameState.Paused;
            gameController.setGameState(newState);
        }
    }

    private addKeyEventHandlers() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private removeKeyEventHandlers() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private addButtonTouchEventHandlers() {
        this.mButtonRotate.on(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);
        this.mButtonAccelerate.on(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);
        this.mButtonLeft.on(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);
        this.mButtonRight.on(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);

        this.mButtonRotate.on(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
        this.mButtonAccelerate.on(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
        this.mButtonLeft.on(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
        this.mButtonRight.on(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
    }

    private removeButtonTouchEventHandlers() {
        this.mButtonRotate.off(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);
        this.mButtonAccelerate.off(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);
        this.mButtonLeft.off(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);
        this.mButtonRight.off(cc.Node.EventType.TOUCH_START, this.onButtonTouchBegan, this);

        this.mButtonRotate.off(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
        this.mButtonAccelerate.off(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
        this.mButtonLeft.off(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
        this.mButtonRight.off(cc.Node.EventType.TOUCH_END, this.onButtonTouchEnd, this);
    }

    addPersistentNodeEventHandlers() {
        this.mPersistentComponent.node.on(Constants.EVENTS.PLAY_TETRIS, this.startGame, this);
    }

    removePersistentNodeEventHandlers() {
        this.mPersistentComponent.node.off(Constants.EVENTS.PLAY_TETRIS, this.startGame, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (this.mPersistentComponent.getGameController().getGameState() !== GameState.Running) {
            return;
        }

        switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.mPersistentComponent
                    .getGameController()
                    .onDirectionChange(MoveDirection.Rotate);
                break;

            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.mPersistentComponent.getGameController().onDirectionChange(MoveDirection.Down);
                break;

            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.mPersistentComponent.getGameController().onDirectionChange(MoveDirection.Left);
                break;

            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.mPersistentComponent
                    .getGameController()
                    .onDirectionChange(MoveDirection.Right);
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (this.mPersistentComponent.getGameController().getGameState() !== GameState.Running) {
            return;
        }

        switch (event.keyCode) {
            default:
                // Other keys are unified to cancel the movement direction
                this.mPersistentComponent.getGameController().onDirectionCancel();
                break;
        }
    }

    onButtonTouchBegan(event: cc.Event.EventTouch) {
        if (this.mGameOver) {
            return;
        }

        let direction = MoveDirection.None;

        if (this.mButtonRotate === event.target) {
            direction = MoveDirection.Rotate;
        } else if (this.mButtonAccelerate === event.target) {
            direction = MoveDirection.Down;
        } else if (this.mButtonLeft === event.target) {
            direction = MoveDirection.Left;
        } else if (this.mButtonRight === event.target) {
            direction = MoveDirection.Right;
        }

        if (direction !== MoveDirection.None) {
            this.mPersistentComponent.getGameController().onDirectionChange(direction);
        }
    }

    onButtonTouchEnd(event: cc.Event.EventTouch) {
        if (this.mGameOver) {
            return;
        }

        this.mPersistentComponent.getGameController().onDirectionCancel();
    }
}
