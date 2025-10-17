# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue Vben Admin 的企业级中后台前端解决方案，采用 monorepo 架构，使用最新的 Vue 3、Vite、TypeScript 等主流技术开发。

## 常用命令

### 开发命令

- `pnpm dev` - 启动开发服务器（使用 turbo-run 工具）
- `pnpm dev:antd` - 启动 Ant Design 版本的开发服务器
- `pnpm build` - 构建所有应用和包（使用 Turbo 构建系统）
- `pnpm build:antd` - 仅构建 Ant Design 版本
- `pnpm preview` - 预览构建后的应用

### web-antd 应用特定命令

在 `apps/web-antd` 目录下：

- `pnpm dev` - 启动开发服务器（端口 5666）
- `pnpm build` - 构建生产版本
- `pnpm build:analyze` - 构建并生成分析报告
- `pnpm preview` - 预览构建后的应用
- `pnpm typecheck` - 执行 TypeScript 类型检查

### 代码质量检查

- `pnpm lint` - 执行代码风格检查
- `pnpm format` - 格式化代码
- `pnpm check` - 执行完整检查（循环依赖、类型检查、拼写检查等）
- `pnpm check:type` - 执行 TypeScript 类型检查
- `pnpm check:circular` - 检查循环依赖
- `pnpm check:cspell` - 执行拼写检查

### 测试命令

- `pnpm test:unit` - 运行单元测试（使用 Vitest）
- `pnpm test:e2e` - 运行端到端测试

### 依赖管理

- `pnpm install` - 安装依赖
- `pnpm reinstall` - 清理并重新安装依赖
- `pnpm update:deps` - 更新依赖版本

## 项目架构

### Monorepo 结构

- `apps/` - 应用程序
  - `web-antd/` - Ant Design 版本的主应用
  - `backend-mock/` - 后端 Mock 服务
- `packages/` - 共享包
  - `@core/` - 核心包（基础组件、共享工具等）
  - `effects/` - 副作用相关包
  - `business/` - 业务相关包
  - 其他功能包（icons、locales、preferences、stores、styles、types、utils）
- `internal/` - 内部工具和配置
  - `lint-configs/` - ESLint/Prettier/Stylelint 配置
  - `node-utils/` - Node.js 工具
  - `tailwind-config/` - Tailwind CSS 配置
  - `tsconfig/` - TypeScript 配置
  - `vite-config/` - Vite 配置

### 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **包管理**: pnpm with workspace
- **单体仓库**: Turbo
- **语言**: TypeScript
- **UI 组件库**: Ant Design Vue
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: TailwindCSS + SCSS
- **图标**: Iconify
- **国际化**: Vue I18n

### 应用初始化流程

1. `main.ts` - 应用入口，调用 `initApplication()`
2. `initApplication()` - 初始化偏好设置、扩展 enum-plus
3. `bootstrap.ts` - 应用启动逻辑
   - 初始化组件适配器
   - 配置国际化
   - 初始化状态管理
   - 注册指令和插件
   - 配置路由

### 核心包说明

- `@vben-core/shared` - 共享的基础工具和常量
- `@vben/preferences` - 应用偏好设置管理
- `@vben/stores` - Pinia 状态管理
- `@vben/access` - 权限控制
- `@vben/common-ui` - 通用 UI 组件
- `@vben/layouts` - 布局组件

## 开发指南

### 环境要求

- Node.js >= 20.10.0
- pnpm >= 9.12.0

### 开发流程

1. 安装依赖: `pnpm install`
2. 启动开发服务器: `pnpm dev`
3. 代码开发完成后执行: `pnpm check` 进行代码质量检查
4. 构建应用: `pnpm build`

### 添加新功能包

在 `packages/` 目录下创建新包，确保在 `pnpm-workspace.yaml` 中正确配置工作区。

### Git 提交规范

遵循 Angular 提交规范:

- `feat`: 新功能
- `fix`: 修复问题
- `style`: 代码格式相关
- `perf`: 性能优化
- `refactor`: 重构
- `test`: 测试相关
- `docs`: 文档/注释
- `chore`: 依赖更新/脚手架配置修改等

## web-antd 应用架构

### 应用目录结构

```
apps/web-antd/src/
├── adapter/           # 组件适配器
│   ├── component/     # 组件适配器配置
│   ├── form.ts       # 表单组件适配器
│   ├── renderer/     # 渲染器适配器
│   └── vxe-table.ts  # VXE Table 适配器
├── api/              # API 接口定义
├── assets/           # 静态资源
├── components/       # 应用级组件
├── layouts/          # 布局组件
├── locales/          # 国际化文件
├── router/           # 路由配置
├── store/            # 状态管理
├── types/            # 类型定义
├── views/            # 页面组件
│   ├── _core/        # 核心页面
│   ├── dashboard/    # 仪表板
│   ├── log/          # 日志管理
│   ├── schedule/     # 调度管理
│   ├── system/       # 系统管理
│   └── user/         # 用户管理
├── app.vue           # 根组件
├── bootstrap.ts      # 应用启动配置
├── main.ts           # 应用入口
└── preferences.ts    # 应用偏好设置
```

### 环境配置

- `.env.development` - 开发环境配置（端口5666，API地址 http://127.0.0.1:7002/api）
- `.env.production` - 生产环境配置（hash路由模式，支持压缩和PWA）
- `.env.analyze` - 分析模式配置

### 核心特性

- **组件适配器系统**: 通过 adapter 目录统一管理组件库适配
- **VXE Table 集成**: 强大的表格组件支持
- **Nitro Mock 服务**: 开发环境内置 Mock 数据服务
- **多种构建模式**: 支持开发、生产、分析模式
- **路径别名**: 使用 `#/*` 指向 `./src/*`

### 应用偏好设置

- 默认主页路径: `/workspace`
- 布局模式: `sidebar-mixed-nav`（侧边栏混合导航）
- 权限模式: `mixed`（混合权限控制）
- 主题: 支持亮色/暗色主题切换
- 侧边栏宽度: 200px

## 前端开发规范

### 页面模块目录结构规范

每个页面模块应该遵循以下目录结构，以用户管理模块为例：

```
views/system/user/
├── index.vue                    # 主页面入口
├── user-list.vue              # 具体功能页面
├── modules/                    # 组件模块目录
│   ├── dept-tree.vue          # 部门树组件
│   ├── role-assign.vue        # 角色分配组件
│   ├── user-form.vue          # 用户表单组件
│   └── user-roles-display.vue # 用户角色显示组件
└── config/                     # 配置文件目录
    ├── form-schemas.ts         # 表单配置（新增/编辑表单结构）
    ├── table-columns.ts        # 表格列配置
    └── search-config.ts        # 搜索表单配置
```

### 目录命名规范

#### 1. 主要目录

- `modules/` - 存放页面内的子组件模块
- `config/` - 存放页面相关的配置文件

#### 2. 配置文件命名

- `form-schemas.ts` - 表单结构配置（包含新增/编辑表单的字段定义、验证规则等）
- `table-columns.ts` - 表格列配置（包含列定义、渲染器、操作按钮等）
- `search-config.ts` - 搜索表单配置（包含搜索条件、筛选器等）

#### 3. 组件文件命名

- 使用 kebab-case 命名方式
- 组件名应该清晰描述其功能
- 例：`user-form.vue`、`role-assign.vue`、`dept-tree.vue`

### 配置文件内容规范

#### form-schemas.ts

```typescript
import type { Ref } from 'vue';
import type { VbenFormSchema } from '#/adapter/form';

/**
 * 用户表单配置
 * @param id 用户ID（用于区分新增/编辑模式）
 */
export function useFormSchema(id: Ref<number | undefined>): VbenFormSchema[] {
  return [
    // 表单字段配置
  ];
}

/**
 * 角色分配表单配置
 * @returns 角色分配表单字段配置数组
 */
export function useRoleAssignFormSchema(): VbenFormSchema[] {
  return [
    // 角色分配表单字段配置
  ];
}

// 其他相关表单配置...
```

#### table-columns.ts

```typescript
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { User } from '#/api/system/user';

/**
 * 用户表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = User.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    // 列配置
  ];
}
```

#### search-config.ts

```typescript
import type { VbenFormProps } from '#/adapter/form';

/**
 * 用户搜索表单配置
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    // 搜索表单配置
  };
}
```

### 表单配置管理规范

#### 1. 配置抽离原则

所有使用 `useVbenForm` 的组件，其表单配置都**必须**抽离到 `config/form-schemas.ts` 文件中，不允许在组件内部直接定义表单配置。

**❌ 错误用法 - 在组件内定义表单配置：**

```typescript
// role-assign.vue
const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('system.user.userName'),
    },
    // 更多配置...
  ],
});
```

**✅ 正确用法 - 使用抽离的配置：**

```typescript
// config/form-schemas.ts
export function useRoleAssignFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('system.user.userName'),
    },
    // 更多配置...
  ];
}

// role-assign.vue
import { useRoleAssignFormSchema } from '../config/form-schemas';

const [Form, formApi] = useVbenForm({
  schema: useRoleAssignFormSchema(),
});
```

#### 2. 函数命名规范

- 主表单配置：`useFormSchema()` - 用于新增/编辑的主要表单
- 特定功能表单：`use[功能名]FormSchema()` - 例如 `useRoleAssignFormSchema()`、`usePasswordFormSchema()`
- 搜索表单配置：统一使用 `useSearchFormOptions()` （在 `search-config.ts` 中）

#### 3. 表单配置组织

**单个文件管理多个表单：**

```typescript
// config/form-schemas.ts
export function useFormSchema(id: Ref<number | undefined>): VbenFormSchema[] {
  // 主表单配置
}

export function useRoleAssignFormSchema(): VbenFormSchema[] {
  // 角色分配表单配置
}

export function usePasswordResetFormSchema(): VbenFormSchema[] {
  // 密码重置表单配置
}
```

#### 4. 表单配置要求

- **完整的 TypeScript 类型定义**
- **详细的 JSDoc 注释说明**
- **合理的参数设计**（如需要动态配置时）
- **统一的导入组织**（API、枚举、国际化等）

### 设计原则

1. **职责分离** - 不同类型的配置分别存放在不同文件中
2. **可维护性** - 配置文件独立，修改时不会影响其他功能
3. **可读性** - 文件名直接表明其用途和内容
4. **扩展性** - 易于添加新的配置类型而不影响现有结构
5. **一致性** - 所有页面模块都遵循相同的目录结构

### 重构指导

对于现有的 `data.ts` 文件，应该按照以上规范进行重构：

1. **创建 `config/` 目录**
2. **按功能拆分原始文件内容：**
   - 表单配置 → `form-schemas.ts`
   - 表格列配置 → `table-columns.ts`
   - 搜索配置 → `search-config.ts`
3. **检查并抽离组件内的表单配置：**
   - 查找所有使用 `useVbenForm` 的组件
   - 将内联的 `schema` 配置抽离到 `form-schemas.ts`
   - 更新组件导入新的配置函数
4. **更新相关页面的导入路径**
5. **删除原始 `data.ts` 文件**
6. **确保所有功能正常运行**

#### 常见的重构场景

**场景1：主表单 + 弹窗表单**

```typescript
// config/form-schemas.ts
export function useFormSchema(id: Ref<number | undefined>): VbenFormSchema[] {
  // 主要的新增/编辑表单
}

export function useModalFormSchema(): VbenFormSchema[] {
  // 弹窗中的表单（如角色分配、密码重置等）
}
```

**场景2：多步骤表单**

```typescript
// config/form-schemas.ts
export function useStepOneFormSchema(): VbenFormSchema[] {
  // 第一步表单
}

export function useStepTwoFormSchema(): VbenFormSchema[] {
  // 第二步表单
}
```

**场景3：条件动态表单**

```typescript
// config/form-schemas.ts
export function useFormSchema(
  id: Ref<number | undefined>,
  userType: Ref<string>,
): VbenFormSchema[] {
  return [
    // 基础字段
    ...baseFields,
    // 根据用户类型动态添加字段
    ...(userType.value === 'admin' ? adminFields : userFields),
  ];
}
```

这样的结构使得代码更加清晰、易于维护，并且符合现代前端项目的最佳实践。

## API 接口开发规范

### API 目录结构

每个模块的 API 应该遵循以下目录结构：

```
api/system/user/
├── index.ts           # 统一导出
├── api.ts            # API 方法定义
├── types.ts          # 类型定义
└── enum.ts           # 枚举定义（如果需要）
```

### 分页接口规范

**所有分页查询接口必须遵循以下标准格式：**

#### ✅ 正确的分页接口写法

```typescript
/**
 * 获取岗位分页列表
 * @param pageCursor 分页参数（page、pageSize）
 * @param condition 查询条件
 * @returns 分页结果
 */
function getPostPage(
  pageCursor: Api.PageCursor = {},
  condition: Post.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Post.View>>(
    '/system/post/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}
```

#### 关键要求

1. **参数分离**：必须将分页参数（`pageCursor`）和查询条件（`condition`）分开定义
2. **默认值**：两个参数都必须提供默认空对象 `{}`
3. **参数合并**：使用展开运算符 `...pageCursor, ...condition` 将参数合并到 `params` 中
4. **类型定义**：
   - 分页参数类型：`Api.PageCursor`
   - 查询条件类型：`[模块名].Condition`
   - 返回结果类型：`Api.PaginationResult<[模块名].View>`

#### ❌ 错误的分页接口写法

```typescript
// 错误1：参数未分离
function getPostPage(params: any) {
  return requestClient.get('/system/post/page', { params });
}

// 错误2：缺少默认值
function getPostPage(pageCursor: Api.PageCursor, condition: Post.Condition) {
  return requestClient.get('/system/post/page', {
    params: { ...pageCursor, ...condition },
  });
}

// 错误3：参数合并方式不正确
function getPostPage(
  pageCursor: Api.PageCursor = {},
  condition: Post.Condition = {},
) {
  return requestClient.get('/system/post/page', {
    params: {
      pageCursor,
      condition,
    },
  });
}

// 错误4：直接传递单个对象
function getPostPage(queryDto: Post.Query) {
  return requestClient.get('/system/post/page', { params: queryDto });
}
```

### 完整的 API 文件示例

#### api.ts

```typescript
import { requestClient } from '#/api/request';

import type { Post } from './types';

/**
 * 获取岗位分页列表
 */
export function getPostPage(
  pageCursor: Api.PageCursor = {},
  condition: Post.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Post.View>>(
    '/system/post/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 获取岗位列表（不分页）
 */
export function getPostList(condition: Post.Condition = {}) {
  return requestClient.get<Post.View[]>('/system/post/list', {
    params: condition,
  });
}

/**
 * 获取岗位详情
 */
export function getPostById(id: number) {
  return requestClient.get<Post.View>(`/system/post/${id}`);
}

/**
 * 新增岗位
 */
export function addPost(data: Post.Create) {
  return requestClient.post<boolean>('/system/post', data);
}

/**
 * 更新岗位
 */
export function setPostById(id: number, data: Post.Update) {
  return requestClient.put<boolean>(`/system/post/${id}`, data);
}

/**
 * 设置岗位状态
 */
export function setPostStatus(data: Post.SetStatus) {
  return requestClient.post<boolean>('/system/post/status', data);
}

/**
 * 删除岗位
 */
export function deletePostById(id: number) {
  return requestClient.delete<boolean>(`/system/post/${id}`);
}

/**
 * 批量删除岗位
 */
export function batchDeletePost(data: Post.BatchDelete) {
  return requestClient.post<boolean>('/system/post/batch-delete', data);
}
```

#### types.ts

```typescript
export namespace Post {
  /** 查询条件 */
  export interface Condition {
    /** 岗位编码 */
    postCode?: string;
    /** 岗位名称 */
    postName?: string;
    /** 状态 */
    status?: string;
    /** 部门ID */
    deptId?: number;
  }

  /** 视图对象 */
  export interface View {
    /** 岗位ID */
    id: number;
    /** 岗位编码 */
    postCode: string;
    /** 岗位名称 */
    postName: string;
    /** 部门ID */
    deptId?: number;
    /** 部门信息 */
    dept?: {
      id: number;
      name: string;
    };
    /** 排序 */
    postSort: number;
    /** 状态 */
    status: string;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createTime: string;
  }

  /** 创建对象 */
  export interface Create {
    /** 岗位编码 */
    postCode: string;
    /** 岗位名称 */
    postName: string;
    /** 部门ID */
    deptId?: number;
    /** 排序 */
    postSort?: number;
    /** 状态 */
    status?: string;
    /** 备注 */
    remark?: string;
  }

  /** 更新对象 */
  export interface Update extends Partial<Create> {}

  /** 设置状态 */
  export interface SetStatus {
    /** 岗位ID */
    id: number;
    /** 状态 */
    status: string;
  }

  /** 批量删除 */
  export interface BatchDelete {
    /** 岗位ID列表 */
    postIds: number[];
  }
}
```

### API 命名规范

| 操作类型 | 方法命名              | HTTP 方法 | 示例              |
| -------- | --------------------- | --------- | ----------------- |
| 分页查询 | `get[模块名]Page`     | GET       | `getPostPage`     |
| 列表查询 | `get[模块名]List`     | GET       | `getPostList`     |
| 树形查询 | `get[模块名]Tree`     | GET       | `getDeptTree`     |
| 单个查询 | `get[模块名]ById`     | GET       | `getPostById`     |
| 新增     | `add[模块名]`         | POST      | `addPost`         |
| 更新     | `set[模块名]ById`     | PUT       | `setPostById`     |
| 状态更新 | `set[模块名]Status`   | POST      | `setPostStatus`   |
| 删除     | `delete[模块名]ById`  | DELETE    | `deletePostById`  |
| 批量删除 | `batchDelete[模块名]` | POST      | `batchDeletePost` |

### 类型定义规范

每个模块的类型定义使用命名空间（namespace）组织：

```typescript
export namespace [ModuleName] {
  /** 查询条件 */
  export interface Condition { }

  /** 视图对象 */
  export interface View { }

  /** 创建对象 */
  export interface Create { }

  /** 更新对象 */
  export interface Update extends Partial<Create> { }

  /** 设置状态 */
  export interface SetStatus { }

  /** 批量删除 */
  export interface BatchDelete { }
}
```

### 公共类型定义

在 `#/types/global.d.ts` 中定义公共类型：

```typescript
declare namespace Api {
  /** 分页游标 */
  interface PageCursor {
    /** 当前页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 分页结果 */
  interface PaginationResult<T> {
    /** 数据列表 */
    items: T;
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }
}
```
