export class AcGame {
    constructor(id, AcWingOS, access, refresh) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;

        this.access = access;
        this.refresh = refresh;

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.choose_mode = new AcGameChooseMode(this);
        this.rank = new AcGameRank(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }
}
