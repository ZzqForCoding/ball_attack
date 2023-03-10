class Grid extends AcGameObject {
    constructor(playground, ctx, i, j, ceil_width, color) {
        super();
        this.playground = playground;
        this.ctx = ctx;
        this.x = i;
        this.y = j;
        this.ceil_width = ceil_width;
        this.color = color;
        this.start_x = this.x * this.ceil_width;
        this.start_y = this.y * this.ceil_width;
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.scale = this.playground.scale;

        let ctx_x = this.start_x - this.playground.cx, ctx_y = this.start_y - this.playground.cy;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.ceil_width * 0.05 * this.scale;
        this.ctx.strokeStyle = this.color;
        this.ctx.rect(ctx_x * this.scale, ctx_y * this.scale, this.ceil_width * this.scale, this.ceil_width * this.scale);
        this.ctx.stroke();
        this.ctx.restore();
    }
}
