class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`)
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width * 2;
        this.ctx.canvas.height = this.playground.height * 2;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
        this.$canvas.focus();
        //this.generate_grid();
        this.has_called_start = true;
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    generate_grid() {
        let width = this.playground.width;
        let height = this.playground.height;
        let l = height * 0.1;
        let nx = Math.ceil(width / l);
        let ny = Math.ceil(height / l);
        this.grids = [];
        for(let i = 0; i < nx; i++) {
            for(let j = 0; j < ny; j++) {
                this.grids.push(new Grid(this.ctx, i, j, l, "black"));
            }
        }
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
