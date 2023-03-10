class AcGameChooseMode {
    constructor(root) {
        this.root = root;
        this.$choose_mode = $(`
<div class="ac-game-choose-mode">
    <div class="ac-game-choose-mode-return ac-game-return">
        返回
    </div>
    <div class="ac-game-choose-mode-desc">
    </div>
    <div class="ac-game-choose-mode-item">
        <div class="ac-game-choose-mode-item">
            <div class="ac-game-choose-mode-item-name"></div>
        </div>
        <br>
        <div class="ac-game-choose-mode-item">
            <div class="ac-game-choose-mode-item-name"></div>
        </div>
        <br>
        <div class="ac-game-choose-mode-item">
            <div class="ac-game-choose-mode-item-name"></div>
        </div>
        <br>
        <div class="ac-game-choose-mode-item">
             <div class="ac-game-choose-mode-item-name"></div>
        </div>
    </div>
</div>
        `);
        this.$choose_mode.hide();
        this.root.$ac_game.append(this.$choose_mode);

        this.mode_item_name = ["入门", "普通", "困难", "炼狱"];
        // 后面补充
        this.mode_item_desc = [
            "由3个AI构成, 并会无区分的攻击玩家或其他AI, 攻击速度慢、攻击精度适中, 攻击距离低, 移动速度低。",
            "由4个AI构成, 并会无区分的攻击玩家或其他AI, 攻击速度适中, 攻击精度适中, 攻击距离适中, 移动速度适中。",
            "由5个AI构成, 并会大概率攻击玩家, 攻击速度适中, 攻击精度高, 攻击距离适中, 移动速度适中!",
            "由5个AI构成, 并会大概率攻击玩家, 攻击速度高, 攻击精度高, 攻击距离高, 移动速度高!!!"
        ];

        this.$return = this.$choose_mode.find('.ac-game-choose-mode-return');
        this.$desc = this.$choose_mode.find('ac-game-choose-mode-desc');
        this.$mode_name = this.$choose_mode.find('.ac-game-choose-mode-item-name');
        let outer = this;
        this.$mode_name.each(function(i) {
            $(this).text(outer.mode_item_name[i]);
        });

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$return.click(() => {
            this.hide();
            this.root.menu.show();
        });
        this.$mode_name.each(function(i) {
            $(this).click(() => {
                outer.root.playground.game_mode = i;
                outer.root.playground.show("single mode");
                outer.hide();
            });
        });
    }

    show() {
        this.$choose_mode.show();
    }

    hide() {
        this.$choose_mode.hide();
    }
}
class AcGameRank {
    constructor(root) {
        this.root = root;
        this.$rank = $(`
<div class="ac-game-rank">
    <div class="ac-game-rank-return ac-game-return">
        返回
    </div>
    <div class="ac-game-rank-table">
        <div class="ac-game-rank-table-button">
            <button type="button" class="btn btn-outline-secondary ac-game-rank-table-button-score">多人模式积分滚动条排行榜(每五分钟并点击排行榜重新加载数据)</button>
            <button type="button" class="btn btn-outline-secondary ac-game-rank-table-button-time">多人模式积分分页排行榜</button>
        </div>
        <div class="ac-game-rank-tables">
            <table class="table table-bordered table-hover ac-game-rank-table-score">
                <thead class="ac-game-rank-table-score-thead">
                    <tr>
                        <th>排名</th>
                        <th>游戏ID</th>
                        <th>积分</th>
                    </tr>
                </thead>
                <tbody class="ac-game-rank-table-score-tbody"></tbody>
            </table>
            <table class="table table-bordered table-hover ac-game-rank-table-time">
                <thead class="ac-game-rank-table-time-thead">
                    <tr>
                        <th>排名</th>
                        <th>游戏ID</th>
                        <th>生存时间</th>
                    </tr>
                </thead>
                <tbody class="ac-game-rank-table-time-tbody"></tbody>
            </table>
            <nav aria-label="Page navigation" class="ac-game-rank-table-time-page">
                <ul class="pagination">
                </ul>
            </nav>
        </div>
    </div>
</div>
        `);
        this.$rank.hide();
        this.root.$ac_game.append(this.$rank);
        this.$return = this.$rank.find('.ac-game-rank-return');

        this.$score_btn = this.$rank.find('.ac-game-rank-table-button-score');
        this.$score_table = this.$rank.find('.ac-game-rank-table-score');
        this.$score_table_content = this.$rank.find('.ac-game-rank-table-score-tbody');

        this.$time_btn = this.$rank.find('.ac-game-rank-table-button-time');
        this.$time_table = this.$rank.find('.ac-game-rank-table-time');
        this.$time_table_page = this.$rank.find('.ac-game-rank-table-time-page');
        this.$time_table_content = this.$rank.find('.ac-game-rank-table-time-tbody');

        this.$pagination = this.$rank.find('.pagination');
        this.page_num = 1;      // 当前处于的页号
        this.total_page = 0;    // 总页号
        this.show_page = 3;     // 显示的页码为三个
        this.generic_page();    // 生成所有页码

        this.$time_table_page_btn = this.$rank.find('.ac-game-rank-table-time-page-num');
        this.$time_table_page_pre = this.$rank.find('.ac-game-rank-table-time-page-pre');
        this.$time_table_page_next = this.$rank.find('.ac-game-rank-table-time-page-next');

        this.start();

        this.score_player = null;
        this.score_player_time = null;
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        this.$return.click(() => {
            this.hide();
            this.root.menu.show();
        });

        // 待优化: 两个按钮为一组，多次按同一个不要发请求
        // 表格高度随着视口变化
        // 分页条固定在那, 页码跳转要有颜色
        // 可以点一个按钮跳到自己所在页面与位置
        // 生存时间排行榜
        this.$score_btn.click(() => {
            this.$score_table.show();
            this.$time_table.hide();
            this.$time_table_page.hide();
        });

        this.$time_btn.click(() => {
            this.$score_table.hide();
            this.$time_table.show();
            this.$time_table_page.show();
            this.getinfo_rank_time();
        });
        let outer = this;
        $.each(this.$time_table_page_btn, function() {
            $(this).click(() => {
                outer.page_num = parseInt($(this).text());
                outer.getinfo_rank_time();
            });
        });

        this.$time_table_page_pre.click(() => {
            this.page_num = this.page_num - 1;
            if(this.page_num === 0) this.page_num = this.total_page;
            this.getinfo_rank_time();
        });

        this.$time_table_page_next.click(() => {
            this.page_num = this.page_num + 1;
            if(this.page_num == this.total_page + 1) this.page_num = 1;
            this.getinfo_rank_time();
        });
    }

    generic_page() {
        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-pre\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>");

        for(let i = 1; i <= this.show_page; i++) {
            this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-num\">" + i + "</a></li>");
        }

        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-next\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>");
    }

    modify_page() {
        // 将this.page_num始终保持在中间, 若this.page_num为3, this.show_page为3则2 3 4, this.show_page为4则2 3 4 5
        let start = null, end = null;
        if(this.page_num < this.show_page) start = 1, end = this.show_page;
        else if(this.page_num > this.total_page - this.show_page) start = this.total_page - this.show_page + 1, end = this.total_page;
        else {
            start = this.page_num - this.show_page / 2; // 5 - 3 / 2 ~ 5 + 3 / 2 => 4 5 6, 5 - 4 / 2 ~ 5 + 4 / 2 => 3 4 5 6 7
            end = this.page_num + (this.show_page % 2 == 0 ? this.show_page / 2 - 1 : this.show_page / 2);
        }
        start = Math.ceil(start);
        $.each(this.$time_table_page_btn, function(i) {
            $(this).text(start + i);
        });
    }

    getinfo_rank_score() {
        if(this.score_player && this.score_player_time && new Date().getTime() - this.score_player_time.getTime() <= 5 * 60 * 1000) return;
        this.$score_table_content.empty();
        $.ajax({
            url: "https://game.zzqahm.top:20002/menu/rank/getplayers/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: resp => {
                if(resp.result === "success") {
                    this.score_player = resp.players;
                    this.score_player_time = new Date();
                    for(let i = 0; i < this.score_player.length; i++) {
                        let player = this.score_player[i];
                        let obj = "<tr><td>" + player.rank  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        this.$score_table_content.append(obj);
                    }
                }
            }
        });
    }

    getinfo_rank_time() {
        this.$time_table_content.empty();
        this.get_page();        // 查询总页号
        this.modify_page();    // 修改页码

        $.ajax({
            url: "https://game.zzqahm.top:20002/menu/rank/getplayers/" + this.page_num + "/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: resp => {
                if(resp.result === "success") {
                    let players = resp.players;
                    for(let i = 0; i < players.length; i++) {
                        let player = players[i];
                        let obj = "<tr><td>" + ((this.page_num - 1) * 10 + i + 1)  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        this.$time_table_content.append(obj);
                    }
                }
            }
        });
    }

    get_page() {
        $.ajax({
            url: "https://game.zzqahm.top:20002/menu/rank/getpage/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            async: false,       // 若不加这行赋值在退出方法后无效
            success: resp => {
                if(resp.result === "success") {
                    this.total_page = resp.page_count;
                }
            }
        });
    }

    show() {
        this.getinfo_rank_score();
        this.$rank.show();
        this.$score_btn.click();
    }

    hide() {
        this.$rank.hide();
    }
}
class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <audio src="" class="ac-game-background-music" loop="loop">
    </audio>
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-man-machine-mode">
            人机模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-rank">
            排行榜
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出
        </div>
    </div>
</div>
`);

        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-man-machine-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$rank = this.$menu.find(".ac-game-menu-field-item-rank");
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.$audio= document.getElementsByClassName('ac-game-background-music')[0];
        this.musics = ["https://game.zzqahm.top:20002/static/audio/BygoneBumps.mp3",
                       "https://game.zzqahm.top:20002/static/audio/MonsieurMelody.mp3",
                       "https://game.zzqahm.top:20002/static/audio/SunnyJim.mp3",
                       "https://game.zzqahm.top:20002/static/audio/qiuqiu.mp3",
                       "https://game.zzqahm.top:20002/static/audio/AudioHighs.mp3",
                       "https://game.zzqahm.top:20002/static/audio/BianTaiRuNiu.mp3",
                       "https://game.zzqahm.top:20002/static/audio/ChuLianXianDingBgm.mp3",
                       "https://game.zzqahm.top:20002/static/audio/DuoLaAMeng.mp3"];
        this.$audio.volume = 0.5;

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        this.$single_mode.click(() => {
            this.hide();
            this.root.choose_mode.show();
            this.playMusic();
        });
        this.$multi_mode.click(() => {
            this.hide();
            this.root.playground.show("multi mode");
            this.playMusic();
        });
        this.$rank.click(() => {
            this.hide();
            this.root.rank.show();
        });
        this.$settings.click(() => {
            this.root.settings.logout_on_remote();
        });
    }

    // 必须在点击过后才能播放音乐
    playMusic() {
        // 一个页面若有多个acapp开启, 则会播放多个音乐, 这不太好
        if($('.ac-game-background-music').length > 1) return false;
        this.random_music_idx = Math.floor(Math.random() * this.musics.length);
        $('.ac-game-background-music').attr('src', this.musics[this.random_music_idx]);
        $('.ac-game-background-music').get(0).play();
    }

    pauseMusic() {
        $('.ac-game-background-music').get(0).pause();
    }

    show() {    // 显示menu界面
        this.$menu.show();
    }

    hide() {    // 隐藏menu界面
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;             // 当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid();
    }

    create_uuid() {
        let res = "";
        for(let i = 0; i < 8; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));  // 返回[0, 1)之间的数
            res += x;
        }
        return res;
    }

    start() {       // 只会在第一帧执行一次

    }

    update() {      // 每一帧会执行一次

    }

    late_update() { // 在每一帧的最后执行一次

    }

    on_destroy() {  // 在被销毁前执行一次

    }

    destroy() {     // 删掉该物体
        this.on_destroy();

        for(let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if(AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = timestamp => {

    for(let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    for(let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        obj.late_update();  // 按道理来说update和late_update第一帧不会执行, 但是在此游戏几乎不会有影响, 因此不处理
    }

    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class ChatField {
    constructor(playground) {
        this.playground = playground;
        this.$history = $(`<div class="ac-game-chat-field-history">历史记录</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`)

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_events();
        this.resize();
    }

    add_listening_events() {
        this.$history.mousedown(e => {
            return true;
        });

        this.$input.keydown(e => {
            if(e.which === 27) {    // esc
                this.hide_input();
                return false;
            } else if(e.which == 13) {  // enter
                let username = this.playground.root.settings.username;
                let text = this.$input.val();
                if(text) {
                    this.$input.val("");
                    this.add_message(username, text);
                    this.playground.mps.send_message(username, text);
                }
                return false;   //回车事件在此函数处理, 不向上传递
            }
        });
    }

    resize() {
        this.width = this.playground.width * 0.2;
        this.history_height = this.playground.height * 0.3;

        this.margin_left = (this.playground.$playground.width() - this.playground.width) / 2 + 10;
        this.history_top = (this.playground.$playground.height() - this.playground.height) / 2 + this.playground.height / 2;
        this.input_top = this.history_top + 0.02 * this.playground.height + this.history_height;
        this.$history.css({
            "width": this.width,
            "height": this.history_height,
            "left": this.margin_left,
            "top": this.history_top
        });
        this.$input.css({
            "width": this.width,
            "left": this.margin_left,
            "top": this.input_top
        });
    }

    render_message(message) {
        return $(`<div>${message}</div>`)
    }

    add_message(username, text) {
        this.show_history();
        let message = `[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_history() {
        this.$history.fadeIn();

        if(this.func_id) clearTimeout(this.func_id);

        this.func_id = setTimeout(() => {
            this.$history.fadeOut();
            this.func_id = null;
        }, 3000);
    }

    show_input() {
        this.show_history();

        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
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
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0 class="ac-game-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        this.ceil_width = height * 0.05;
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

        this.px = this.py = 0;
        this.scale = this.playground.scale;
        this

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
        this.$canvas.on("contextmenu", () => {
            return false;
        });
        this.$canvas.mousedown(e => {
            const rect = this.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / this.width * this.virtual_map_width;
            let ty = (e.clientY - rect.top) / this.height * this.virtual_map_height;
            if(e.which === 1) {
                this.playground.focus_player = null;
                this.playground.re_calculate_cx_cy(tx, ty);
                this.px = tx;
                this.py = ty;
            } else if(e.which === 3) {
                // 移动到小地图的指定位置
                this.players[0].move_to(tx, ty);
                if(this.playground.mode === "multi mode") {
                    this.playground.mps.send_move_to(tx, ty);
                }
            }
        });
        this.$canvas.mousemove(e => {
            const rect = this.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / this.width * this.virtual_map_width;
            let ty = (e.clientY - rect.top) / this.height * this.virtual_map_height;
            if(e.which === 1) {
                this.playground.focus_player = null;
                this.playground.re_calculate_cx_cy(tx, ty);
                this.px = tx;
                this.py = ty;
            }
        });
        this.$canvas.mouseup(e => {
            this.playground.game_map.$canvas.focus();
        });
    }

    update() {
        this.render();
    }

    render() {
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
        if(this.playground.focus_player) {
            this.px = this.players[0].x, this.py = this.players[0].y;
        }
        this.px = Math.max(this.px, this.playground.width / 2 / this.scale);
        this.px = Math.min(this.px, (this.virtual_map_width - this.playground.width / 2 / this.scale));
        this.py = Math.max(this.py, this.playground.height / 2 / this.scale);
        this.py = Math.min(this.py, (this.virtual_map_height - this.playground.height / 2 / this.scale));
        // 视野矩形左上角的点
        let viewX = (this.px - this.playground.width / 2 / this.scale) * this.rate_width;
        let viewY = (this.py - this.playground.height / 2 / this.scale) * this.rate_height;
        // 视野矩形的宽和高
        let w = this.playground.width / this.scale * this.rate_width;
        let h = this.playground.height / this.scale * this.rate_height;
        this.ctx.save();
        this.ctx.strokeStyle = "rgb(247, 232, 200, 0.7)";
        this.ctx.setLineDash([15, 5]);
        this.ctx.lineWidth = Math.ceil(3 * this.scale / 1080);
        this.ctx.strokeRect(viewX, viewY, w, h);
        this.ctx.restore();
    }
}
class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪: 0人";
    }

    start() {

    }

    update() {
        this.render();
    }

    write(text) {
        this.text = text;
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}
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
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
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
class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.radius = radius;
        this.move_length = 0;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;
        this.photo = photo;
        this.eps = 0.01;     // 小于eps就算0
        this.friction = 0.9;    //摩擦力
        this.spent_time = 0;
        this.fireballs = [];

        this.cur_skill = null;

        if(this.character !== "robot") {
            this.img = new Image();
            this.img.src = photo;
        }

        if(this.character === "me") {
            this.fireball_coldtime = 3;     // 单位: 秒
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.blink_coldtime = 5;        // 单位P: 秒
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
        } else if(this.character === "robot") {
            this.fireball_robot_coldtime = 0.5;
        }
    }

    start() {
        this.playground.player_count++;
        this.playground.notice_board.write("已就绪: " + this.playground.player_count + "人(按下ESC键取消匹配)");

        if(this.playground.player_count >= 3) {
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");
        }

        if(this.character === "me") {
            this.add_listening_events();
        } else if(this.character === "robot") {
            let tx = Math.random() * this.playground.virtual_map_width;
            let ty = Math.random() * this.playground.virtual_map_height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        this.playground.game_map.$canvas.on("contextmenu", () => {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(e => {
            if(this.playground.state !== "fighting")
                return true;

            const rect = this.ctx.canvas.getBoundingClientRect();

            let tx = (e.clientX - rect.left) / this.playground.scale + this.playground.cx;
            let ty = (e.clientY - rect.top) / this.playground.scale + this.playground.cy;

            if(e.which === 3 || e.which === 1 && this.cur_skill === "blink") {
                if(tx < 0) tx = 0;
                if(tx > this.playground.virtual_map_width) tx = this.playground.virtual_map_width;
                if(ty < 0) ty = 0;
                if(ty > this.playground.virtual_map_height) ty = this.playground.virtual_map_height;
            }

            if(e.which === 3) {
                for(let i = 0; i < 20; i++) {
                    new MoveClickParticle(this.playground, tx, ty, "rgb(209,213,219)");
                }
                this.move_to(tx, ty);

                if(this.playground.mode === "multi mode") {
                    this.playground.mps.send_move_to(tx, ty);
                }
            } else if(e.which === 1) {
                if(this.cur_skill === "fireball") {
                    if(this.fireball_coldtime > this.eps)
                        return false;

                    let fireball = this.shoot_fireball(tx, ty);

                    if(this.playground.mode === "multi mode") {
                        this.playground.mps.send_shoot_fireball(fireball.uuid, tx, ty);
                    }
                } else if(this.cur_skill === "blink") {
                    if(this.blink_coldtime > this.eps)
                        return false;
                    this.blink(tx, ty);

                    if(this.playground.mode === "multi mode") {
                        this.playground.mps.send_blink(tx, ty);
                    }
                }
                this.cur_skill = null;
            }
        });
        this.playground.game_map.$canvas.keydown(e => {
            if(e.which === 13) {    // enter
                if(this.playground.mode === "multi mode") {    // 打开聊天框
                    this.playground.chat_field.show_input();
                    return false;
                }
            } else if(e.which === 27) {     // esc
                if(this.playground.mode === "multi mode") {
                    this.playground.chat_field.hide_input();
                }
            }

            if(e.which === 32) {    // space
                this.playground.focus_player = this;
                this.playground.re_calculate_cx_cy(this.x, this.y);
                return false;
            }

            if(this.playground.state === "waiting") {
                if(e.which === 27) {
                    this.playground.mps.send_remove_player(this.username, this.photo);
                    // this.playground.root.menu.pauseMusic();
                    this.destroy();
                }
            }

            if(this.playground.state !== "fighting")
                return true;    // 返回false就将监听事件在此消失, 返回true是让父元素处理

            if(e.which === 81) { //q
                if(this.fireball_coldtime > this.eps)
                    return true;
                this.cur_skill = "fireball";
                return false;
            } else if(e.which === 70) {     //f
                if(this.blink_coldtime > this.eps)
                    return true;

                this.cur_skill = "blink";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = 0.5;
        let move_length = 1;
        if(this.playground.game_mode == 0) move_length = 0.8;
        else if(this.playground.game_mode == 1 || this.playground.game_mode == 2) move_length = 1, speed = 0.55;
        else if(this.playground.game_mode == 3) move_length = 1.3, speed = 0.6;
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
        this.fireballs.push(fireball);

        if(this.character === "me") {
            this.fireball_coldtime = 3;
        } else if(this.character === "robot") {
            this.fireball_robot_coldtime = 0.5;
        }

        return fireball;
    }

    destroy_fireball(uuid) {
        for(let i = 0; i < this.fireballs.length; i++) {
            let fireball = this.fireballs[i];
            if(fireball.uuid === uuid) {
                fireball.destroy();
                break;
            }
        }
    }

    blink(tx, ty) {
        let d = this.get_dist(this.x, this.y, tx, ty);
        d = Math.min(d, 0.8);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.blink_coldtime = 5;
        this.move_length = 0;   //闪现完之后停下来
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);      //注意是: 两个y的差, 与两个x的差, 注意也要写反, 此方法求的是夹角
        this.vx = Math.cos(angle);      // cos angle = 临边 / 斜边, 临边(x轴方向的边) = cos angle * 斜边(因为速度为1, 则斜边也取单位1)
        this.vy = Math.sin(angle);      // sin angle = 对边 / 斜边, 对边(y轴方向的边) = sin angle * 斜边(因为速度为1, 则斜边也取单位1)
    }

    is_attacked(angle, damage) {
        for(let i = 0; i < 25 + Math.random() * 5; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 12;
            let move_length = this.radius * Math.random() * 7;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if(this.radius < this.eps) {  //半径小于十像素
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage);
    }

    update() {
        this.spent_time += this.timedelta / 1000;

        if(this.character === "me" && this.playground.focus_player) this.playground.re_calculate_cx_cy(this.x, this.y);
        this.update_win();

        if(this.playground.state === "fighting") {
            this.update_coldtime();
        }
        this.update_move();
        this.render();
    }

    update_win() {
        if(this.playground.state === "fighting" && this.character === "me" && this.playground.players.length === 1) {
            this.playground.state = "over";
            this.playground.score_board.win();
        }
    }

    update_coldtime() {
        if(this.character === "me") {
            this.fireball_coldtime -= this.timedelta / 1000;
            this.fireball_coldtime = Math.max(this.fireball_coldtime, 0);

            this.blink_coldtime -= this.timedelta / 1000;
            this.blink_coldtime = Math.max(this.blink_coldtime, 0);
        } else if(this.character === "robot") {
            this.fireball_robot_coldtime -= this.timedelta / 1000;
            this.fireball_robot_coldtime = Math.max(this.fireball_robot_coldtime, 0);
        }
    }

    update_move() {  //更新玩家移动
        //一分钟60秒，每五秒发射次，1 / 300为发射炮弹的概率
        if(this.character === "robot" && this.spent_time > 3 && Math.random() < 1 / 420.0) {
            if(this.fireball_robot_coldtime > this.eps) return false;
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            if(this.playground.game_mode >= 2 && Math.random() >= 0.9) player = this.playground.players[0];     // 若是困难、炼狱难度, 有一定概率优先攻击玩家
            if(player == this) return false;
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
        }
        if(this.damage_speed > this.eps) {    //击退的反速度小于10就不用后退了
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
            // 被击退到墙角
            if(this.x < 0) this.x = 0;
            if(this.x > this.playground.virtual_map_width) this.x = this.playground.virtual_map_width;
            if(this.y < 0) this.y = 0;
            if(this.y > this.playground.virtual_map_height) this.y = this.playground.virtual_map_height;
        } else {
            if(this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(this.character === "robot") {
                    let tx = Math.random() * this.playground.virtual_map_width;
                    let ty = Math.random() * this.playground.virtual_map_height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);     // this.timedelta单位为ms, 则除1000转化为秒
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
    }

    render() {
        let scale = this.playground.scale;

        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        if(this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

        if(this.character === "me" && this.playground.state === "fighting") {
            this.render_skill_coldtime();
        }
    }

    render_skill_coldtime() {
        let scale = this.playground.scale;
        // 因为scale是height, 画面比例是16:9, 16 / 9 = 1.77
        let x = 0.825, y = 0.9, r = 0.04;

        // 火球
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if(this.fireball_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);      // 将圆心移到(x, y)
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);      // 将线连到(x, y)
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }

        x = 0.945, y = 0.9, r = 0.04;
        // 闪现
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if(this.blink_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);      // 将圆心移到(x, y)
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.blink_coldtime / 5) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);      // 将线连到(x, y)
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }
    }

    on_destroy() {
        if(this.character === "me")
            if(this.playground.state === "fighting") {
                this.playground.state = "over";
                this.playground.score_board.lose();
            }

        for (let i = 0; i < this.playground.players.length; i++) {
            if(this.playground.players[i] == this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
        if(this.playground.state === "waiting") {
            this.playground.state = "over";
            this.playground.hide();
            this.playground.root.menu.show();
        }
    }
}
class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;  //win: 胜利, lose: 失败

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";
        this.lose_img = new Image();
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png";
    }

    start() {
    }

    add_listening_events() {
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on(`click`, () => {
            this.playground.hide();
            this.playground.root.menu.show();
        });
    }

    win() {
        this.state = "win";

        setTimeout(() => {
            this.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";

        setTimeout(() => {
            this.add_listening_events();
        }, 1000);
    }

    late_update() {
        this.render();
    }

    render() {
        let len = this.playground.height / 2;
        if(this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } else if(this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();

        if(this.player.character !== "enemy") {
            this.update_attack();
        }

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for(let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if(this.player != player && this.is_collision(player)) {
                this.attack(player);
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(obj) {
        let distance = this.get_dist(this.x, this.y, obj.x, obj.y);
        if(distance < this.radius + obj.radius)
            return true
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);

        if(this.playground.mode == "multi mode") {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }

        this.destroy();
    }

    render() {
        let scale = this.playground.scale;

        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        for(let i = 0; i < fireballs.length; i++) {
            if(fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}
class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://game.zzqahm.top:20002/wss/multiplayer/?token=" + this.playground.root.access);
        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        this.ws.onmessage = e => {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if(uuid === this.uuid) return false;

            console.log(data);
            let event = data.event;
            if(event === "create_player") {
                this.receive_create_player(uuid, data.username, data.photo);
            } else if(event === "remove_player") {
                this.receive_remove_player(uuid, data.username, data.photo);
            } else if(event === "move_to") {
                this.receive_move_to(uuid, data.tx, data.ty);
            } else if(event === "shoot_fireball") {
                this.receive_shoot_fireball(uuid, data.ball_uuid, data.tx, data.ty);
            } else if(event === "attack") {
                this.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if(event === "blink") {
                this.receive_blink(uuid, data.tx, data.ty);
            } else if(event === "message") {
                this.receive_message(uuid, data.username, data.text);
            }
        };
    }

    send_create_player(username, photo) {
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': this.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.virtual_map_width / 2,
            this.playground.virtual_map_height / 2,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_remove_player(username, photo) {
        this.ws.send(JSON.stringify({
            'event': "remove_player",
            'uuid': this.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_remove_player(uuid, username, photo) {
        let players = this.playground.players;
        for(let i = 0; i < players.length; i++) {
            if(players[i].uuid === uuid) {
                this.playground.players.splice(i, 1);
            }
        }
    }

    get_player(uuid) {
        let players = this.playground.players;
        for(let i = 0; i < players.length; i++) {
            let player = players[i];
            if(player.uuid === uuid) {
                return player;
            }
        }
        return null;
    }

    send_move_to(tx, ty) {
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': this.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);

        if(player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(ball_uuid, tx, ty) {
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': this.uuid,
            'ball_uuid': ball_uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_shoot_fireball(uuid, ball_uuid, tx, ty, ) {
        let player = this.get_player(uuid);
        if(player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': this.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        if(attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_blink(tx, ty) {
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': this.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(uuid, tx, ty) {
        let player = this.get_player(uuid);
        if(player) {
            player.blink(tx, ty);
        }
    }

    send_message(username, text) {
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': this.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_message(uuid, username, text) {
        this.playground.chat_field.add_message(username, text);
    }
}
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
        let uuid = this.create_uuid();
        $(window).on('resize.${uuid}', () => {
            this.resize();
        });

        if(this.root.AcWingOS) {
            this.root.AcWingOS.api.window.on_close(() => {
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
        if(this.mini_map) this.mini_map.resize();
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
        this.$playground.show();
        this.width = this.$playground.width();
        this.height = this.$playground.height();

        // 20个格子, 每个格子的宽度是3 * 0.05 = 0.15, 20 * 0.15 = 3
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
        this.focus_player = this.players[0];
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

            this.mps.ws.onopen = () => {
                this.mps.send_create_player(this.root.settings.username, this.root.settings.photo);
            };
        }
        // 等加进来所有东西后再加地图, 要不然会被覆盖
        this.mini_map = new MiniMap(this);
        this.mini_map.resize();
    }

    hide() {    // 关闭playground界面
        while(this.players && this.players.length > 0) {
            this.players[0].destroy();
        }

        if(this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }

        if(this.mini_map) {
            this.mini_map.destroy();
            this.mini_map = null;
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
class Settings {
    constructor(root) {
        if(window.location.host === "app975.acapp.acwing.com.cn") {
            window.location.replace("https://game.zzqahm.top:20002/");
        }
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-quick-login">
            <img src="https://game.zzqahm.top:20002/static/image/settings/acwing_logo.png" class="acwing-logo">
            <img src="https://game.zzqahm.top:20002/static/image/settings/qq_logo.png" class="qq-logo">
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-quick-login">
            <img width="30" src="https://game.zzqahm.top:20002/static/image/settings/acwing_logo.png">
            <img width="30" src="https://game.zzqahm.top:20002/static/image/settings/qq_logo.png">
        </div>
    </div>
</div>
`);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");
        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-quick-login .acwing-logo');
        this.$qq_login = this.$settings.find('.ac-game-settings-quick-login .qq-logo');

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if(this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            if(this.root.access) {
                // 如果是第三方登录，access和refresh会在url中，不安全，手动更新url
                history.pushState({},"","https://game.zzqahm.top:20002/");
                this.getinfo_web();
                this.refresh_jwt_token();
            } else if(localStorage.getItem("username") !== null) {
                this.get_user();
                if(new Date().getTime() - this.root.refresh_expires.getTime() >= 12 * 24 * 60 * 60 * 1000 - 10 * 60 * 1000) {
                    localStorage.clear();
                    this.login();
                    return;
                } else if(new Date().getTime() - this.root.access_expires.getTime() >= 4.5 * 60 * 1000) {
                    $.ajax({
                        url: "https://game.zzqahm.top:20002/settings/token/refresh/",
                        type: "post",
                        data: {
                            refresh: this.root.refresh,
                        },
                        success: resp => {
                            this.root.access = resp.access;
                            localStorage.setItem("access", this.root.access);
                            localStorage.setItem("access_expires", new Date());
                        }
                    });
                }
                this.refresh_jwt_token();
                this.hide();
                this.root.menu.show();
            } else {
                this.login();
            }
            this.add_listening_events();
        }
    }

    rem_user() {
        localStorage.setItem("username", this.username);
        localStorage.setItem("photo", this.photo);
        localStorage.setItem("access", this.root.access);
        localStorage.setItem("refresh", this.root.refresh);
        localStorage.setItem("access_expires", new Date());
        localStorage.setItem("refresh_expires", new Date());
    }

    get_user() {
        this.username = localStorage.getItem("username");
        this.photo = localStorage.getItem("photo");
        this.root.access = localStorage.getItem("access");
        this.root.refresh = localStorage.getItem("refresh");
        this.root.access_expires = new Date(localStorage.getItem("access_expires"));
        this.root.refresh_expires = new Date(localStorage.getItem("refresh_expires"));
    }

    refresh_jwt_token() {
        setInterval(() => {
            $.ajax({
                url: "https://game.zzqahm.top:20002/settings/token/refresh/",
                type: "post",
                data: {
                    refresh: this.root.refresh,
                },
                success: resp => {
                    this.root.access = resp.access;
                    localStorage.setItem("access", this.root.access);
                    localStorage.setItem("access_expires", new Date());
                }
            });
        }, 4.5 * 60 * 1000);
        setTimeout(() => {
            $.ajax({
                url: "https://game.zzqahm.top:20002/menu/ranklist/",
                type: "get",
                headers: {
                    "Authorization": "Bearer " + this.root.access,
                },
                success: resp => {
                    console.log(resp);
                }
            });
        }, 5 * 1000);
    }

    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(() => {
            this.acwing_login();
        });
        this.$qq_login.click(() => {
            this.qq_login();
        });
    }

    add_listening_events_login() {
        this.$login_register.click(() => {
            this.register();
        });
        this.$login_submit.click(() => {
            this.login_on_remote();
        });
    }

    add_listening_events_register() {
        this.$register_login.click(() => {
            this.login();
        });
        this.$register_submit.click(() => {
            this.register_on_remote();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://game.zzqahm.top:20002/settings/acwing/web/apply_code/",
            type: "GET",
            success: resp => {
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    qq_login() {
        $.ajax({
            url: "https://game.zzqahm.top:20002/settings/qq/apply_code/",
            type: "GET",
            success: resp => {
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    login_on_remote(username, password) {     // 在远程服务器上登录
        username = username || this.$login_username.val();
        password = password || this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://game.zzqahm.top:20002/settings/token/",
            type: "POST",
            data: {
                username: username,
                password: password,
            },
            success: resp => {
                this.root.access = resp.access;
                this.root.refresh = resp.refresh;
                this.refresh_jwt_token();
                this.getinfo_web();
            },
            error: () => {
                this.$login_error_message.html("用户名或密码错误！");
            }
        });
    }

    register_on_remote() {  // 在远程服务器上注册
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://game.zzqahm.top:20002/settings/register/",
            type: "POST",
            data: {
                username,
                password,
                password_confirm,
            },
            success: resp => {
                if(resp.result === "success") {
                    this.login_on_remote(username, password);
                } else {
                    this.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() {    // 在远程服务器上登出
        if(this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            this.root.access = "";
            this.root.refresh = "";
            localStorage.clear();
            location.href = "/";
        }
    }

    register() {    // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() {   // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid, redirect_uri, scope, state) {
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, resp => {
            if(resp.result === "success") {
                this.username = resp.username;
                this.photo = resp.photo;
                this.hide();
                this.root.menu.show();
                this.root.access = resp.access;
                this.root.refresh = resp.refresh;
                this.refresh_jwt_token();
            }
        });
    }

    getinfo_acapp() {
        $.ajax({
            url: "https://game.zzqahm.top:20002/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: resp => {
                if(resp.result === "success") {
                    this.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        $.ajax({
            url: "https://game.zzqahm.top:20002/settings/getinfo/",
            type: "GET",
            data: {
                platform: this.platform,
            },
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: resp => {
                if(resp.result === "success") {
                    this.username = resp.username;
                    this.photo = resp.photo;
                    this.rem_user();
                    this.hide();
                    this.root.menu.show();
                } else {
                    this.login();
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}
export class AcGame {
    constructor(id, AcWingOS, access, refresh) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;

        this.access = access;
        this.access_expires = new Date();
        this.refresh = refresh;
        this.refresh_expires = new Date();

        this.menu = new AcGameMenu(this);
        this.settings = new Settings(this);
        this.choose_mode = new AcGameChooseMode(this);
        this.rank = new AcGameRank(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }
}
