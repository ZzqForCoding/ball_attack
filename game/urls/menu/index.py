from django.urls import path
from game.views.menu.rank.score_rank import get_players

urlpatterns = [
        path("getplayers/<int:page>/", get_players, name="menu_get_score_rank"),
]
