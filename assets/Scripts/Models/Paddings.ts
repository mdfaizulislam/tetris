/**
 * Title: Padding Model
 * Description: Custom Class for representing offsets of tetrimino pattern
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:22
 */

export class Paddings {
    top: number;
    right: number;
    left: number;

    public static create(): Paddings {
        return new Paddings();
    }

    constructor() {
        this.left = 0;
        this.right = 0;
        this.top = 0;
    }
}
