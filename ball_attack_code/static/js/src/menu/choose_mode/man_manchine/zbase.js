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
