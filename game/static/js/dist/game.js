class AcGameChooseMode {
    constructor(root) {
        this.root = root;
        this.$choose_mode = $(`
<div class="ac-game-choose-mode">
    <div class="ac-game-choose-mode-return">
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
        this.$return.click(function() {
            outer.hide();
            outer.root.menu.show();
        });
        this.$mode_name.each(function(i) {
            $(this).click(function() {
                outer.root.playground.game_mode = i;
                outer.root.playground.show("single mode");
                outer.hide();
            });
            $(this).mouseover(function() {
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
class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-man-machine-mode">
            人机模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
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
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function() {
            outer.hide();
            // outer.root.playground.show("single mode");
            outer.root.choose_mode.show();
        });
        this.$multi_mode.click(function() {
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.click(function() {
            outer.root.settings.logout_on_remote();
        });
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
let AC_GAME_ANIMATION = function(timestamp) {

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
        let outer = this;

        this.$history.mousedown(function(e) {
            return true;
        });

        this.$input.keydown(function(e) {
            if(e.which === 27) {    // esc
                outer.hide_input();
                return false;
            } else if(e.which == 13) {  // enter
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if(text) {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(username, text);
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
        let outer = this;
        this.$history.fadeIn();

        if(this.func_id) clearTimeout(this.func_id);

        this.func_id = setTimeout(function() {
            outer.$history.fadeOut();
            outer.func_id = null;
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
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.ceil_width * 0.05 * this.scale;
        this.ctx.strokeStyle = this.color;
        this.ctx.rect(this.start_x * this.scale, this.start_y * this.scale, this.ceil_width * this.scale, this.ceil_width * this.scale);
        this.ctx.stroke();
        this.ctx.restore();
    }
}
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
        this.ctx.fillStyle = "rgba(136, 188, 194, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
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
        this.playground.notice_board.write("已就绪: " + this.playground.player_count + "人");

        if(this.playground.player_count >= 3) {
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");
        }

        if(this.character === "me") {
            this.add_listening_events();
        } else if(this.character === "robot") {
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if(outer.playground.state !== "fighting")
                return true;

            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3) {
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                outer.move_to(tx, ty);

                if(outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty);
                }
            } else if(e.which === 1) {
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                if(outer.cur_skill === "fireball") {
                    if(outer.fireball_coldtime > outer.eps)
                        return false;

                    let fireball = outer.shoot_fireball(tx, ty);

                    if(outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_fireball(fireball.uuid, tx, ty);
                    }
                } else if(outer.cur_skill === "blink") {
                    if(outer.blink_coldtime > outer.eps)
                        return false;
                    outer.blink(tx, ty);

                    if(outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_blink(tx, ty);
                    }
                }
                outer.cur_skill = null;
            }
        });
        this.playground.game_map.$canvas.keydown(function(e) {
            if(e.which === 13) {    // enter
                if(outer.playground.mode === "multi mode") {    // 打开聊天框
                    outer.playground.chat_field.show_input();
                    return false;
                }
            } else if(e.which === 27) {     // esc
                if(outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.hide_input();
                }
            }

            if(outer.playground.state !== "fighting")
                return true;    // 返回false就将监听事件在此消失, 返回true是让父元素处理

            if(e.which === 81) { //q
                if(outer.fireball_coldtime > outer.eps)
                    return true;
                outer.cur_skill = "fireball";
                return false;
            } else if(e.which === 70) {     //f
                if(outer.blink_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "blink";
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
        if(this.playground.game_mode == 1 || this.playground.game_mode == 2) speed = 0.55;
        else if(this.playground.game_mdoe == 3) speed = 0.6;
        let move_length = 1;
        if(this.playground.game_mode == 0) move_length = 0.8;
        else if(this.playground.game_mode == 1 || this.playground.game_mode == 2) move_length = 1;
        else if(this.playground.game_mode == 3) move_length = 1.3;
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
        for(let i = 0; i < 20 + Math.random() * 5; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
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
        } else {
            if(this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(this.character === "robot") {
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
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
        if(this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
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
        let x = 1.5, y = 0.9, r = 0.04;

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

        x = 1.62, y = 0.9, r = 0.04;
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
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on(`click`, function() {
            outer.playground.hide();
            outer.playground.root.menu.show();
        });
    }

    win() {
        this.state = "win";

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
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
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
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

        this.ws = new WebSocket("wss://app975.acapp.acwing.com.cn/wss/multiplayer/");
        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if(uuid === outer.uuid) return false;

            let event = data.event;
            if(event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            } else if(event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if(event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.ball_uuid, data.tx, data.ty);
            } else if(event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if(event === "blink") {
                outer.receive_blink(uuid, data.tx, data.ty);
            } else if(event === "message") {
                outer.receive_message(uuid, data.username, data.text);
            }
        };
    }

    send_create_player(username, photo) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
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
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
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
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
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
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
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
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': outer.uuid,
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
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
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

    show(mode) {    // 打开playground界面
        let outer = this;
        this.$playground.show();
        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.virtual_map_width = this.virtual_map_height = 3;

        this.mode = mode;
        this.state = "waiting";     // waiting -> fighting -> over

        this.game_map = new GameMap(this);

        this.notice_board = new NoticeBoard(this);

        this.score_board = new ScoreBoard(this);

        this.player_count = 0;

        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.175, "me", this.root.settings.username, this.root.settings.photo));

        if(mode === "single mode") {
            let len = 0, speed = 0.15;
            if(this.game_mode == 0) len = 3;
            else if(this.game_mode == 1) len = 4, speed = 0.2;
            else if(this.game_mode == 2) len = 5, speed = 0.2;
            else len = 5;
            for(let i = 0; i < len; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), speed, "robot"));
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
class Settings {
    constructor(root) {
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
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app975.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
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
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app975.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
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

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if(this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            this.getinfo_web();
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp) {
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    login_on_remote() {     // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                if(resp.result === "success") {
                    location.reload();    // 登录成功就刷新
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote() {  // 在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                if(resp.result === "success") {
                    location.reload();
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() {    // 在远程服务器上登出
        if(this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            $.ajax({
                url: "https://app975.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp) {
                    if(resp.result === "success") {
                        location.reload();
                    }
                }
            });
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
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            if(resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if(resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        let outer = this;
        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if(resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
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
    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.choose_mode = new AcGameChooseMode(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }
}
