# 镜像
FROM zzq10/ubuntu:python
# 镜像制作人信息
MAINTAINER zzq "17687952609@163.com"
# 环境变量
ENV DEBIAN_FRONTEND noninteractive
# 安装包
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
        apt-get -y install sudo dialog apt-utils
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN sudo apt-get -y install python3-pip
RUN sudo apt-get -y install python3.10-venv
# 配置pip源
RUN mkdir ~/.pip
RUN echo "[global] \n\
index-url = https://pypi.tuna.tsinghua.edu.cn/simple" > ~/.pip/pip.conf
# 创建父级目录
RUN mkdir /code
WORKDIR /code
# 安装python依赖包
COPY ./conf/requirements.txt /code
RUN pip install -r /code/requirements.txt
# 创建虚拟环境并进入虚拟环境
RUN virtualenv -p python3 venv
WORKDIR venv
RUN /bin/bash -c "source bin/activate"
# 代码和配置文件复制到容器里
COPY ./ball_attack_code .
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/cert /etc/nginx
COPY ./conf/redis.conf /etc/redis/redis.conf
# 运行项目
RUN chmod +x ./scripts/start.sh
CMD sh ./scripts/start.sh
