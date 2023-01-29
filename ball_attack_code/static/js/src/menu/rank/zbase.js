class AcGameRank {
    constructor(root) {
        this.root = root;
        this.$rank = $(`
<div class="ac-game-rank">
    <div class="ac-game-rank-return ac-game-return">
        返回
    </div>
    <div class="ac-game-rank-table">
        <div class="ac-game-rank-table-button">
            <button type="button" class="btn btn-outline-secondary ac-game-rank-table-button-score">多人模式积分滚动条排行榜(每五分钟并点击排行榜重新加载数据)</button>
            <button type="button" class="btn btn-outline-secondary ac-game-rank-table-button-time">多人模式积分分页排行榜</button>
        </div>
        <div class="ac-game-rank-tables">
            <table class="table table-bordered table-hover ac-game-rank-table-score">
                <thead class="ac-game-rank-table-score-thead">
                    <tr>
                        <th>排名</th>
                        <th>游戏ID</th>
                        <th>积分</th>
                    </tr>
                </thead>
                <tbody class="ac-game-rank-table-score-tbody"></tbody>
            </table>
            <table class="table table-bordered table-hover ac-game-rank-table-time">
                <thead class="ac-game-rank-table-time-thead">
                    <tr>
                        <th>排名</th>
                        <th>游戏ID</th>
                        <th>生存时间</th>
                    </tr>
                </thead>
                <tbody class="ac-game-rank-table-time-tbody"></tbody>
            </table>
            <nav aria-label="Page navigation" class="ac-game-rank-table-time-page">
                <ul class="pagination">
                </ul>
            </nav>
        </div>
    </div>
</div>
        `);
        this.$rank.hide();
        this.root.$ac_game.append(this.$rank);
        this.$return = this.$rank.find('.ac-game-rank-return');

        this.$score_btn = this.$rank.find('.ac-game-rank-table-button-score');
        this.$score_table = this.$rank.find('.ac-game-rank-table-score');
        this.$score_table_content = this.$rank.find('.ac-game-rank-table-score-tbody');

        this.$time_btn = this.$rank.find('.ac-game-rank-table-button-time');
        this.$time_table = this.$rank.find('.ac-game-rank-table-time');
        this.$time_table_page = this.$rank.find('.ac-game-rank-table-time-page');
        this.$time_table_content = this.$rank.find('.ac-game-rank-table-time-tbody');

        this.$pagination = this.$rank.find('.pagination');
        this.page_num = 1;      // 当前处于的页号
        this.total_page = 0;    // 总页号
        this.show_page = 3;     // 显示的页码为三个
        this.generic_page();    // 生成所有页码

        this.$time_table_page_btn = this.$rank.find('.ac-game-rank-table-time-page-num');
        this.$time_table_page_pre = this.$rank.find('.ac-game-rank-table-time-page-pre');
        this.$time_table_page_next = this.$rank.find('.ac-game-rank-table-time-page-next');

        this.start();

        this.score_player = null;
        this.score_player_time = null;
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        this.$return.click(() => {
            this.hide();
            this.root.menu.show();
        });

        // 待优化: 两个按钮为一组，多次按同一个不要发请求
        // 表格高度随着视口变化
        // 分页条固定在那, 页码跳转要有颜色
        // 可以点一个按钮跳到自己所在页面与位置
        // 生存时间排行榜
        this.$score_btn.click(() => {
            this.$score_table.show();
            this.$time_table.hide();
            this.$time_table_page.hide();
        });

        this.$time_btn.click(() => {
            this.$score_table.hide();
            this.$time_table.show();
            this.$time_table_page.show();
            this.getinfo_rank_time();
        });
        let outer = this;
        $.each(this.$time_table_page_btn, function() {
            $(this).click(() => {
                outer.page_num = parseInt($(this).text());
                outer.getinfo_rank_time();
            });
        });

        this.$time_table_page_pre.click(() => {
            this.page_num = this.page_num - 1;
            if(this.page_num === 0) this.page_num = this.total_page;
            this.getinfo_rank_time();
        });

        this.$time_table_page_next.click(() => {
            this.page_num = this.page_num + 1;
            if(this.page_num == this.total_page + 1) this.page_num = 1;
            this.getinfo_rank_time();
        });
    }

    generic_page() {
        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-pre\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>");

        for(let i = 1; i <= this.show_page; i++) {
            this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-num\">" + i + "</a></li>");
        }

        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-next\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>");
    }

    modify_page() {
        // 将this.page_num始终保持在中间, 若this.page_num为3, this.show_page为3则2 3 4, this.show_page为4则2 3 4 5
        let start = null, end = null;
        if(this.page_num < this.show_page) start = 1, end = this.show_page;
        else if(this.page_num > this.total_page - this.show_page) start = this.total_page - this.show_page + 1, end = this.total_page;
        else {
            start = this.page_num - this.show_page / 2; // 5 - 3 / 2 ~ 5 + 3 / 2 => 4 5 6, 5 - 4 / 2 ~ 5 + 4 / 2 => 3 4 5 6 7
            end = this.page_num + (this.show_page % 2 == 0 ? this.show_page / 2 - 1 : this.show_page / 2);
        }
        start = Math.ceil(start);
        $.each(this.$time_table_page_btn, function(i) {
            $(this).text(start + i);
        });
    }

    getinfo_rank_score() {
        if(this.score_player && this.score_player_time && new Date().getTime() - this.score_player_time.getTime() <= 5 * 60 * 1000) return;
        this.$score_table_content.empty();
        $.ajax({
            url: "https://game.zzqahm.top:20002/menu/rank/getplayers/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: resp => {
                if(resp.result === "success") {
                    this.score_player = resp.players;
                    this.score_player_time = new Date();
                    for(let i = 0; i < this.score_player.length; i++) {
                        let player = this.score_player[i];
                        let obj = "<tr><td>" + player.rank  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        this.$score_table_content.append(obj);
                    }
                }
            }
        });
    }

    getinfo_rank_time() {
        this.$time_table_content.empty();
        this.get_page();        // 查询总页号
        this.modify_page();    // 修改页码

        $.ajax({
            url: "https://game.zzqahm.top:20002/menu/rank/getplayers/" + this.page_num + "/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: resp => {
                if(resp.result === "success") {
                    let players = resp.players;
                    for(let i = 0; i < players.length; i++) {
                        let player = players[i];
                        let obj = "<tr><td>" + ((this.page_num - 1) * 10 + i + 1)  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        this.$time_table_content.append(obj);
                    }
                }
            }
        });
    }

    get_page() {
        $.ajax({
            url: "https://game.zzqahm.top:20002/menu/rank/getpage/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            async: false,       // 若不加这行赋值在退出方法后无效
            success: resp => {
                if(resp.result === "success") {
                    this.total_page = resp.page_count;
                }
            }
        });
    }

    show() {
        this.getinfo_rank_score();
        this.$rank.show();
        this.$score_btn.click();
    }

    hide() {
        this.$rank.hide();
    }
}
