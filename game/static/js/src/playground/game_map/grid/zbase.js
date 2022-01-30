class Grid extends AcGameObject {
    constructor(ctx, x, y, l, stroke_color) {
        super();
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.l = l;
        this.stroke_color = stroke_color;
        this.fill_color = "rgb(210, 222, 238)";
        this.ax = this.x * this.l;
        this.ay = this.y * this.l;
    }

    start() {

    }

    update() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.3;
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.rect(this.ax, this.ay, this.l, this.l);
        this.ctx.stroke();
        this.ctx.restore();
    }
}
