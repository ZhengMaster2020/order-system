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
      { path: '/GET/channelStore', title: '渠道和店铺设置', name: 'inquire-anomaly-tracking/channel-store-settings' }
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
    path:'/inventory-management',
    icon:'ios-book',
    name:'/inventory-management',
    title:'盘点管理',
    children:[
      {path:'/GET/inventory-record',title:"盘点记录",name:'inventory-management/inventory-records'},
      {path:'/GET/inventory-management/{[a-z_]+}',title:'销毁记录',name:'inventory-management/destruction-records'},
      {path:'/GET/inventory-management/{[a-z_]+}',title:'回收记录',name:'inventory-management/recycling-records'}
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
  }
]
