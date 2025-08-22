import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      hideInMenu: true,
      icon: 'ant-design:user-outlined',
      order: 1000,
      title: $t('page.user.title'),
    },
    name: 'User',
    path: '/user/profile',
    children: [
      {
        name: 'UserProfile',
        path: '/user/profile',
        component: () => import('#/views/user/profile.vue'),
        meta: {
          icon: 'ant-design:user-outlined',
          title: $t('page.user.profile'),
        },
      },
    ],
  },
];

export default routes;
