import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ant-design:instagram-outlined',
      order: 90,
      title: $t('page.log.title'),
    },
    name: 'Log',
    path: '/log',
    children: [
      {
        name: 'LogLogin',
        path: '/log/login',
        component: () => import('#/views/log/login/index.vue'),
        meta: {
          icon: 'ant-design:login-outlined',
          title: $t('page.log.loginLog'),
        },
      },
      {
        name: 'LogOperation',
        path: '/log/operation',
        component: () => import('#/views/log/operation/index.vue'),
        meta: {
          icon: 'ant-design:file-search-outlined',
          title: $t('page.log.operationLog'),
        },
      },
    ],
  },
];

export default routes;
