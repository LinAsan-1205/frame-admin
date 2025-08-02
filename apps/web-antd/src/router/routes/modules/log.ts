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
        name: 'Login',
        path: '/log/login',
        component: () => import('#/views/log/login/index.vue'),
        meta: {
          icon: 'ant-design:user-outlined',
          title: $t('page.log.loginLog'),
        },
      },
      {
        name: 'Operation',
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
