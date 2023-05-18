/**
 * Title: Game Over popup
 * Description: Game Over popup. Player can play again from this popup as well.
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:45
 */

import { Config } from '../../Configs/Config';
import { Constants } from '../../Constants';
import { Helper } from '../../Generic/Helper';
import PersistentComponent from '../PersistentComponent';
import PopupComponent from './PopupComponent';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverPopupComponent extends cc.Component {
    @property(cc.Label)
    labelHighScore: cc.Label = null;

    @property(cc.Label)
    labelCurrentScore: cc.Label = null;

    @property(cc.Button)
    buttonPlayAgain: cc.Button = null;

    private mPersistentComponent: PersistentComponent = null;

    protected onLoad(): void {
        this.mPersistentComponent = cc.find('PersistantNode').getComponent(PersistentComponent);
        this.buttonPlayAgain.clickEvents.push(
            Helper.getEventHandler(this.node, 'GameOverPopupComponent', 'OnPlayAgainPressed')
        );
        this.setPlayButtonInteractibility(false);
    }

    public initialize(): void {
        let player = this.mPersistentComponent.getPlayer();
        this.labelHighScore.string = player.getHighScore() + '';
        this.labelCurrentScore.string = player.getRowClearedCount() * Config.scorePerRow + '';
        this.setPlayButtonInteractibility(true);
    }

    OnPlayAgainPressed() {
        console.log('OnPlayAgainPressed');
        this.setPlayButtonInteractibility(false);
        this.mPersistentComponent.node.emit(Constants.EVENTS.PLAY_TETRIS);
        this.getComponent(PopupComponent).hidePopup();
    }

    setPlayButtonInteractibility(isInteractible: boolean): void {
        this.buttonPlayAgain.interactable = isInteractible;
    }
}
