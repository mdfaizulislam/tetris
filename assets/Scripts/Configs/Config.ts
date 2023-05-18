/**
 * Title: Configs
 * Description: Configs for tetris game
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:25
 */

export class Config {
    public static scorePerRow: number = 10;
    public static GRID_SIZE: cc.Size = cc.size(10, 22);
    public static BLOCK_SIZE: cc.Size = cc.size(30, 30);
    public static BLOCK_MOVING_INTERVAL: number = 0.5;
    public static BLOCK_ACTOION_CHANGE_INTERVAL: number = 0.1;
}
