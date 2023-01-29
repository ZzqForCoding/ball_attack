#! /bin/bash

docker run \
    -p 20000:22 \
    -p 20001:80 \
    -p 20002:443 \
    --name ball_attack \
    -v /home/zzq/ball_attack/ball_attack_code:/ball_attack \
    -v /home/zzq/ball_attack/conf/nginx.conf:/etc/nginx/nginx.conf \
    -v /home/zzq/ball_attack/conf/cert:/etc/nginx/cert \
    -v /home/zzq/ball_attack/conf/redis.conf:/etc/redis/redis.conf \
    -itd zzq10/ubuntu:ball_attack
