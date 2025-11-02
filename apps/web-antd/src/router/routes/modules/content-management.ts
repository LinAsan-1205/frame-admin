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
      {
        name: 'JoinUs',
        path: '/content-management/join-us',
        component: () => import('#/views/content-management/join-us/index.vue'),
        meta: {
          icon: 'lucide:users',
          title: $t('page.content-management.joinUs'),
        },
      },
      {
        name: 'JoinUsAdd',
        path: '/content-management/join-us/add',
        component: () =>
          import('#/views/content-management/join-us/join-us-edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'lucide:user-plus',
          title: $t('page.content-management.joinUsAdd'),
        },
      },
      {
        name: 'JoinUsEdit',
        path: '/content-management/join-us/edit/:id',
        component: () =>
          import('#/views/content-management/join-us/join-us-edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'lucide:user-cog',
          title: $t('page.content-management.joinUsEdit'),
        },
      },
      {
        name: 'ContactUs',
        path: '/content-management/contact-us',
        component: () =>
          import('#/views/content-management/contact-us/index.vue'),
        meta: {
          icon: 'lucide:mail',
          title: $t('page.content-management.contactUs'),
        },
      },
    ],
  },
];

export default routes;
