from django.http import JsonResponse
from django.core.cache import cache
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from random import randint
from game.models.player.player import Player

def receive_code(request):
    data = request.GET

    if "errcode" in data:
        return JsonResponse({
            'result': "apply failed",
            'errcode': data['errcode'],
            'errmsg': data['errmsg'],
        });

    code = data.get('code')
    state = data.get('state')

    if not cache.has_key(state):
        return JsonResponse({
            'result': "state not exist"
        })

    cache.delete(state)

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid': "975",
        'secret': "9e157e6d1a5b4891a4838eeb760a01ef",
        'code': code
    }

    access_token_res = requests.get(apply_access_token_url, params=params).json()

    access_token = access_token_res['access_token']
    openid = access_token_res['openid']

    players = Player.objects.filter(openid=openid)
    if players.exists(): # 如果该用户已存在, 则无需重新获取信息, 直接登录即可
        player = players[0]
        refresh = RefreshToken.for_user(player.user)
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })

    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
        "access_token": access_token,
        "openid": openid
    }
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['username']
    photo = userinfo_res['photo']

    users = User.objects.filter(username=username)
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
    refresh = RefreshToken.for_user(user)
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })
