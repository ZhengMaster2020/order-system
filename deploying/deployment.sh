#!/bin/bash
deploy_queen1(){ # 同步远程主机后(保留十个版本)
         ssh $leave << eeooff
            cd $release
           /usr/bin/yarn install
           /usr/bin/yarn build-env-test
           /usr/bin/yarn build
          exit
eeooff
}

deploy_queen2(){ # 同步远程主句后
ssh $leave "/usr/sbin/lsof -i tcp:30002"
    if [ $? -ne 0 ];
    then
       ssh $leave "cd $release && /usr/bin/pm2 start npm --name "security-code" -- run starttest"
    else
       ssh $leave "cd $release && /usr/bin/pm2 delete dingtalk-lark && /usr/bin/pm2 start npm --name "security-code" -- run starttest"
    fi
#     ssh $leave "/usr/sbin/lsof -i tcp:2323 && if [ $? -eq 0 ]; then /usr/bin/pm2 restart dingtalk-lark; echo '开始npm'; /usr/bin/pm2 start npm --name "dingtalk-lark" -- run start; fi"
#      ssh $leave "/usr/sbin/lsof -i tcp:2323 && if [ $? -eq 0 ]; then /usr/bin/pm2 delete all; fi"
#      ssh $leave "cd $release && /usr/sbin/lsof -i tcp:2323 && if [ $? -ne 0 ]; then /usr/bin/pm2 start npm --name "dingtalk-lark" -- run start; /usr/bin/pm2 restart dingtalk-lark; fi"
#     ssh $leave "/usr/sbin/lsof -i tcp:2323 && if [ $? -ne 0 ]; then /usr/bin/pm2 start npm --name "dingtalk-lark" -- run start; fi"
}

deploy_queen3(){ 
    ssh $leave "ln -snf $release $code_dir/current && ls -lt $code_dir"  #脚本核心
    ssh $leave "cd $release_dir && ls -t | awk 'NR==5{print}' | xargs -i rm -rf {} && ls -lt $release_dir"
}
 

rollback(){ # 版本回滚操作
  echo '开始回滚'
  ssh $leave "cd $release_dir && ls -t |awk 'NR==2{print}' | xargs -i ln -snf $release_dir/{} $code_dir/current"
  if [ $? -ne 0 ]
   then
    echo "回滚失败！"
    exit 123
  fi
  ssh $leave "cd $release_dir && ls -t |awk 'NR==1{print}' | xargs -i rm -rf {}"
  echo '回滚到上一个版本成功'
}