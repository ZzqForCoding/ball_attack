class MiniMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas class="ac-game-mini_map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.background_color = "rgba(0, 0, 0, 0.3)";
        this.player_color = "rgba(255, 0, 0, 0.3)";     // 敌方颜色

        this.players = this.playground.players; // 死了还会画出来吗(赋的是引用还是值)
        this.virtual_map_width = this.virtual_map_height = this.playground.virtual_map_width;

        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    resize() {
        this.ctx.canvas.width = this.playground.height * 0.45;
        this.ctx.canvas.height = this.ctx.canvas.width;

        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;

        // $playground的宽高是包括灰色区域以及游戏界面 - canvas宽高 = 左右的灰色区域 / 2 = 右边的灰色区域 + 距离canvas右下角的距离
        this.margin_right = (this.playground.$playground.width() - this.playground.width) / 2 + this.playground.height * 0.02;
        this.margin_bottom = (this.playground.$playground.height() - this.playground.height) / 2 + this.playground.height * 0.02;

        this.$canvas.css({
            "position": "absolute",
            "right": this.margin_right,
            "bottom": this.margin_bottom
        });
    }

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.clearRect(0, 0, this.width, this.height);  // 清除绘画图形默认涂的黑色
        this.ctx.fillStyle = this.background_color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        for(let i = 0; i < this.players.length; i++) {
            let x = (this.players[i].x - this.playground.cx) / this.virtual_map_width * this.width;
            let y = (this.players[i].y - this.playground.cy) / this.virtual_map_height * this.height;
            if(i == 0) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(x, y, 0.05 * this.width, 0, Math.PI * 2, false);
                this.ctx.stroke();
                this.ctx.clip();
                this.ctx.drawImage(this.players[i].img, (x - (0.05 * this.width)), 0.05 * this.width, 0.05 * this.width * 2, 0.05 * this.width * 2);
                this.ctx.restore();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(x, y, 0.05 * this.width, 0, Math.PI * 2, false);
                this.ctx.fillStyle = this.player_color;
                this.ctx.fill();
            }
        }
    }
}
