export default {
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          name: 'welcome',
          icon: 'smile',
          component: './Welcome',
        },
        {
          path: '/template/dashboard/*',
          name: 'dashboard',
          icon: 'dashboard',
          routes: [
            {
              name: '分析页',
              path: '/template/dashboard/analysis',
              component: './template/dashboard/analysis',
            },
            {
              name: '监控页',
              path: '/template/dashboard/monitor',
              component: './template/dashboard/monitor',
            },
            {
              name: '工作台',
              path: '/template/dashboard/workplace',
              component: './template/dashboard/workplace',
            },
          ],
        },
        {
          path: '/template/list/*',
          name: '列表页',
          icon: 'table',
          routes: [
            {
              path: '/template/list/search/*',
              name: '搜索列表',
              routes: [],
            },
            {
              name: '查询表格',
              path: '/template/list/table-list',
              component: './template/list/table-list',
            },
            {
              name: '标准列表',
              path: '/template/list/basic-list',
              component: './template/list/basic-list',
            },
            {
              name: '卡片列表',
              path: '/template/list/card-list',
              component: './template/list/card-list',
            },
          ],
        },
        {
          path: '/template/profile/*',
          name: '详情页',
          icon: 'profile',
          routes: [
            {
              name: '基础详情页',
              path: '/template/profile/basic',
              component: './template/profile/basic',
            },
            {
              name: '高级详情页',
              path: '/template/profile/advanced',
              component: './template/profile/advanced',
            },
          ],
        },
        {
          path: '/config/*',
          name: '配置',
          icon: 'setting/',
          routes: [
            {
              path: '/config/finance/*',
              name: '财务',
              icon: 'pay-circle',
              routes: [
                {
                  name: '钱包分类',
                  path: '/config/finance/wallet-class-list',
                  component: './config/finance/wallet-class-list',
                },

              ],
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
};
