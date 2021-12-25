class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
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
        this.is_me = is_me;
        this.eps = 0.1;     // 小于eps就算0
        this.friction = 0.9;    //摩擦力
        this.spent_time = 0;

        this.cur_skill = null;
    }

    start() {
        if(this.is_me) {
            this.add_listening_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if(e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if(e.which === 1) {
                if(outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function(e) {
            if(e.which === 81) { //q
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);

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
        if(this.radius < 10) {  //半径小于十像素
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        //一分钟60秒，每五秒发射次，1 / 300为发射炮弹的概率
        if(!this.is_me && this.spent_time > 3 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            if(player == this) return false;
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(player.x, player.y);
        }
        if(this.damage_speed > 10) {    //击退的反速度小于10就不用后退了
            this.vx = this.vy = 0;
            this.move_length = 0
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if(this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);     // this.timedelta单位为ms, 则除1000转化为秒
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i++) {
            if(this.playground.players[i] == this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}
