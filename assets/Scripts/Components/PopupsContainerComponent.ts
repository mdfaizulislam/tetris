/**
 * Title: Popups Container
 * Description: It contains all popup references
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:46
 */

import PopupComponent from './popups/PopupComponent';

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupsContainerComponent extends cc.Component {
    @property(PopupComponent)
    private mPopupPlayGame: PopupComponent = null;

    @property(PopupComponent)
    private mPopupGameOver: PopupComponent = null;

    public getPlayGamePopupComponent(): PopupComponent {
        return this.mPopupPlayGame;
    }

    public getGameOverPopupComponent(): PopupComponent {
        return this.mPopupGameOver;
    }
}
