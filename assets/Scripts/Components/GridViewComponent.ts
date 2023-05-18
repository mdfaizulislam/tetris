/**
 * Title: Grid View Component
 * Description: It is used to create tetris grid and next tetrimino holder
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:15
 */

import { Config } from '../Configs/Config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GridViewComponent extends cc.Component {
    @property(cc.Prefab)
    private mEmptyBlockPrefab: cc.Prefab = null;

    private mGridSize: cc.Size = null;

    public initialize(size: cc.Size): void {
        this.mGridSize = size;

        this.node.setContentSize(
            Config.BLOCK_SIZE.width * this.mGridSize.width,
            Config.BLOCK_SIZE.height * this.mGridSize.height
        );
        this.node.setAnchorPoint(cc.v2(0, 0));

        this.addEmptyBlocks();
    }

    private addEmptyBlocks(): void {
        for (let row = 0; row < this.mGridSize.width; row += 1) {
            for (let col = 0; col < this.mGridSize.height; col += 1) {
                let emptyBlock = cc.instantiate(this.mEmptyBlockPrefab);
                // emptyBlock.setContentSize(
                //     cc.size(Config.BLOCK_SIZE.width, Config.BLOCK_SIZE.height)
                // );
                emptyBlock.setPosition(
                    cc.v2(row * Config.BLOCK_SIZE.width, col * Config.BLOCK_SIZE.height)
                );
                this.node.addChild(emptyBlock);
            }
        }
    }

    // update (dt) {}
}
