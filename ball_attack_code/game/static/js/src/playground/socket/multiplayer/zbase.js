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
