#!/bin/bash -ilex
#author:rochel
#version_3.0
#time:20200520

set -e


if [[ $status == "test" ]] || [[ $status == "rollback_test" ]];then
    leave=$leave_test
else
    leave=$leave_product
fi


# 使用帮助函数
usage(){ 
    echo $"Usage: $0 [ test | product | rollback_test | rollback_product [ list | emergency | version ]"
}

init_dir(){
    ssh $leave "[ ! -d ${releasesdir} ] && mkdir -p ${releasesdir} ||  echo "目录已存在""
}

deploy(){
    #将拉取的最新代码传到$release
    echo "开始同步代码到目标主机"
    $rsync  -avzP --exclude=.git ./* $leave:${releasesdir}/${uptime} > /dev/null 2>&1
    if [ $? -ne 0 ]
    then
        ssh $leave "rm -rf ${releasesdir}/${uptime}"
        exit 123
    fi
}

rollback_env(){
    if [ $deploy_env == "rollback_test" ];then
        $rsync -avzP ./mkp_node_jenkinsfile $leave_test:${sitebasedir}/current > /dev/null 2>&1
    elif [ $deploy_env == "rollback_product" ];then
        $rsync -avzP ./mkp_node_jenkinsfile $leave_product:${sitebasedir}/current > /dev/null 2>&1
    else
        echo "请输入回滚的环境"
		exit 123
    fi
}

update_site(){
    ssh -T $leave << eeooff
    cd ${releasesdir}/${uptime}
    ####$sed -i 's/30005/30006/g' ./server/index.js && echo "端口替换成功"
    #安装依赖包
    $yarn install > /dev/null && echo "$yarn install依赖包安装成功"
    if [ $? -ne 0 ]
    then
        echo "$yarn install依赖包安装失败"
        exit 123
    fi
    if [ ${deploy_env} == "product" ];then
        #生产
        $yarn build-env > /dev/null 2>&1 && echo "$yarn build-env完成"  || echo "$yarn build-env失败"
    elif [ ${deploy_env} == "test" ];then
        #测试
        $yarn build-env-test > /dev/null 2>&1 && echo "$yarn build-env-test完成"  ||   echo "$yarn build-env-test失败"
    else
        echo "$deploy_env参数有误，请重新选择"
    fi

    #构建项目
    $yarn build > /dev/null 2>&1
    if [ $? -eq 0 ];then
        echo "$yarn build完成"
    else
        echo "$yarn build失败"
        exit 123
    fi

    #aaa.sh脚本作用：先判断服务pid存不存在，存在停掉服务、删掉服务，然后在启动新的服务；不存在直接启动新服务
    sh -x ${releasesdir}/${uptime}/mkp_node_jenkinsfile/aaa.sh ${sitename}
     
    #切换软链到current目录下
    ln -snf ${releasesdir}/${uptime}  ${sitebasedir}/current && echo "切换current软链成功" || echo "切换current软链失败"

    echo "保留版本数"
    cd ${releasesdir} && ls -t  | awk 'NR==6{print}' | xargs -i rm -rf {} && ls -lt ${releasesdir}
    #if [ $status == "product" ];then
    #    cd ${releasesdir} && ll -lt | awk 'NR>7{print $NF}' | xargs -i rm -rf {}  && ls -lt ${releasesdir}
    #esle
    #    cd ${releasesdir} && ll -lt | awk 'NR>4{print $NF}' | xargs -i rm -rf {}  && ls -lt ${releasesdir}
    #fi
eeooff
}

rollback_test(){
    #获取回滚服务文件名
    bbb=`ssh -T $leave "ls -t ${releasesdir} | awk 'NR==2{print}' "`
    
    ssh -T $leave << eeooff
    cd ${releasesdir}/${bbb}

    #测试
    $yarn build-env-test > /dev/null 2>&1 
    if [ $? -eq 0 ];then
        echo "$yarn build-env-test完成"  
    else
        echo "$yarn build-env-test失败"
	exit 123
    fi

    #构建项目
    $yarn build > /dev/null 2>&1
    if [ $? -eq 0 ];then
        echo "$yarn build完成"
    else
        echo "$yarn build失败"
        exit 123
    fi

    #aaa.sh脚本作用：先判断服务pid存不存在，存在停掉服务、删掉服务，然后在启动新的服务；不存在直接启动新服务
    sh ${sitebasedir}/current/mkp_node_jenkinsfile/aaa.sh ${sitename} && echo "回滚上一个版本成功" || echo "回滚上一个版本失败"

    cd ${releasesdir}
    #直接回滚到上一个版本
    ls -t | awk 'NR==1{print}' | xargs -i ln -snf  ${releasesdir}/{} ${sitebasedir}/current
    ls -lt ${releasesdir}
eeooff
}

main(){
    deploy_env=$1
    #BRANCH_TAG=$2
    case $1 in
        test)
            echo "更新测试环境"
            init_dir
            deploy
            update_site  #更新代码
        ;;
        product)   
            echo "更新生产环境"
            init_dir
            deploy
            update_site  #更新代码   
        ;;
        rollback_test)
            echo "测试回滚上一个版本"
            rollback_env  #判断回滚环境并且同步脚本过去
            rollback_test  #测试回滚
        ;;
        rollback_product)
            echo "线上回滚上一个版本"
            rollback_env 
            rollback_product  #生产回滚
        ;;
        *)
            usage;
    esac
}

main $1
