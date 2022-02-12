class MoveClickParticle extends AcGameObject {
    constructor(playground, x, y, color) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.color = color;

        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle);
        this.vy = Math.sin(this.angle);

        this.radius = 0.01;
        this.eps = 0.001;
    }

    start() {

    }

    update() {
        if(this.radius < this.eps) {
            this.destroy();
            return false;
        }
        this.radius *= 0.8;
        this.x += this.vx * 1.2 / this.playground.scale;
        this.y += this.vy * 1.2 / this.playground.scale;
        this.render();
    }

    render() {
        let scale = this.playground.scale;

        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
