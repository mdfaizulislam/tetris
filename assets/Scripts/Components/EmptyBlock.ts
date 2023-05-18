/**
 * Title: Empty Block Component
 * Description: It will be used to create tetris grid
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:08
 */

import { Config } from '../Configs/Config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class EmptyBlock extends cc.Component {
    protected onLoad(): void {
        this.node.setContentSize(cc.size(Config.BLOCK_SIZE.width, Config.BLOCK_SIZE.height));
    }
}
