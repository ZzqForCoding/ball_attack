from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.myspace.follow import Follow
from game.models.player.player import Player

class FollowView(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        # 是个字典，可以通过data['key'] 或 data.get('key', 0)，第二个参数是默认值
        data = request.POST
        source_id = request.user.id
        target_id = int(data['target_id'])
        fs = Follow.objects.filter(source=source_id, target=target_id)
        if fs.exists():
            player = Player.objects.get(user_id=target_id)
            player.followerCount -= 1
            player.save()
            fs.delete()
        else:
            player = Player.objects.get(user_id=target_id)
            player.followerCount += 1
            player.save()
            Follow.objects.create(source=source_id, target=target_id)
        return Response({
            'result': "success",
        })
