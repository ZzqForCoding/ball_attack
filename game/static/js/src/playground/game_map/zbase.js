class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`)
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        this.ceil_width = height * 0.04;
        this.nx = Math.ceil(width / this.ceil_width);
        this.ny = Math.ceil(height / this.ceil_width);
        this.start();
    }

    start() {
        this.generate_grid();
        this.$canvas.focus();
        this.has_called_start = true;   // 在ac-game-object不再执行start
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(136, 188, 194, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    generate_grid() {
        this.grids = [];
        for(let i = 0; i < this.nx; i++) {
            for(let j = 0; j < this.ny; j++) {
                this.grids.push(new Grid(this.playground, this.ctx, i, j, this.ceil_width, "rgb(222, 237, 225)"));
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
