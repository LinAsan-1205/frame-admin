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
      {
        name: 'ProductContentAdd',
        path: '/content-management/product-content/add',
        component: () =>
          import(
            '#/views/content-management/product-content/product-content-edit.vue'
          ),
        meta: {
          hideInMenu: true,
          icon: 'lucide:file-plus',
          title: $t('page.content-management.productContentAdd'),
        },
      },
      {
        name: 'ProductContentEdit',
        path: '/content-management/product-content/edit/:id',
        component: () =>
          import(
            '#/views/content-management/product-content/product-content-edit.vue'
          ),
        meta: {
          hideInMenu: true,
          icon: 'lucide:file-edit',
          title: $t('page.content-management.productContentEdit'),
        },
      },
    ],
  },
];

export default routes;
