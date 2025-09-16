import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    path: '/system/config',
    name: 'SystemConfig',
    // component: LAYOUT,
    redirect: '/system/config/tree',
    meta: {
      title: $t('system.config.title'),
      icon: 'ri:settings-3-line',
      orderNo: 30,
    },
    children: [
      {
        path: 'tree',
        name: 'SystemConfigTree',
        component: () => import('#/views/system/config/index.vue'),
        meta: {
          title: $t('system.config.tree.title'),
          icon: 'ri:node-tree',
        },
      },
    ],
  },
];

export default routes;
