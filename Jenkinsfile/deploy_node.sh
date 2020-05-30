#!/bin/bash -ilex
#author:rochel
#version_3.0
#time:20200520

#使用该脚本前提
#1.目标主机已安装node、pm2、yarn工具
#2.jenkins已经将ssh-key发往目标主机

set -e

if [[ $status == "product" ]] || [[ $status == "rollback_product" ]];then
    leave=$leave_product

    #目标主机目录变量
    #sitename=${JOB_NAME} 
    sitebasedir=/data/wwwroot/${sitename}/front-end
    releasesdir=${sitebasedir}/releases

    #获取发布版本的时间戳
    uptime=${sitename}_${date_time}_$BRANCH_TAG
elif [[ $status == "test" ]] || [[ $status == "rollback_test" ]];then
    leave=$leave_test
	
    #目标主机目录变量
    #sitename=${JOB_NAME}
    sitebasedir=/home/wwwroot/${sitename}/front-end
    releasesdir=${sitebasedir}/releases
	
	#获取发布版本的时间戳
    uptime=${sitename}_${date_time}
else
    leave=$leave_beta
	
    #目标主机目录变量
    #sitename=${JOB_NAME}
    sitebasedir=/home/wwwroot/${sitename}/front-end
    releasesdir=${sitebasedir}/releases

    #获取发布版本的时间戳
    uptime=${sitename}_${date_time}
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
    if [ $deploy_env == "rollback_product" ];then
        #指定回滚版本名称
        rollback_tag=`ssh $leave "/bin/find ${releasesdir} -type d -name "${sitename}_*_${BRANCH_TAG}""`
        
        #是否有回滚的版本
        tag_num=`ssh $leave "/bin/find ${releasesdir} -type d -name "${sitename}_*_${BRANCH_TAG}" 2>/dev/null | /bin/wc -l"`
        
        #判断如果该tag没有找到则认为回退的版本不存在
        if [ $tag_num == 1 ];then
            echo "开始回滚操作"
            $rsync -avzP ${srcipts_dir} $leave:${rollback_tag} > /dev/null 2>&1
        else
            echo "回滚版本不存在，请确认是否有该版本"
            exit 123
        fi
    else
        #获取回滚服务文件名
        bbb=`ssh -T $leave "ls -t ${releasesdir} | awk 'NR==2{print}' "`
        ccc=`ssh -T $leave "ls -t ${releasesdir} | awk 'NR==1{print}' "`
        echo "同步脚本"
        $rsync -avzP ${srcipts_dir} $leave:${releasesdir}/${bbb} > /dev/null 2>&1
    fi
}

update_site(){
    ssh -T $leave << eeooff
    cd ${releasesdir}/${uptime}
	###$sed -i 's/30005/30010/g' ./server/index.js && echo "端口替换成功"
    #安装依赖包
    $yarn install
    if [ $? -ne 0 ];then
        echo "$yarn install依赖包安装失败"
        exit 123
	else
	    echo "$yarn install依赖包安装成功"
    fi
    if [ ${deploy_env} == "product" ];then
        #生产
        $yarn build-env
        if [ $? -ne 0 ];then
		    echo "$yarn build-env失败"
			exit 123
		else
		    echo "$yarn build-env成功"
		fi
    elif [ ${deploy_env} == "test" ] || [ ${deploy_env} == "beta" ];then
        #测试
        $yarn build-env-test
		if [ $? -ne 0 ];then
		    echo "$yarn build-env-test失败"
			exit 123
		else
		    echo "$yarn build-env-test完成"
		fi
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

    #${scripts_name3}脚本作用：先判断服务pid存不存在，存在停掉服务、删掉服务，然后在启动新的服务；不存在直接启动新服务
    sh ${releasesdir}/${uptime}/${srcipts_dir_name}/${scripts_name3} ${sitename} ${scripts_name1} ${deploy_env}
     
    #切换软链到current目录下
    ln -snf ${releasesdir}/${uptime}  ${sitebasedir}/current && echo "切换current软链成功" || echo "切换current软链失败"

    if [ ${deploy_env} == "product" ];then
        echo "保留版本数"
        cd ${releasesdir} && ls -t  | awk 'NR==7{print}' | xargs -i rm -rf {} && ls -lt ${releasesdir}
    else
        echo "保留版本数"
        cd ${releasesdir} && ls -t  | awk 'NR==4{print}' | xargs -i rm -rf {} && ls -lt ${releasesdir}
    fi
eeooff
}

rollback_beta_test(){
    ssh -T $leave << eeooff
    cd ${releasesdir}/${bbb}

    #测试
    $yarn build-env-test 
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

    #${scripts_name3}脚本作用：先判断服务pid存不存在，存在停掉服务、删掉服务，然后在启动新的服务；不存在直接启动新服务
    sh ${releasesdir}/${ccc}/${srcipts_dir_name}/${scripts_name3} ${sitename} ${scripts_name1} ${deploy_env} && echo "回滚上一个版本成功" || echo "回滚上一个版本失败"

    cd ${releasesdir}
    #直接回滚到上一个版本
    ls -t | awk 'NR==1{print}' | xargs -i ln -snf  ${releasesdir}/{} ${sitebasedir}/current
    ls -lt ${releasesdir}
eeooff
}

#线上环境版本回滚操作
rollback_product(){
    ssh -T $leave << eeooff
        cd ${sitebasedir}
        /bin/find ${releasesdir} -type d -name "$sitename_*_$BRANCH_TAG" | /bin/xargs -i /bin/ln -snf {} current
        cd ${sitebasedir}/current
        #生产
        $yarn build-env
        if [ $? -eq 0 ];then
            echo "$yarn build-env完成"  
        else
            echo "$yarn build-env失败"
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
        
        #${scripts_name3}脚本作用：先判断服务pid存不存在，存在停掉服务、删掉服务，然后在启动新的服务；不存在直接启动新服务
        sh ${sitebasedir}/current/${srcipts_dir_name}/${scripts_name3} ${sitename} ${scripts_name1} ${deploy_env} && echo "回滚${BRANCH_TAG}版本成功" || echo "回滚${BRANCH_TAG}失败"
eeooff
}

main(){
    deploy_env=$1
    #BRANCH_TAG=$2
    case $1 in
        beta)
            echo "更新开发环境"
            init_dir  #初始化代码目录
            deploy  #同步代码到目标主机
            update_site  #更新代码
        ;;
        test)
            echo "更新测试环境"
            init_dir  #初始化代码目录
            deploy  #同步代码到目标主机
            update_site  #更新代码
        ;;
        product)   
            echo "更新生产环境"
            init_dir
            deploy
            update_site  
        ;;
        rollback_beta)
            echo "开发环境回滚上一个版本"
            rollback_env  #判断回滚环境并且同步脚本过去
            rollback_beta_test  #开发环境回滚
        ;;
        rollback_test)
            echo "测试回滚上一个版本"
            rollback_env  #判断回滚环境并且同步脚本过去
            rollback_beta_test  #测试回滚
        ;;
        rollback_product)
            echo "线上回滚指定版本"
            rollback_env
            rollback_product  #生产回滚
        ;;
        *)
            usage;
    esac
}
main $1