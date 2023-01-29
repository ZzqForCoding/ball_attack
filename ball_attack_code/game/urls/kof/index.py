from django.urls import re_path
from game.views.kof.index import index

urlpatterns = [
    re_path(r".*", index, name="kof_index"),
]
