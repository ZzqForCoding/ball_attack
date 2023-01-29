from rest_framework.views import APIView
from rest_framework.response import Response
from game.models.player.player import Player

class UserList(APIView):
    def get(self, request):
        players = Player.objects.all().exclude(photo="https://img2.baidu.com/it/u=2161949891,656888789&fm=26&fmt=auto").order_by('id')[:10]
        users = []
        for player in players:
            users.append({
                'id': player.user.id,
                'username': player.user.username,
                'photo': player.photo,
                'followerCount': player.followerCount
            })
        return Response(users)