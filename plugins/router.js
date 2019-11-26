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
    path: '/anti-stock',
    icon: 'ios-book',
    name: '/anti-stock',
    title: '防串货',
    children: [
      { path: 'anti-stock/cooperation', title: '合作商管理', name: 'anti-stock/cooperation' }
    ]
  }
]
