# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是 frame-admin 的 web-antd 应用，基于 Vue Vben Admin 5.0 构建的企业级中后台前端应用。使用 Ant Design Vue 作为 UI 组件库，采用 Vue 3 + Composition API + TypeScript + Vite 技术栈。

## 常用命令

### 开发命令

- `pnpm dev` - 启动开发服务器（默认端口 5666）
- `pnpm build` - 构建生产版本
- `pnpm build:analyze` - 构建并生成打包分析报告
- `pnpm preview` - 预览构建后的应用
- `pnpm typecheck` - 执行 TypeScript 类型检查

### 环境配置

- 开发环境：`.env.development`（API: http://127.0.0.1:7002/api，端口5666）
- 生产环境：`.env.production`（hash路由，支持压缩和PWA）
- 分析模式：`.env.analyze`

## 项目架构

### 核心目录结构

```
src/
├── adapter/           # 组件适配器（Ant Design Vue 适配）
│   ├── component/     # 组件适配器配置
│   ├── form.ts       # 表单组件适配器
│   ├── renderer/     # 渲染器适配器
│   └── vxe-table.ts  # VXE Table 适配器
├── api/              # API 接口层
│   ├── auth/         # 认证相关接口
│   ├── core/         # 核心接口
│   ├── log/          # 日志接口
│   ├── schedule/     # 调度接口
│   ├── system/       # 系统管理接口
│   └── request.ts    # 请求客户端配置
├── components/       # 应用级组件
├── layouts/          # 布局组件
├── router/           # 路由配置
│   └── routes/modules/ # 模块化路由定义
├── store/            # 状态管理
├── views/            # 页面组件
│   ├── _core/        # 核心页面
│   ├── dashboard/    # 仪表板（工作台）
│   ├── log/          # 日志管理
│   ├── schedule/     # 调度管理
│   ├── system/       # 系统管理
│   └── user/         # 用户管理
├── app.vue           # 根组件
├── bootstrap.ts      # 应用启动配置
├── main.ts           # 应用入口
└── preferences.ts    # 应用偏好设置
```

### 技术栈与依赖

- **UI 组件库**: Ant Design Vue 4.x
- **表格组件**: VXE Table (vxe-table + vxe-pc-ui)
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: 基于 @vben/request 的 requestClient
- **表单验证**: VeeValidate + Zod
- **工具库**: VueUse、dayjs、lodash
- **构建工具**: Vite + @vben/vite-config

### 核心功能模块

#### 1. 认证系统 (src/api/core/auth.ts)

- 登录/登出：`loginApi`、`logoutApi`
- Token 刷新：`refreshTokenApi`
- 权限码获取：`getAccessCodesApi`

#### 2. 路由系统

- 模块化路由定义 (`src/router/routes/modules/`)
- 动态路由权限控制
- 默认主页：`/workspace`

#### 3. 应用配置 (src/preferences.ts)

- 布局模式：`sidebar-mixed-nav`
- 权限模式：`mixed`
- 主题配置：支持亮色/暗色切换
- 侧边栏宽度：200px

#### 4. 组件适配器系统

- 统一管理不同 UI 库的适配逻辑
- VXE Table 集成配置
- 表单组件适配器

### 开发指南

#### 路径别名

- `#/*` -> `./src/*` (应用内部文件)

#### API 开发模式

- 开发环境启用 Nitro Mock 服务 (`VITE_NITRO_MOCK=true`)
- 生产环境使用相对路径 API

#### 页面组件开发

1. 在 `src/views/` 对应模块目录下创建页面组件
2. 在 `src/router/routes/modules/` 添加路由定义
3. 使用 `$t()` 进行国际化文本处理
4. 遵循组件化开发，复用 `src/components/` 中的业务组件

#### 样式开发

- 使用 TailwindCSS 进行样式开发
- 主题色：`hsl(219 100% 34%)`
- 支持半暗色侧边栏模式

### 构建与部署

- 生产构建会自动生成 `dist.zip` 压缩包
- 支持打包分析模式查看依赖大小
- 生产环境使用 hash 路由模式

## 开发规范

### 代码规范配置

项目使用统一的 @vben 系列配置包：

- **ESLint**: `@vben/eslint-config` - TypeScript、Vue、常见最佳实践规则
- **Prettier**: `@vben/prettier-config` - 代码格式化规则
- **Stylelint**: `@vben/stylelint-config` - CSS/SCSS 样式规范
- **CommitLint**: `@vben/commitlint-config` - Git 提交信息规范
- **TypeScript**: `@vben/tsconfig/web-app.json` - TS 编译配置

### 文件命名规范

- **组件文件**: 使用 PascalCase，如 `UserBlock.vue`
- **页面文件**: 使用 kebab-case，如 `user-list.vue` 或 `index.vue`
- **工具文件**: 使用 camelCase，如 `userUtils.ts`
- **类型文件**: 使用 camelCase，如 `types.ts`、`enum.ts`
- **API文件**: 使用 camelCase，如 `user.ts`、`auth.ts`

### 目录结构规范

```
src/
├── api/模块名/        # API 按业务模块组织
│   ├── api.ts        # 接口定义
│   ├── types.ts      # 类型定义
│   ├── enum.ts       # 枚举定义
│   └── index.ts      # 统一导出
├── views/模块名/      # 页面按业务模块组织
├── components/       # 业务组件
│   └── model/        # 数据展示组件
└── store/           # 状态管理
```

### TypeScript 规范

#### 类型定义

- **命名空间**: 使用 PascalCase，如 `User`、`AuthApi`
- **接口**: 使用 PascalCase，如 `LoginParams`、`UserInfo`
- **枚举**: 使用 PascalCase，如 `UserType`
- **类型别名**: 使用 PascalCase，如 `UserType`

```typescript
// ✅ 推荐的类型定义
export declare namespace User {
  export interface View {
    id: number;
    userName: string;
    nickName: string;
  }

  export interface Post {
    userName: string;
    password: string;
  }
}

// ✅ API 接口类型定义
export namespace AuthApi {
  export interface LoginParams {
    userName?: string;
    password?: string;
  }

  export interface LoginResult {
    accessToken: string;
  }
}
```

#### 导入规范

- **路径别名**: 优先使用 `#/*` 别名
- **类型导入**: 使用 `type` 关键字明确标识

```typescript
// ✅ 推荐的导入方式
import type { User } from '#/api/system/user';
import { requestClient } from '#/api/request';
import { $t } from '#/locales';
```

### Vue 组件规范

#### Script Setup

- 优先使用 `<script setup lang="ts">`
- Props 使用 `defineProps<T>()` 进行类型定义

```vue
<script setup lang="ts">
import type { User } from '#/api/system/user';

// ✅ Props 类型定义
const { origin } = defineProps<{
  origin: User.View;
}>();
</script>
```

#### 组件导入

- UI 组件从 `@vben/common-ui`、`@vben/icons` 导入
- Ant Design 组件按需导入

```vue
<script setup lang="ts">
import { EllipsisText } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { Avatar } from 'ant-design-vue';
</script>
```

### API 开发规范

#### 模块结构

每个 API 模块按以下结构组织：

```
src/api/模块名/
├── api.ts        # 接口函数定义
├── types.ts      # 类型定义
├── enum.ts       # 枚举定义
└── index.ts      # 统一导出
```

#### 接口函数定义

- **函数命名**: 使用动词开头的 camelCase，如 `queryUserPage`、`getMineProfile`
- **参数顺序**: 路径参数 → 查询参数 → 请求体参数
- **类型标注**: 明确标注返回类型和参数类型
- **注释要求**: 使用 JSDoc 注释说明函数功能和参数

```typescript
// ✅ 推荐的 API 函数定义
/**
 * 查询用户分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryUserPage(
  pageCursor: Api.PageCursor = {},
  condition: User.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<User.View[]>>(
    '/system/user/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 更新用户
 * @param userId 用户ID
 * @param user 用户信息
 */
function setUser(userId: number, user: User.Post) {
  return requestClient.put<boolean>(`/system/user/${userId}`, user);
}
```

#### 枚举定义

- 使用 `enum-plus` 库定义枚举
- 枚举值包含 `value`、`label`、`color` 属性
- 命名使用 PascalCase

```typescript
// ✅ 推荐的枚举定义
export const UserType = Enum({
  Admin: { value: '02', label: '管理员', color: 'processing' },
  System: { value: '00', label: '系统用户', color: 'volcano' },
  Simple: { value: '01', label: '普通用户', color: 'success' },
} as const);

export const Status = Enum({
  Normal: { value: '0', label: '启用', color: 'success' },
  Stop: { value: '1', label: '禁用', color: 'error' },
} as const);
```

#### 导出规范

- `api.ts` 使用具名导出
- `index.ts` 统一导出所有模块内容

```typescript
// api.ts - 具名导出
export {
  addUser,
  assignUserRole,
  delUserById,
  getBindAccessCodes,
  getMineProfile,
  queryUserPage,
  setUser,
};

// index.ts - 统一导出
export * from './api';
export * from './enum';
export * from './types';
```

#### 错误处理

- 网络请求错误由 `requestClient` 统一处理
- 业务逻辑错误在组件层面处理
- 避免在 API 层做过多的错误处理逻辑

### 状态管理规范

#### Pinia Store

- 使用 Composition API 风格的 `defineStore`
- Store 函数命名使用 `useXxxStore`
- 提供 `$reset` 方法用于重置状态

```typescript
// ✅ 推荐的 Store 定义
export const useAuthStore = defineStore('auth', () => {
  const loginLoading = ref(false);

  async function authLogin(params: Recordable<any>) {
    // 实现逻辑
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    loginLoading,
  };
});
```

### 样式规范

#### TailwindCSS

- 优先使用 TailwindCSS 工具类
- 响应式设计使用 Tailwind 的响应式前缀
- 自定义颜色使用项目主题色：`hsl(219 100% 34%)`

```vue
<template>
  <!-- ✅ 推荐的样式写法 -->
  <div class="flex w-full items-center justify-center gap-2">
    <div class="w-[40px]">
      <Avatar :size="40" :src="avatar" />
    </div>
    <div class="flex w-[100px] flex-col justify-start">
      <div class="text-left text-sm font-bold">{{ nickName }}</div>
      <div class="text-left text-xs text-gray-400">{{ phone }}</div>
    </div>
  </div>
</template>
```

### 国际化规范

- 所有用户可见文本使用 `$t()` 函数
- 路由 meta 中的 title 使用国际化

```typescript
// ✅ 国际化使用
meta: {
  title: $t('page.dashboard.workspace'),
}

// 组件中使用
notification.success({
  message: $t('authentication.loginSuccess'),
});
```

### Git 提交规范

遵循 Angular 提交信息约定：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
