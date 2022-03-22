from django.urls import path
from game.views.menu.rank import score_rank

urlpatterns = [
    path("getplayers/<int:page>/", score_rank.get_page_players, name="menu_get_score_page_rank"),
    path("getplayers/", score_rank.get_players, name="menu_get_score_rank"),
]
