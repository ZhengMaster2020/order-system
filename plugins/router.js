export default [{
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
            { path: 'anti-channel-conflict/cooperation', title: '合作商管理', name: 'anti-channel-conflict/cooperation' },
            { path: 'anti-channel-conflict/factories-management', title: '加工厂管理', name: 'anti-channel-conflict/factories-management' },
            {
                path: 'anti-channel-conflict/account-management/account-management',
                title: '账号管理',
                name: 'anti-channel-conflict/account-management/account-management'
            },
            {
                path: 'anti-channel-conflict/order-management',
                title: '订单管理',
                name: 'anti-channel-conflict/order-management'
            }
        ]
    }
]