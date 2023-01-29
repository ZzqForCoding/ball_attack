import { AcGameObject } from '/static/js/kof/ac_game_object/gameobject.js';

export class Player extends AcGameObject {
   constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;  // 水平速度
        this.speedy = -1000;  // 跳起的初始速度

        this.gravity = 50;

        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.status = 3;  // 0: idle, 1: 向前，2：向后，3：跳跃，4：攻击，5：被打，6：死亡，7：格挡
        this.animations = new Map();
        this.frame_current_cnt = 0;

        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.root.$kof.find(`.kof-head-hp-${this.id}>div>div`);
    }

    start() {

    }

    // 三连跳, 连招逻辑(栈，存储按键序列), 跑
    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            // 攻击
            if(space) {
                if(this.direction == 1 && w && d || this.direction == -1 && w && a) {
                    this.status = 8;
                    this.frame_current_cnt = 0;
                    this.vx = 0;
                } else {
                    this.status = 4;
                    this.vx = 0;
                    this.frame_current_cnt = 0;    
                }
            } else if (w) {     // 跳
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;   
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_move() {
        this.vy += this.gravity;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if(this.status === 3) this.status = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_direction() {
        // 死了就不变方向
        if(this.status === 6) return;
        let players = this.root.players;
        if(players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if(me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    is_collision(r1, r2) {
        if(Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2)) return false;
        if(Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2)) return false;
        return true;
    }

    // 被攻击到了
    is_attack(val) {
        // 死了就不被攻击到
        if(this.status === 6) return;
        let me = this;
        me.x += -me.direction * 95;
        // 状态变成被攻击到
        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - val, 0);

        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 300);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);
        
        if(this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }

    update_attack() {
        // 在攻击状态下和攻击状态拳头打出去的时候
        if(this.status === 4 && this.frame_current_cnt === 18) {
            let me = this, you = this.root.players[1 - me.id];
            let r1;
            if(this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20,
                };
            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if(this.is_collision(r1, r2)) {
                if(you.status === 1) {
                    you.status = 7;
                    you.frame_current_cnt = 0;
                    return;
                }
                you.is_attack(20);
            }
        }
        if(this.status === 8 && this.frame_current_cnt == 38) {
            let me = this, you = this.root.players[1 - me.id];
            let r1;
            if(this.direction > 0) {
                r1 = {
                    x1: me.x + 85,
                    y1: me.y - 90,
                    x2: me.x + 85 + this.width,
                    y2: me.y - 90 + this.height,
                };
            } else {
                r1 = {
                    x1: me.x - 85,
                    y1: me.y - 90,
                    x2: me.x + 85 + this.width,
                    y2: me.y - 90 + this.height,
                };
            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if(this.is_collision(r1, r2)) {
                if(you.status === 1) {
                    you.status = 7;
                    you.frame_current_cnt = 0;
                    return;
                }
                you.is_attack(40);
            }
        }
    }

    update() {
        // 检测碰撞
        this.update_attack();
        // 控制按键 
        this.update_control();
        // 控制移动
        this.update_move();
        // 控制玩家的所朝方向
        this.update_direction();
        this.render();
    }

    render() {
        // 当前角色状态
        let status = this.status;
        // 如果是后退就渲染后退动画
        if(this.status === 1 && this.direction * this.vx < 0) {
            status = 2;
        }
        // 获取那一帧图片
        let obj = this.animations.get(status);
        // 如果图片不为空 且 加载完毕
        if (obj && obj.loaded) {
            if(this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                // 保存画布的状态，会将当前状态存储到栈中(可执行多次save)
                this.ctx.save();
                // 改变方向
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0); 

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                
                // 恢复画布的状态(弹出栈顶状态)
                this.ctx.restore();
            }
        }
        // 如果是一次性动画，就要将动作渲染成死亡或站立
        if(status === 4 || status === 5 || status === 6 || status === 7 || status === 8) {
            // 达到最后一帧
            if(this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                // 死亡
                if(status === 6) {
                    this.frame_current_cnt--;
                } else {
                    if(status === 8) {
                        this.x += this.direction * 95;
                    }
                    // 站立
                    this.status = 0;
                }
            }
        }
        // 渲染的帧++
        this.frame_current_cnt++;
    }
}
