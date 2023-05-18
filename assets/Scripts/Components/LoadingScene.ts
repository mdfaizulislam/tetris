/**
 * Title: Loading Scene
 * Description: Entry point/scene of tetris game
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:21
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {
    @property(cc.Label)
    private mLabelLoading: cc.Label = null;
    private mIndex: number = 0;
    private mTimerInterval: number = -1;
    protected onLoad(): void {
        this.mTimerInterval = setInterval(this.updateLoadinLabel.bind(this), 0.5);
    }

    protected start() {
        var persistantNode: cc.Node = cc.find('PersistantNode');
        if (!persistantNode) {
            console.error('LoadingComponent persistantNode null');
        }
    }

    private updateLoadinLabel(): void {
        let strings = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
        if (this.mIndex >= strings.length) {
            this.mIndex = 0;
        }
        this.mLabelLoading.string = strings[this.mIndex];
        this.mIndex += 1;
    }

    protected onEnable(): void {
        cc.director.loadScene('gameScene');
    }

    protected onDisable(): void {
        if (this.mTimerInterval != -1) {
            clearInterval(this.mTimerInterval);
        }
    }
}
