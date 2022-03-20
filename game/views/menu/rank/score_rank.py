from django.core.paginator import Paginator
from django.conf import settings
from django.http import JsonResponse

from game.models.player.player import Player

def get_players(request, page):
    players = Player.objects.all().order_by('-score')
    paginator = Paginator(players, settings.RANK_LIST_NUM)
    player_list = paginator.get_page(page).object_list
    players = []
    for player in player_list:
        pd = {}
        pd['name'] = player.user.username
        pd['photo'] = player.photo
        pd['score'] = player.score
        players.append(pd)

    return JsonResponse({
        'result': 'success',
        'players': players,
    })


