from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player

class RankScoreListView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        player_list = Player.objects.all().order_by('-score')
        players = []
        for player in player_list:
            pd = {}
            pd['name'] = player.user.username
            pd['photo'] = player.photo
            pd['score'] = player.score
            players.append(pd)

        return Response({
            'result': 'success',
            'players': players,
        })
