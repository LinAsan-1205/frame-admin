import { defineOverridesPreferences } from '@vben/preferences';

import logo from '#/assets/images/logo.png';
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
    authPageLayout: 'panel-right',
    defaultHomePath: '/workspace',
    defaultAvatar,
    layout: 'sidebar-mixed-nav',
    accessMode: 'mixed',
    enableCheckUpdates: true,
    checkUpdatesInterval: 1,
    enableRefreshToken: true,
  },
  logo: {
    enable: true,
    source: logo,
  },
  sidebar: {
    width: 200,
  },
  theme: {
    mode: 'light',
    semiDarkSidebar: false,
    builtinType: 'custom',
    colorPrimary: 'hsl(219 100% 34%)',
  },
  footer: {
    enable: true,
  },
  copyright: {
    companyName: 'frame-admin',
    companySiteLink: 'https://www.linasan.cn',
    date: '2025',
  },
  widget: {
    timezone: false,
  },
});
