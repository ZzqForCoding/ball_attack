class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`)
        this.ctx = this.$canvas[0].getContext('2d');
        this.width = this.playground.width;
        this.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

        this.start();
    }

    start() {
        this.generate_grid();
        this.$canvas.focus();
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    generate_grid() {
        let ceil_width = this.height * 0.05;
        let nx = Math.ceil(this.width / ceil_width);
        let ny = Math.ceil(this.height / ceil_width);
        this.grids = [];
        for(let i = 0; i < nx; i++) {
            for(let j = 0; j < ny; j++) {
                this.grids.push(new Grid(this.playground, this.ctx, i, j, ceil_width, "white"));
            }
        }
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(136, 188, 194)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
