import { defineOverridesPreferences } from '@vben/preferences';

import defaultAvatar from '#/assets/images/user/avatar.png';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    authPageLayout: 'panel-center',
    defaultHomePath: '/workspace',
    defaultAvatar,
    layout: 'header-mixed-nav',
  },
  logo: {
    enable: true,
    source: defaultAvatar,
  },
  sidebar: {
    width: 200,
  },
  theme: {
    mode: 'light',
    semiDarkSidebar: false,
  },
  footer: {
    enable: true,
  },
  copyright: {
    companyName: 'frame-admin',
    companySiteLink: 'https://www.linasan.cn',
    date: '2025',
  },
});
