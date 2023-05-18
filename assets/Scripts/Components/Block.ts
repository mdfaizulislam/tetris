/**
 * Title: Block Component
 * Description: It is the basic block element of Tetrimino Component
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:10
 */

import { Config } from '../Configs/Config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Block extends cc.Component {
    @property([cc.SpriteFrame])
    blockSpriteFrames: cc.SpriteFrame[] = [];
    protected onLoad(): void {
        this.node.setContentSize(cc.size(Config.BLOCK_SIZE.width, Config.BLOCK_SIZE.height));
    }

    /**
     * update block sprite accoding to index, index = 0 to total color sprite available -1
     * @param spriteFrameIndex
     * @returns
     */
    public setSpriteFrame(spriteFrameIndex: number) {
        spriteFrameIndex -= 1;
        if (spriteFrameIndex < 0 || spriteFrameIndex >= this.blockSpriteFrames.length) {
            console.warn('spriteFrameIndex is not valid');
            return;
        }
        this.getComponent(cc.Sprite).spriteFrame = this.blockSpriteFrames[spriteFrameIndex];
    }
}
