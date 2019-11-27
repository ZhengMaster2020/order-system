export default [
  {
    path: '/security-code',
    icon: 'ios-book',
    name: '/security-code',
    title: '防伪码',
    children: [
      { path: 'security-code/management', title: '防伪码管理', name: 'security-code/management' },
      { path: 'security-code/search-code', title: '防伪码查询', name: 'security-code/search-code' }
    ]
  },
  {
    path: '/anti-channel-conflict',
    icon: 'ios-book',
    name: '/anti-channel-conflict',
    title: '防串货',
    children: [
      {
        path: 'anti-channel-conflict/logistics-management',
        title: '物流管理',
        name: 'anti-channel-conflict/logistics-management',
        children: [
          { path: 'anti-channel-conflict/logistics-management/box-code-query', title: '箱码查询', name: 'anti-channel-conflict/logistics-management/box-code-query' },
          { path: 'anti-channel-conflict/logistics-management/product-code-query', title: '产品码查询', name: 'anti-channel-conflict/logistics-management/product-code-query' }
        ]
      }
    ]
  }
]
