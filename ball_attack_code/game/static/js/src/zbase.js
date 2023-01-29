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
