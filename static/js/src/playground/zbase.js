class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.game_mode = 0;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green", "purple"];
        return colors[Math.floor(Math.random() * 6)];
    }

    create_uuid() {
        let res = "";
        for(let i = 0; i < 8; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));  // 返回[0, 1)之间的数
            res += x;
        }
        return res;
    }

    start() {
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on('resize.${uuid}', function() {
            outer.resize();
        });

        if(this.root.AcWingOS) {
            this.root.AcWingOS.api.window.on_close(function() {
                $(window).off('resize.${uuid}');
            });
        }
    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if(this.game_map) this.game_map.resize();
        if(this.chat_field) this.chat_field.resize();
    }

    re_calculate_cx_cy(x, y) {
        // 玩家所看到的窗口的左上角坐标
        this.cx = x - 0.5 * this.width / this.scale;
        this.cy = y - 0.5 * this.height / this.scale;

        let cw = this.game_map.ceil_width;

        // 如果靠近左或上边界
        this.cx = Math.max(this.cx, -cw);
        this.cy = Math.max(this.cy, -cw);
        // 如果靠近右或下边界
        this.cx = Math.min(this.cx, this.virtual_map_width + cw - (this.width / this.scale));
        this.cy = Math.min(this.cy, this.virtual_map_height + cw - (this.height / this.scale));
    }

    show(mode) {    // 打开playground界面
        let outer = this;
        this.$playground.show();
        this.width = this.$playground.width();
        this.height = this.$playground.height();

        // 25个格子, 每个格子的宽度是3 * 0.05 = 0.15, 20 * 0.15 = 3
        this.virtual_map_width = this.virtual_map_height = 3;

        this.mode = mode;
        this.state = "waiting";     // waiting -> fighting -> over

        this.game_map = new GameMap(this);

        this.notice_board = new NoticeBoard(this);

        this.score_board = new ScoreBoard(this);

        this.player_count = 0;

        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.virtual_map_width / 2, this.virtual_map_height / 2, 0.05, "white", 0.175, "me", this.root.settings.username, this.root.settings.photo));
        this.re_calculate_cx_cy(this.players[0].x, this.players[0].y);

        if(mode === "single mode") {
            let len = 0, speed = 0.15;
            /**
             * 3:     .
             *      .   .
             *
             * 4:   .   .
             *      .   .
             *
             * 5:   . . .
             *      .   .
             */
            let a = this.players[0].x, b = this.players[0].y;
            let dist = 0.4;
            this.pos = null;
            if(this.game_mode == 0) len = 3, this.pos = [[0, -dist], [-dist, dist], [dist, dist]];
            else if(this.game_mode == 1) len = 4, speed = 0.2, this.pos = [[-dist, -dist], [dist, -dist], [-dist, dist], [dist, dist]];
            else if(this.game_mode == 2) len = 5, speed = 0.2, this.pos = [[-dist, -dist], [0, -dist], [dist, -dist], [-dist, dist], [dist, dist]];
            else len = 5, this.pos = [[-dist, -dist], [0, -dist], [dist, -dist], [-dist, dist], [dist, dist]];
            for(let i = 0; i < len; i++) {
                let tx = a + this.pos[i][0], ty = b + this.pos[i][1];
                this.players.push(new Player(this, tx, ty, 0.05, this.get_random_color(), speed, "robot"));
            }
        } else if(mode === "multi mode") {
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }

    }

    hide() {    // 关闭playground界面
        while(this.players && this.players.length > 0) {
            this.players[0].destroy();
        }

        if(this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }

        if(this.notice_board) {
            this.notice_board.destroy();
            this.notice_board = null;
        }

        if(this.score_board) {
            this.score_board.destroy();
            this.score_board = null;
        }

        this.$playground.empty();

        this.$playground.hide();
    }
}
