class MiniMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas class="ac-game-mini_map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.background_color = "rgba(0, 0, 0, 0.3)";

        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    resize() {
        this.ctx.canvas.width = this.playground.height * 0.35;
        this.ctx.canvas.height = this.ctx.canvas.width;

        this.start_x = this.playground.width - this.ctx.canvas.width;
        this.start_y = this.playground.height - this.ctx.canvas.height;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;

        // 要转化成距离整个页面的右边距
        this.margin_right = (this.playground.$playground.width() - this.playground.width) / 2;
        this.margin_bottom = (this.playground.$playground.height() - this.playground.height) / 2;

        this.$canvas.css({
            "position": "absolute",
            "margin-left": 0,
            "margin-top": 0
        });
    }

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        //this.ctx.clearRect(0, 0, this.width, this.height);

        this.fillStyle = "rgba(255, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}
