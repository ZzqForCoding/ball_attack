from django.contrib import admin
from game.models.player.player import Player
from game.models.myspace.follow import Follow
from game.models.myspace.post import Post

# Register your models here.

admin.site.register(Player)
admin.site.register(Follow)
admin.site.register(Post)
