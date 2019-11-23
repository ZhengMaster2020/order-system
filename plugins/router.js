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
    path: '/account-management',
    icon: 'ios-book',
    name: '/account-management',
    title: '账号管理',
    children: [
      { path: 'account-management/account-management', title: '账号管理', name: 'account-management/account-management' }
    ]
  }
]
