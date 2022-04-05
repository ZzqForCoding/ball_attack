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
            <button type="button" class="btn btn-outline-secondary ac-game-rank-table-button-score">多人模式积分滚动条排行榜</button>
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
        this.get_page();        // 查询总页号
        this.generic_page();    // 生成所有页码

        this.$time_table_page_btn = this.$rank.find('.ac-game-rank-table-time-page-num');
        this.$time_table_page_pre = this.$rank.find('.ac-game-rank-table-time-page-pre');
        this.$time_table_page_next = this.$rank.find('.ac-game-rank-table-time-page-next');

        this.modify_page();    // 将不显示的页码隐藏
        this.start();
    }

    start() {
        this.getinfo_rank_score();
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$return.click(function() {
            outer.hide();
            outer.root.menu.show();
        });

        // 待优化: 两个按钮为一组，多次按同一个不要发请求
        // 表格高度随着视口变化
        // 分页条固定在那, 页码跳转要有颜色
        // 可以点一个按钮跳到自己所在页面与位置
        // 生存时间排行榜
        this.$score_btn.click(function() {
            outer.$score_table.show();
            outer.$time_table.hide();
            outer.$time_table_page.hide();
        });

        this.$time_btn.click(function() {
            outer.$score_table.hide();
            outer.$time_table.show();
            outer.$time_table_page.show();
            outer.getinfo_rank_time();
        });
        $.each(this.$time_table_page_btn, function() {
            $(this).click(function() {
                outer.page_num = $(this).text();
                outer.modify_page();
                outer.getinfo_rank_time();
            });
        });

        this.$time_table_page_pre.click(function() {
            outer.page_num = outer.page_num - 1;
            if(outer.page_num === 0) outer.page_num = outer.total_page;
            outer.modify_page();
            outer.getinfo_rank_time();
        });

        this.$time_table_page_next.click(function() {
            outer.page_num = outer.page_num + 1;
            if(outer.page_num == outer.total_page + 1) outer.page_num = 1;
            outer.modify_page();
            outer.getinfo_rank_time();
        });
    }

    generic_page() {
        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-pre\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>");

        for(let i = 1; i <= this.total_page; i++) {
            this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-num\">" + i + "</a></li>");
        }

        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ac-game-rank-table-time-page-next\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>");
    }

    modify_page() {
        // 先把所有隐藏页码
        $.each(this.$time_table_page_btn, function() {
            $(this).hide();
        });
        // 再把this.show_page个页码显示出来, 将this.page_num始终保持在中间, 若this.page_num为3, this.show_page为3则2 3 4, this.show_page为4则2 3 4 5

        let start = null, end = null;
        if(this.page_num < this.show_page) start = 1, end = this.show_page;
        else if(this.page_num > this.total_page - this.show_page) start = this.total_page - this.show_page + 1, end = this.total_page;
        else {
            start = this.page_num - this.show_page / 2; // 5 - 3 / 2 ~ 5 + 3 / 2 => 4 5 6, 5 - 4 / 2 ~ 5 + 4 / 2 => 3 4 5 6 7
            end = this.page_num + (this.show_page % 2 == 0 ? this.show_page / 2 - 1 : this.show_page / 2);
        }
        $.each(this.$time_table_page_btn, function() {
            let val = $(this).text();
            if(val >= start && val <= end) {
                $(this).show();
            }
        });
    }

    getinfo_rank_score() {
        let outer = this;
        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/menu/getplayers",
            type: "GET",
            success: function(resp) {
                if(resp.result === "success") {
                    let players = resp.players;
                    for(let i = 0; i < players.length; i++) {
                        let player = players[i];
                        let obj = "<tr><td>" + (i + 1)  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        outer.$score_table_content.append(obj);
                    }
                }
            }
        });
    }

    getinfo_rank_time() {
        let outer = this;
        this.$time_table_content.empty();
        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/menu/getplayers/" + outer.page_num,
            type: "GET",
            success: function(resp) {
                if(resp.result === "success") {
                    let players = resp.players;
                    for(let i = 0; i < players.length; i++) {
                        let player = players[i];
                        let obj = "<tr><td>" + ((outer.page_num - 1) * 10 + i + 1)  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        outer.$time_table_content.append(obj);
                    }
                }
            }
        });
    }

    get_page() {
        let outer = this;
        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/menu/getpage/",
            type: "GET",
            async: false,       // 若不加这行赋值在退出方法后无效
            success: function(resp) {
                if(resp.result === "success") {
                    outer.total_page = resp.page_count;
                }
            }
        });
    }

    show() {
        this.$rank.show();
        this.$score_btn.click();
    }

    hide() {
        this.$rank.hide();
    }
}
