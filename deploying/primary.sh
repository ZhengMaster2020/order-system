#!/bin/bash
# shell env 脚本位置等变量
SHELL_NAME="securitydeploy.sh"    # 脚本名称
SHELL_DIR="./deploying"  # 脚本路径
SHELL_LOG="${SHELL_DIR}/${SHELL_NAME}.log" # 脚本执行日志文件路径
# 日志日期和时间变量
LOG_DATE=`date "+%Y-%m-%d"` # 如果执行的话后面执行的时间，此时间是不固定的，这是记录日志使用的时间
LOG_TIME=`date "+%H-%M-%S"`

# 代码打包时间变量
CDATE=$(date "+%Y-%m-%d") # 脚本一旦执行就会取一个固定时间赋值给变量，此时间是固定的
CTIME=$(date +"%H-%M-%S")

#项目及本地目录
deploy_name=security-code.fandow.com
local_dir=/var/lib/jenkins/workspace/security-code

#需要部署的远程主句
leave="www@120.26.240.150"

#远程主机的目录
code_dir=/home/wwwroot/$deploy_name/
release_dir=/home/wwwroot/$deploy_name/releases
release=/home/wwwroot/$deploy_name/releases/$deploy_name-$LOG_DATE-$LOG_TIME

sourcefunction(){
    source ./deploying/deploying.sh
    source ./deploying/deployment.sh
}
source200(){
    leave="www@192.168.1.200"
    sourcefunction
}
main(){
    DEPLOY_METHOD=$1 # 避免出错误将脚本的第一个参数作为变量
    ROLLBACK_VER=$2
    case $DEPLOY_METHOD in
        deploy) # 99测试部署流程
             sourcefunction; # 生效99环境变量的方法
             shell_lock;# 建立锁
             npm; # 本地解决依赖
             #deploy_front; # 同步前的复制
             deploy;  # 同步代码到远程服务器
             deploy_queen1; # 部署构建流程
             deploy_queen2; # 启动服务
             deploy_queen3; # 脚本核心
             shell_unlock; # 删除锁
            ;;
        betadeploy) # 200服务器部署
             source200;
             shell_lock;
             npm;
             #deploy_front;
             deploy;
             deploy_queen1;
             deploy_queen2;
             deploy_queen3;
             shell_unlock;
            ;;
        rollback) # 99回滚
            sourcefunction;
            rollback;
            ;;
        betarollback) # 200回滚
            source200;
            rollback;
            ;;
        *)
            sourcefunction;
            usage;
    esac
}
main $1 $2