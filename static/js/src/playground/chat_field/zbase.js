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
