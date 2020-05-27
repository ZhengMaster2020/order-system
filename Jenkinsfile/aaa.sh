#!/bin/bash
pm2=`type -p pm2`
sitename=$1
srcipts_dir=$2
deploy_env=$3
service_pid=`$pm2 pid ${sitename}`

if [[ $deploy_env == "test" ]] || [[ $deploy_env == "rollback_test" ]];then
    status=starttest
else
    status=start
fi
if [ $service_pid -ge 0 ];then
    $pm2 del $sitename
    $pm2 start npm --name "${sitename}" -- run ${status}
    if [ $? -eq 0 ];then
        echo "服务启动成功"
    else
        echo "服务启动失败"
        exit 123
    fi
else
    $pm2 start npm --name "${sitename}" -- run ${status} && echo "启动服务成功"
    if [ $? -eq 0 ];then
        echo "服务启动成功"
    else
        echo "服务启动失败"
        exit 123
    fi
fi
pwd
rm -rf ${srcipts_dir}
if [ $? -eq 0 ];then
    echo "${srcipts_dir}脚本目录已删除"
else
    echo "删除失败，没有${srcipts_dir}这个文件夹，或者你没有权限对这个目录操作权限"
fi
