export default [
  {
    path: '/security-code',
    icon: 'ios-book',
    name: '/security-code',
    title: '防伪码',
    children: [
      // { path: 'security-code/management', title: '防伪码管理', name: 'security-code/management' },
      { path: 'security-code/search-code', title: '防伪码查询', name: 'security-code/search-code' }
    ]
  },
  {
    path: '/production-plan-management',
    icon: 'ios-book',
    name: '/production-plan-list',
    title: '生产计划管理',
    children: [
      { path: 'production-plan-management/production-plan-list', title: '生产计划列表', name: 'production-plan-management/production-plan-list' },
      { path: 'production-plan-management/production-prenatal-batch-list', title: '生产批次列表', name: 'production-plan-management/production-prenatal-batch-list' }
    ]
  },
  {
    path: '/inquire-anomaly-tracking',
    icon: 'ios-book',
    name: '/inquire-anomaly-tracking',
    title: '查询及异常追踪',
    children: [
      { path: 'inquire-anomaly-tracking/FQA-setting', title: '常见问题设置', name: 'inquire-anomaly-tracking/FQA-setting' },
      { path: 'inquire-anomaly-tracking/channel-store-settings', title: '渠道和店铺设置', name: 'inquire-anomaly-tracking/channel-store-settings' }
    ]
  },
  {
    path:'/inventory-management',
    icon:'ios-book',
    name:'/niventory-management',
    title:'盘点管理',
    children:[
      {path:'inventory-management/inventory-records',title:"PDJL盘点记录",name:'inventory-management/inventory-records'}
    ]
  }
  // {
  //   path: '/anti-channel-conflict',
  //   icon: 'ios-book',
  //   name: '/anti-channel-conflict',
  //   title: '防串货',
  //   children: [
  //     { path: 'anti-channel-conflict/cooperation', title: '合作商管理', name: 'anti-channel-conflict/cooperation' },
  //     { path: 'anti-channel-conflict/factories-management', title: '加工厂管理', name: 'anti-channel-conflict/factories-management' },
  //     {
  //       path: 'anti-channel-conflict/account-management/account-management',
  //       title: '账号管理',
  //       name: 'anti-channel-conflict/account-management/account-management'
  //     },
  //     {
  //       path: 'anti-channel-conflict/order-management',
  //       title: '订单管理',
  //       name: 'anti-channel-conflict/order-management'
  //     },
  //     {
  //       path: 'anti-channel-conflict/store-management/store-management',
  //       title: '仓库管理',
  //       name: 'anti-channel-conflict/store-management/store-management'
  //     },
  //     { path: 'anti-channel-conflict/box-code-mangement', title: '箱码管理', name: 'anti-channel-conflict/box-code-mangement' },
  //     {
  //       path: 'anti-channel-conflict/logistics-management',
  //       title: '物流管理',
  //       name: 'anti-channel-conflict/logistics-management',
  //       children: [
  //         { path: 'anti-channel-conflict/logistics-management/box-code-query', title: '箱码查询', name: 'anti-channel-conflict/logistics-management/box-code-query' },
  //         { path: 'anti-channel-conflict/logistics-management/product-code-query', title: '产品码查询', name: 'anti-channel-conflict/logistics-management/product-code-query' }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   path: '/notebook',
  //   icon: 'ios-book',
  //   name: '/notebook',
  //   title: '使用手册',
  //   children: [
  //     { path: 'notebook/notebook', title: '使用手册', name: 'notebook/notebook' }
  //   ]
  // }
]
