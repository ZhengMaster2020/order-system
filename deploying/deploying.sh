#!/bin/bash
usage(){ # 使用帮助函数
    echo $"Usage: $0 [ deploy | rollback [ list | emergency | version ]"
}

writelog(){ # 写入日志的函数
    LOGINFO=$1 # 将参数作为日志输入
    echo "${CDATE} ${CTIME} : ${SEHLL_NAME} : ${LOGINFO}" >> ${SHELL_LOG}
}

# 锁函数
shell_lock(){
    touch deploy.lock
    echo "锁的建立"
}


hell_unlock(){
    rm -f deploy.lock
    echo "解锁完成"
}

npm(){ # composer和前端依赖代码更新依赖
   echo "下载yarn依赖"
   /usr/bin/yarn install
   echo "更新build操作"
#   /usr/bin/yarn build
#    /usr/bin/npm run build
}

if_judge(){ # 判断上个函数执行结果
     if [ $? -ne 0 ]
     then
        echo "更新有错误"
        hell_unlock
        exit 123
     fi
}

deploy_front(){ # 同步到远程主机前的操作
 echo "同步远程主机的cp操作"
ssh $leave "cd $release_dir && ls -t | head -1 | xargs -i cp -rf {} $release"

if [ $? -ne 0 ]
   then
      echo "cp原版本没有成功,请重新检查"
      ssh $leave "rm -rf $release"
      exit 123
 fi
}
   
deploy(){ # 同步远程主机
     #ssh $leave "cd $release_dir && ls -t | head -1 | xargs -i cp -rf {} $release"
     rsync -azvtruP --delete ./* $leave:$release
#     ssh $leave "cd $release && pm2 restart dingtalk-lark.fandow.com"
   if [ $? -ne 0 ]
   then
      ssh $leave "rm -rf $release"
      hell_unlock
      exit 123
   fi

}