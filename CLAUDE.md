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