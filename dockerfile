# 镜像
FROM zzq10/ubuntu:python
# 镜像制作人信息
MAINTAINER zzq "17687952609@163.com"
# 设置时区
ENV TIME_ZONE Asia/Shanghai
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata \
    && ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata \
    && apt-get clean \
    && rm -rf /tmp/* /var/cache/* /usr/share/doc/* /usr/share/man/* /var/lib/apt/lists/*
# 配置pip源
RUN mkdir ~/.pip
RUN echo "[global] \n\
index-url = https://pypi.tuna.tsinghua.edu.cn/simple" > ~/.pip/pip.conf
# 创建父级目录
RUN mkdir /code
WORKDIR /code
# 安装python依赖包
COPY ./conf/requirements.txt /code
RUN pip3 install -r /code/requirements.txt
# 代码和配置文件复制到容器里
COPY ./ball_attack_code .
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/cert /etc/nginx
COPY ./conf/redis.conf /etc/redis/redis.conf
# 创建redis存储目录
RUN mkdir /data && chmod 777 /data
# 运行项目
RUN chmod +x ./scripts/start.sh
CMD sh ./scripts/start.sh
