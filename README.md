# 球球大作战项目

## 项目介绍

此项目是基于`Django`框架与`Canvas`渲染实现的一个游戏，通过自制了一个简单的游戏引擎实现了碰撞，粒子效果，小地图，大地图等很多前端效果；并且后端使用`WebSocket`实现了联机对战功能，通过此项目，你会熟练掌握前端的基础：`HTML`、`CSS`、`es6`、`Canvas`，后端技术包括：`Python`、`Django`、`Django RestFramework`、`Django Channels`、`Django Redis`等技术，此外该项目使用了Thrift实现微服务，将匹配服务与后端服务分离，匹配服务支持三人匹配，是将匹配分最近的玩家匹配到一起，项目还实现了一个排行榜功能，通过了两种方式预览：分别是滑动浏览与分页浏览。

<br>

## 游戏该如何操作？

鼠标右键单击地图移动，鼠标左键选定目标，按q发射火球，按f闪现
恢复视角按Space
按回车可以调出聊天栏，再次按下回车发送消息，ESC关闭聊天栏

<br>

## 游戏部署

**拉取项目至本地：** [gitlab地址](git@git.acwing.com:ZzQ/acapp.git)
```git
git clone git@git.acwing.com:ZzQ/acapp.git
```
<br>

**通过dockerfile制作镜像：**
```shell
cd dockerfile文件所在目录
docker build -t zzq10/ubuntu:ball_attack .
```

**运行docker_run.sh脚本制作容器：**
`注意：` 此命令挂载了目录与映射了端口号，注意修改与开放端口号！
```shell
./docker_run.sh
```

**注意：** `conf`文件夹下的nginx配置文件与redis配置文件有需要修改可以直接修改，nginx里配置了域名与https证书；容器可以通过`docker exec -it 容器名或id /bin/bash`命令进入容器，通过`tmux a`可查看正在运行服务

<br>
