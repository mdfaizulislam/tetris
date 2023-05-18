/**
 * Title: Play Popup
 * Description: Enter into game from this popup
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:44
 */

import { Constants } from '../../Constants';
import { Helper } from '../../Generic/Helper';
import PersistentComponent from '../PersistentComponent';
import PopupComponent from './PopupComponent';

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayGamePopupComponent extends cc.Component {
    @property(cc.Button)
    buttonPlay: cc.Button = null;

    private mPersistentComponent: PersistentComponent = null;

    protected onLoad(): void {
        this.mPersistentComponent = cc.find('PersistantNode').getComponent(PersistentComponent);
        this.buttonPlay.clickEvents.push(
            Helper.getEventHandler(this.node, 'PlayGamePopupComponent', 'OnPlayPressed')
        );
        this.setPlayButtonInteractibility(false);
    }

    public initialize(): void {
        this.setPlayButtonInteractibility(true);
    }

    OnPlayPressed() {
        this.setPlayButtonInteractibility(false);
        this.mPersistentComponent.node.emit(Constants.EVENTS.PLAY_TETRIS);
        this.getComponent(PopupComponent).hidePopup();
    }

    setPlayButtonInteractibility(isInteractible: boolean): void {
        this.buttonPlay.interactable = isInteractible;
    }
}
