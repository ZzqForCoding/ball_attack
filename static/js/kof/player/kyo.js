import { Player } from '/static/js/kof/player/player.js';
import { GIF } from '/static/js/kof/utils/gif.js';

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {
        let outer = this;
        // 每一个动画的竖直偏移量
        let offsets = [0, -22, -22, -140, 0, 0, 0, 0, -180];
        for (let i = 0; i < 9; i++) {
            let gif = GIF();
            gif.load(`/static/image/kof/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,   // 总帧数
                frame_rate: 5,  // 每5帧过度一次
                offset_y: offsets[i],    // y方向偏移量
                loaded: false,  // 是否加载完成
                scale: 2,       // 放大多少倍
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                // 跳跃状态的渲染速率特殊调整一下
                if(i === 3) {
                    obj.frame_rate = 4;
                } else if(i === 7) {
                    obj.frame_rate = 7;
                }
            }
        }
    }
}
