# 招聘管理模块 (Join Us)

## 功能概述

招聘管理模块实现了招聘职位的完整增删查改功能，支持富文本编辑器编辑职位详情，完全按照项目规范开发。

## 已实现功能

### 1. API 层 (`src/api/content-management/join-us/`)

- ✅ **api.ts** - API 接口函数定义
  - `getJoinUsPage` - 获取招聘职位分页列表
  - `getJoinUsById` - 获取招聘职位详情
  - `addJoinUs` - 新增招聘职位
  - `setJoinUsById` - 更新招聘职位
  - `deleteJoinUsById` - 删除招聘职位
  - `batchDeleteJoinUs` - 批量删除招聘职位

- ✅ **types.ts** - TypeScript 类型定义
  - `JoinUs.Condition` - 查询条件类型
  - `JoinUs.View` - 视图对象类型
  - `JoinUs.Create` - 创建对象类型
  - `JoinUs.Update` - 更新对象类型
  - `JoinUs.BatchDelete` - 批量删除类型

- ✅ **enum.ts** - 枚举定义
  - `JobType` - 职位类型（全职、兼职、合同工、实习）
  - `JobStatus` - 招聘状态（启用、禁用）

- ✅ **index.ts** - 统一导出

### 2. 国际化配置

- ✅ 中文配置 (`src/locales/langs/zh-CN/content-management.json`)
- ✅ 英文配置 (`src/locales/langs/en-US/content-management.json`)
- ✅ 页面标题配置 (`src/locales/langs/zh-CN/page.json`, `src/locales/langs/en-US/page.json`)

### 3. 视图组件 (`src/views/content-management/join-us/`)

- ✅ **index.vue** - 主入口页面
- ✅ **join-us-list.vue** - 列表页
  - 支持分页查询
  - 支持多条件搜索
  - 支持编辑、删除操作
  - 支持新增职位跳转

- ✅ **join-us-edit.vue** - 新增/编辑页
  - 支持新增和编辑两种模式
  - 表单验证
  - 数据加载和提交
  - 返回列表功能

- ✅ **config/form-schemas.ts** - 表单配置
  - 完整的表单字段定义
  - **富文本编辑器**集成（职位详情字段）
  - 表单验证规则
  - 默认值配置

- ✅ **config/table-columns.ts** - 表格列配置
  - 列定义
  - 状态标签渲染
  - 操作按钮配置

- ✅ **config/search-config.ts** - 搜索表单配置
  - 搜索条件配置
  - 下拉选项配置

### 4. 路由配置 (`src/router/routes/modules/content-management.ts`)

- ✅ `/content-management/join-us` - 招聘管理列表页
- ✅ `/content-management/join-us/add` - 新增招聘职位（隐藏菜单）
- ✅ `/content-management/join-us/edit/:id` - 编辑招聘职位（隐藏菜单）

## 数据字段说明

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | ✅ | 职位名称 |
| department | string | ✅ | 所属部门 |
| location | string | ✅ | 工作地点 |
| type | string | ✅ | 职位类型（全职/兼职/合同工/实习） |
| summary | string | ❌ | 职位摘要 |
| **content** | **string** | ❌ | **职位详情（富文本）** |
| requirements | string | ❌ | 任职要求 |
| benefits | string | ❌ | 福利待遇 |
| salaryRange | string | ❌ | 薪资范围 |
| headcount | number | ❌ | 招聘人数 |
| sort | number | ❌ | 排序号（默认0） |
| publishedAt | string | ❌ | 发布时间 |
| deadline | string | ❌ | 截止时间 |
| status | string | ❌ | 状态（启用/禁用） |
| contactEmail | string | ❌ | 联系邮箱 |

## 富文本编辑器集成

职位详情字段 `content` 使用了 `RichTextEditor` 组件：

```typescript
{
  component: markRaw(RichTextEditor),
  componentProps: {
    minHeight: '300px',
    placeholder: $t('content-management.joinUs.contentPlaceholder'),
    toolbar: 'full',
  },
  fieldName: 'content',
  label: $t('content-management.joinUs.content'),
}
```

**特性：**
- 完整的富文本编辑功能
- 最小高度 300px
- 完整工具栏
- 支持图片、链接、格式化等

## 技术栈

- **框架**: Vue 3 + Composition API + TypeScript
- **UI 组件**: Ant Design Vue
- **表格**: VXE Table
- **表单**: VbenForm (基于 VeeValidate)
- **富文本**: RichTextEditor
- **国际化**: Vue I18n
- **路由**: Vue Router 4
- **HTTP 客户端**: requestClient (基于 @vben/request)

## 开发规范遵循

✅ API 接口规范（分页参数分离）
✅ TypeScript 类型定义规范
✅ 枚举定义规范（使用 enum-plus）
✅ 文件命名规范（kebab-case）
✅ 目录结构规范（config 目录）
✅ 国际化规范（所有文本使用 $t()）
✅ 表单配置抽离规范
✅ 代码格式规范（Prettier + ESLint）

## 使用说明

### 访问页面

启动开发服务器后，访问：
- 列表页：`http://localhost:5666/content-management/join-us`
- 新增页：`http://localhost:5666/content-management/join-us/add`
- 编辑页：`http://localhost:5666/content-management/join-us/edit/{id}`

### 后端接口要求

确保后端提供以下接口（基于 `C:\Users\Administrator\Desktop\demo\nest-demo\src\admin\content-management`）：

- `GET /join-us/page` - 分页查询
- `GET /join-us/:jobId` - 获取详情
- `POST /join-us` - 新增
- `PUT /join-us/:jobId` - 更新
- `DELETE /join-us/:jobId` - 删除
- `POST /join-us/batch-delete` - 批量删除

## 注意事项

1. **富文本内容**：`content` 字段存储 HTML 格式的富文本内容
2. **时间格式**：发布时间和截止时间使用 ISO 格式字符串
3. **邮箱验证**：联系邮箱字段有格式验证
4. **排序号**：数值越小排序越靠前
5. **状态管理**：启用(1)和禁用(0)状态控制职位是否展示

## 后续扩展建议

- [ ] 批量操作功能（批量删除、批量修改状态）
- [ ] 职位导出功能
- [ ] 职位模板功能
- [ ] 投递简历管理
- [ ] 职位浏览统计

