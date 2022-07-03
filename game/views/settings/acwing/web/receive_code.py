from django.shortcuts import redirect, reverse
from django.core.cache import cache
from django.http import JsonResponse
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint
from rest_framework_simplejwt.tokens import RefreshToken

def receive_code(request):
    data = request.GET
    code = data.get('code')
    state = data.get('state')

    if not cache.has_key(state):
        return redirect("index")

    cache.delete(state)

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid': "975",
        'secret': "c057498070e94ffbbd22f0a7ae99ef62",
        'code': code
    }

    access_token_res = requests.get(apply_access_token_url, params=params).json()

    access_token = access_token_res['access_token']
    openid = access_token_res['openid']

    players = Player.objects.filter(openid=openid)
    if players.exists(): # 如果该用户已存在, 则无需重新获取信息, 直接登录即可
     refresh = RefreshToken.for_user(players[0].user)
     return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))

    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
        "access_token": access_token,
        "openid": openid
    }
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['username']
    photo = userinfo_res['photo']

    users = User.objects.filter(usernaime=username)
    while users.exists():  # 找到一个新用户名
        players = Player.objects.filter(user=users[0])
        if players.exists():
            player = players[0]
            refresh = RefreshToken.for_user(player.user)
            return JsonResponse ({
                'result': "success",
                'username': player.user.username,
                'photo': player.photo,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })

    while User.objects.filter(username=username).exists():
        username += str(randint(0, 9))

    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=photo, openid=openid)

    refresh = RefreshToken.for_user(players[0].user)
    return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))
