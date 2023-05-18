/**
 * Title: Popup Component
 * Description: It is the common components of all popups, responsible for show and hide popup.
 * Will be adding more items here according to requirements which will be common among all popups.
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:41
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupComponent extends cc.Component {
    @property(cc.Node)
    contents: cc.Node = null;

    @property(cc.Node)
    overlay: cc.Node = null;

    protected onLoad() {
        if (this.overlay) {
            this.overlay.on(cc.Node.EventType.TOUCH_START, function () {});
        }
    }

    public showPopup() {
        this.node.active = true;
    }

    public hidePopup() {
        this.node.active = false;
    }
}
