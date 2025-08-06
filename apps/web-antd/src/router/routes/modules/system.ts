import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 80,
      title: $t('system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        meta: {
          icon: 'ant-design:user-outlined',
          title: $t('system.user.title'),
        },
        component: () => import('#/views/system/user/index.vue'),
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        meta: {
          icon: 'mdi:account-group',
          title: $t('system.role.title'),
        },
        component: () => import('#/views/system/role/index.vue'),
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        meta: {
          icon: 'mdi:menu',
          title: $t('system.menu.title'),
        },
        component: () => import('#/views/system/menu/index.vue'),
      },
      {
        path: '/system/dept',
        name: 'SystemDept',
        meta: {
          icon: 'charm:organisation',
          title: $t('system.dept.title'),
        },
        component: () => import('#/views/system/dept/index.vue'),
      },
      {
        path: '/system/file/storage',
        name: 'SystemFileStorage',
        meta: {
          icon: 'ant-design:file-outlined',
          title: $t('system.storage.title'),
        },
        redirect: '/system/file/storage/config',
        children: [
          {
            path: '/system/file/storage/config',
            name: 'SystemFileStorageConfig',
            meta: {
              icon: 'charm:organisation',
              title: $t('system.storageConfig.title'),
            },
            component: () => import('#/views/system/storage/config/index.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
