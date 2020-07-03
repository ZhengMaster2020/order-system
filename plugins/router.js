export default [
  {
    path: '/security-code',
    icon: 'ios-book',
    name: '/security-code',
    title: '防伪码',
    children: [
      // { path: 'security-code/management', title: '防伪码管理', name: 'security-code/management' },
      { path: '/GET/securityCodeQuery/new', title: '防伪码查询', name: 'security-code/search-code' }
    ]
  },
  {
    path: '/production-plan-management',
    icon: 'ios-book',
    name: '/production-plan-list',
    title: '生产计划管理',
    children: [
      { path: '/GET/productionPlan', title: '生产计划列表', name: 'production-plan-management/production-plan-list' },
      { path: '/GET/productionBatch', title: '生产批次列表', name: 'production-plan-management/production-prenatal-batch-list' }
    ]
  },{
    path: '/outbound-management',
    icon: 'ios-book',
    name: '/outbound-management',
    title: '出库管理',
    children: [
      { path: '/GET/outbound-apply/index', title: '出库申请单', name: 'outbound-management/CKSQ-outbound-application' }
    ]
  },
  {
    path: '/inquire-anomaly-tracking',
    icon: 'ios-book',
    name: '/inquire-anomaly-tracking',
    title: '查询及异常追踪',
    children: [
      { path: '/GET/FAQ', title: '常见问题设置', name: 'inquire-anomaly-tracking/FQA-setting' },
      { path: '	/GET/channelStore', title: '渠道和店铺设置', name: 'inquire-anomaly-tracking/channel-store-settings' }
    ]
  },
  {
    path: '/storage-management',
    icon: 'ios-book',
    name: '/storage-management',
    title: '入库管理',
    children: [
      { path: '/GET/put-in-storage-apply', title: '入库申请单', name: 'storage-management/storage-application' }
    ]
  },
  {
    path: '/setting',
    icon: 'ios-settings',
    name: '/setting',
    title: '设置',
    children: [
      {
        path: '/GET/userMenu/admin',
        title: '权限管理',
        name: 'setting/permission',
      }
    ]
  },
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
