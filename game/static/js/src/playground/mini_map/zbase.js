class MiniMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas class="ac-game-mini-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.background_color = "rgba(0, 0, 0, 0.3)";

        this.players = this.playground.players; // 直接赋值: 非对象属性与对象属性都会被原数组的修改所影响
        this.virtual_map_width = this.virtual_map_height = this.playground.virtual_map_width;

        this.mode = this.playground.mode;

        this.playground.$playground.append(this.$canvas);
    }

    start() {
        this.add_listening_events();
    }

    resize() {
        this.ctx.canvas.width = this.playground.height * 0.45;
        this.ctx.canvas.height = this.ctx.canvas.width;

        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        // 大地图转化为小地图的换算关系
        this.rate_width = this.width / this.virtual_map_width;
        this.rate_height = this.height / this.virtual_map_height;

        // $playground的宽高是包括灰色区域以及游戏界面 - canvas宽高 = 左右的灰色区域 / 2 = 右边的灰色区域 + 距离canvas右下角的距离
        this.margin_right = (this.playground.$playground.width() - this.playground.width) / 2 + this.playground.height * 0.02;
        this.margin_bottom = (this.playground.$playground.height() - this.playground.height) / 2 + this.playground.height * 0.02;

        this.$canvas.css({
            "position": "absolute",
            "right": this.margin_right,
            "bottom": this.margin_bottom
        });
    }

    add_listening_events() {
        let outer = this;
        this.$canvas.on("contextmenu", function() {
            return false;
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
            let x = this.players[i].x * this.rate_width;
            let y = this.players[i].y * this.rate_height;
            let r = this.players[i].radius * this.width;     // 玩家小地图上的半径
            if(i === 0 || this.mode === "multi mode") {
                if(this.players[0].character !== "me") continue;    // 如果玩家死了, 就不需要绘制了(bug: 在多人模式中, 当前玩家死了后, 所有玩家都不会在小地图绘制)
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
                this.ctx.stroke();
                this.ctx.clip();
                this.ctx.drawImage(this.players[i].img, (x - r), (y - r), r * 2, r * 2);
                this.ctx.restore();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
                this.ctx.fillStyle = this.players[i].color;
                this.ctx.fill();
            }
        }

        if(this.players[0].character !== "me") return false;    // 如果当前玩家死了, 就不需要绘制视野了
        let px = this.players[0].x, py = this.players[0].y;
        px = Math.max(px, this.playground.width / 2 / scale);
        px = Math.min(px, (this.virtual_map_width - this.playground.width / 2 / scale));
        py = Math.max(py, this.playground.height / 2 / scale);
        py = Math.min(py, (this.virtual_map_height - this.playground.height / 2 / scale));
        // 视野矩形左上角的点
        let tx = (px - this.playground.width / 2 / scale) * this.rate_width;
        let ty = (py - this.playground.height / 2 / scale) * this.rate_height;

        // 视野矩形的宽和高
        let w = this.playground.width / scale * this.rate_width;
        let h = this.playground.height / scale * this.rate_height;
        this.ctx.save();
        this.ctx.strokeStyle = "rgb(247, 232, 200, 0.7)";
        this.ctx.setLineDash([15, 5]);
        this.ctx.lineWidth = Math.ceil(3 * scale / 1080);
        this.ctx.strokeRect(tx, ty, w, h);
        this.ctx.restore();
    }
}
