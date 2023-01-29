from django.urls import path
from game.views.menu.rank.rank_score_page_list import RankScorePageListView
from game.views.menu.rank.rank_score_list import RankScoreListView
from game.views.menu.rank.rank_score_total_page import RankScoreTotalPageView
from game.views.menu.rank.rank_list import RankListView

urlpatterns = [
    path("rank/getplayers/<int:page>/", RankScorePageListView.as_view(), name="menu_get_score_page_rank"),
    path("rank/getplayers/", RankScoreListView.as_view(), name="menu_get_score_rank"),
    path("rank/getpage/", RankScoreTotalPageView.as_view(), name="menu_get_page"),
    path("ranklist/", RankListView.as_view(), name="menu_rank_list"),
]
