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
