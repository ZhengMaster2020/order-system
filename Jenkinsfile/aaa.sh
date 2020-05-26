#!/bin/bash
pm2=`type -p pm2`
sitename=$1
service_pid=`$pm2 pid ${sitename}`
if [ $service_pid -ge 0 ];then
    $pm2 del $sitename
    $pm2 start npm --name "${sitename}" -- run starttest
    if [ $? -eq 0 ];then
        echo "服务启动成功"
    else
        echo "服务启动失败"
        exit 123
    fi
else
    $pm2 start npm --name "${sitename}" -- run starttest && echo "启动服务成功"
    if [ $? -eq 0 ];then
        echo "服务启动成功"
    else
        echo "服务启动失败"
        exit 123
    fi
fi
pwd
rm -rf ./mkp_node_jenkinsfile
if [ $? -eq 0 ];then
    echo "mkp_node_jenkinsfile脚本目录已删除"
else
    echo "删除失败，没有mkp_node_jenkinsfile这个文件夹，或者你没有权限对这个目录操作权限"
fi
