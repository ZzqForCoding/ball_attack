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
            <button type="button" class="btn btn-outline-secondary ac-game-rank-table-button-score">多人模式积分排行榜</button>
            <button type="button" class="btn btn-outline-secondary ac-game-rank-table-button-time">生存时间排行榜(数据待补充)</button>
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
                    <li><a href="javascript:void(0)" class="ac-game-rank-table-time-page-pre" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                    <li><a href="javascript:void(0)" class="ac-game-rank-table-time-page-num">1</a></li>
                    <li><a href="javascript:void(0)" class="ac-game-rank-table-time-page-num">2</a></li>
                    <li><a href="javascript:void(0)" class="ac-game-rank-table-time-page-num">3</a></li>
                    <li><a href="javascript:void(0)" class="ac-game-rank-table-time-page-num">4</a></li>
                    <li><a href="javascript:void(0)" class="ac-game-rank-table-time-page-num">5</a></li>
                    <li><a href="javascript:void(0)" class="ac-game-rank-table-time-page-next" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
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

        this.$time_table_page_btn = this.$rank.find('.ac-game-rank-table-time-page-num');
        this.$time_table_page_pre = this.$rank.find('.ac-game-rank-table-time-page-pre');
        this.$time_table_page_next = this.$rank.find('.ac-game-rank-table-time-page-next');
        this.page_num = 1;

        this.start();
    }

    start() {
        this.add_listening_events();
        this.getinfo_rank_score();
    }

    add_listening_events() {
        let outer = this;
        this.$return.click(function() {
            outer.hide();
            outer.root.menu.show();
        });

        // 待优化: 两个按钮为一组，多次按同一个不要发请求
        // 表格高度随着视口变化
        // 分页
        // 表格滚动条
        // 优化js代码
        // 可以点一个按钮跳到自己所在页面与位置
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
                outer.getinfo_rank_time();
            });
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

    show() {
        this.$rank.show();
        this.$score_btn.click();
    }

    hide() {
        this.$rank.hide();
    }
}
