class AcGameRank {
    constructor(root) {
        this.root = root;
        this.$rank = $(`
<div class="ac-game-rank">
    <div class="ac-game-rank-return ac-game-return">
        返回
    </div>
    <div class="ac-game-rank-table">
        <h3>多人模式积分排行榜</h3>
        <table class="table table-bordered table-hover">
            <thead class="ac-game-rank-table-thead">
                <tr>
                    <th>排名</th>
                    <th>游戏ID</th>
                    <th>积分</th>
                </tr>
            </thead>
            <tbody class="ac-game-rank-table-tbody">
            </tbody>
        </table>
    </div>
    <br>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li>
          <a href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li><a href="#">1</a></li>
        <li><a href="#">2</a></li>
        <li><a href="#">3</a></li>
        <li><a href="#">4</a></li>
        <li><a href="#">5</a></li>
        <li>
          <a href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
</div>
        `);
        this.$rank.hide();
        this.root.$ac_game.append(this.$rank);

        this.$return = this.$rank.find('.ac-game-rank-return');
        this.$rank_content = this.$rank.find('.ac-game-rank-table-tbody');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$return.click(function() {
            outer.hide();
            outer.root.menu.show();
        });
    }

    show() {
        this.$rank.show();
        this.$rank_content.empty();
        let outer = this;
        $.ajax({
            url: "https://app975.acapp.acwing.com.cn/menu/getplayers/1",
            type: "GET",
            success: function(resp) {
                if(resp.result === "success") {
                    let players = resp.players;
                    for(let i = 0; i < players.length; i++) {
                        let player = players[i];
                        let obj = "<tr><td>" + (i + 1)  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        outer.$rank_content.append(obj);
                    }
                }
            }
        });
    }

    hide() {
        this.$rank.hide();
    }
}
