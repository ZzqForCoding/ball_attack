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
        this.musics = ["https://game.zzqahm.top/static/audio/BygoneBumps.mp3",
                       "https://game.zzqahm.top/static/audio/MonsieurMelody.mp3",
                       "https://game.zzqahm.top/static/audio/SunnyJim.mp3",
                       "https://game.zzqahm.top/static/audio/qiuqiu.mp3",
                       "https://game.zzqahm.top/static/audio/AudioHighs.mp3",
                       "https://game.zzqahm.top/static/audio/BianTaiRuNiu.mp3",
                       "https://game.zzqahm.top/static/audio/ChuLianXianDingBgm.mp3",
                       "https://game.zzqahm.top/static/audio/DuoLaAMeng.mp3"];
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

    show() {    // 显示menu界面
        this.$menu.show();
    }

    hide() {    // 隐藏menu界面
        this.$menu.hide();
    }
}
