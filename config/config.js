import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          name: 'analysis',
          path: '/template/dashboard/analysis',
          component: './template/dashboard/analysis',
          hideInMenu: true,
        },
        {
          name: 'monitor',
          path: '/template/dashboard/monitor',
          component: './template/dashboard/monitor',
          hideInMenu: true,
        },
        {
          name: 'workplace',
          path: '/template/dashboard/workplace',
          component: './template/dashboard/workplace',
          hideInMenu: true,
        },
        {
          name: 'table-list',
          path: '/template/list/table-list',
          component: './template/list/table-list',
          hideInMenu: true,
        },
        {
          name: 'basic-list',
          path: '/template/list/basic-list',
          component: './template/list/basic-list',
          hideInMenu: true,
        },
        {
          name: 'card-list',
          path: '/template/list/card-list',
          component: './template/list/card-list',
          hideInMenu: true,
        },
        {
          name: 'basic',
          path: '/template/profile/basic',
          component: './template/profile/basic',
          hideInMenu: true,
        },
        {
          name: 'advanced',
          path: '/template/profile/advanced',
          component: './template/profile/advanced',
          hideInMenu: true,
        },
        {
          path: '/',
          name: 'welcome',
          icon: 'smile',
          component: './Welcome',
        },
        {
          path: '/template/dashboard',
          name: 'dashboard',
          icon: 'dashboard',
          children: [
            {
              name: '分析页',
              path: '/template/dashboard/analysis',
              exact: true,
            },
            {
              name: '监控页',
              path: '/template/dashboard/monitor',
              exact: true,
            },
            {
              name: '工作台',
              path: '/template/dashboard/workplace',
              exact: true,
            },
          ],
        },
        {
          path: '/template/list',
          name: '列表页',
          icon: 'dashboard',
          children: [
            {
              name: '查询表格',
              path: '/template/list/table-list',
              exact: true,
            },
            {
              name: '标准列表',
              path: '/template/list/basic-list',
              exact: true,
            },
            {
              name: '卡片列表',
              path: '/template/list/card-list',
              exact: true,
            },
          ],
        },
        {
          path: '/template/profile',
          name: '详情页',
          icon: 'dashboard',
          children: [
            {
              name: '基础详情页',
              path: '/template/profile/basic',
              exact: true,
            },
            {
              name: '高级详情页',
              path: '/template/profile/advanced',
              exact: true,
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
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
};
