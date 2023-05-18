/**
 * Title: Persistent Component
 * Description: Persistent Component of entire game
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:39
 */

import GameController from '../Controllers/GameController';
import GameScene from './GameScene';
import { Player } from '../Models/Player';

const { ccclass, property } = cc._decorator;

@ccclass
export default class PersistentComponent extends cc.Component {
    private mGameScene: GameScene;
    private mPlayer: Player;
    private mGameController: GameController = null;
    protected onLoad(): void {
        cc.game.addPersistRootNode(this.node);
        this.mPlayer = Player.create();
        this.mGameController = GameController.create();
        this.mGameController.setPersistentComponent(this);
    }

    getGameController(): GameController {
        return this.mGameController;
    }

    setGameScene(gameScene: GameScene): void {
        this.mGameScene = gameScene;
    }

    getGameScene(): GameScene {
        return this.mGameScene;
    }

    getPlayer(): Player {
        return this.mPlayer;
    }
}
