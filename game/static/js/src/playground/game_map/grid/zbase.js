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
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.ceil_width * 0.05;
        this.ctx.strokeStyle = this.color;
        this.ctx.rect(this.start_x, this.start_y, this.ceil_width, this.ceil_width);
        this.ctx.stroke();
        this.ctx.restore();
    }
}
