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

    apply_access_token_url = "https://graph.qq.com/oauth2.0/token"
    params = {
        'grant_type': "authorization_code",
        'client_id': "102009232",
        'client_secret': "cCbnnbDcpqc8VdXC",
        'code': code,
        'redirect_uri': "https://game.zzqahm.top:20002/settings/qq/receive_code",
        'fmt': "json"
    }

    access_token_res = requests.get(apply_access_token_url, params=params).json()
    access_token = access_token_res['access_token']

    # 获取用户信息
    get_user_openid_url = "https://graph.qq.com/oauth2.0/me"
    params = {
        'access_token' : access_token,
        'fmt' : "json"
    }

    openid_res = requests.get(get_user_openid_url, params=params).json()
    openid = openid_res['openid']

    players = Player.objects.filter(openid=openid)
    if players.exists(): # 如果该用户已存在, 则无需重新获取信息, 直接登录即可
        refresh = RefreshToken.for_user(players[0].user)
        return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))

    get_userinfo_url = "https://graph.qq.com/user/get_user_info"

    params = {
            'access_token': access_token,
            'oauth_consumer_key': "102009232",
            'openid': openid,
            'fmt': "json"
    }

    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['nickname']
    photo = userinfo_res['figureurl_qq_1']

    users = User.objects.filter(username=username)
    while users.exists():  # 找到一个新用户名
        players = Player.objects.filter(user=users[0])
        if players.exists():
            player = players[0]
            refresh = RefreshToken.for_user(player.user)
            return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))

    while User.objects.filter(username=username).exists():
        username += str(randint(0, 9))

    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=photo, openid=openid)

    refresh = RefreshToken.for_user(players[0].user)
    return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))
