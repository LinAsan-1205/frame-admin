import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:package',
      order: 10,
      title: $t('page.content-management.title'),
    },
    name: 'ContentManagement',
    path: '/content-management',
    children: [
      {
        name: 'ProductCategory',
        path: '/content-management/product-category',
        component: () =>
          import('#/views/content-management/product-category/index.vue'),
        meta: {
          icon: 'lucide:folder-tree',
          title: $t('page.content-management.productCategory'),
        },
      },
      {
        name: 'ProductContent',
        path: '/content-management/product-content',
        component: () =>
          import('#/views/content-management/product-content/index.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: $t('page.content-management.productContent'),
        },
      },
    ],
  },
];

export default routes;
