class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <audio src="https://app975.acapp.acwing.com.cn/static/audio/BygoneBumps.mp3" class="ac-game-background-music" preload="auto" autoplay="autoplay" loop="loop">
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
        this.$audio= document.getElementsByClassName('ac-game-background-music')[0];
        this.$audio.volume = 0.5;
        this.musics = ["https://app975.acapp.acwing.com.cn/static/audio/BygoneBumps.mp3",
                       "https://app975.acapp.acwing.com.cn/static/audio/MonsieurMelody.mp3",
                       "https://app975.acapp.acwing.com.cn/static/audio/SunnyJim.mp3",
                       "http://music.163.com/song/media/outer/url?id=1307617269.mp3"];
        this.random_music_idx = Math.floor(Math.random() * this.musics.length);
        $('.ac-game-background-music').attr('src', this.musics[this.random_music_idx]);

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
