#!/bin/bash
deploy_queen1(){ # 构建
    echo "开始构建"
   ssh $leave "cd $release && /usr/bin/yarn install && /usr/bin/yarn build-env-test && /usr/bin/yarn build"
   if [ $? -ne 0 ];
   then
     echo "构建失败"
     exit 123
   fi
}

deploy_queen2(){ # 同步远程主句后
  echo "启动项目"
  ssh $leave "/usr/sbin/lsof -i tcp:30002"
    if [ $? -ne 0 ];
    then
       ssh $leave "cd $release && /usr/bin/pm2 start npm --name \"security-code\" -- run starttest"
    else
       ssh $leave "cd $release && /usr/bin/pm2 delete \"security-code\" && /usr/bin/pm2 start npm --name \"security-code\" -- run starttest"
    fi
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