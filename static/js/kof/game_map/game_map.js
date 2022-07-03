import { AcGameObject } from '/static/js/kof/ac_game_object/gameobject.js';
import { Controller } from '/static/js/kof/controller/controller.js';

export class GameMap extends AcGameObject {
    constructor(root) {
        super();

        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>')
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        // 让画布处于聚焦状态
        this.$canvas.focus();

        // 按键序列
        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`
<div class="kof-head">
    <div class="kof-head-hp-0"><div><div></div></div></div>
    <div class="kof-head-timer">60</div>
    <div class="kof-head-hp-1"><div><div></div></div></div>
</div>`
        ));

        this.time_left = 60000; // 单位: ms
        this.$timer = this.root.$kof.find('.kof-head-timer');
    }

    start() {

    }

    update() {
        this.time_left -= this.timedelta;
        if (this.time_left < 0) {
            this.time_left = 0;

            let [a, b] = this.root.players;
            if(a.status !== 6 && b.status !== 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        }

        this.$timer.text(parseInt(this.time_left / 1000));

        this.render();
    }

    render() {
        // 清楚画布上一帧渲染的图片
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
