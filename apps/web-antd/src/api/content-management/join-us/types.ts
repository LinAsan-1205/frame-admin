export namespace JoinUs {
  /** 查询条件 */
  export interface Condition {
    /** 职位名称 */
    title?: string;
    /** 所属部门 */
    department?: string;
    /** 工作地点 */
    location?: string;
    /** 职位类型 */
    type?: string;
    /** 状态 */
    status?: string;
  }

  /** 视图对象 */
  export interface View {
    /** 职位ID */
    id: number;
    /** 职位名称 */
    title: string;
    /** 所属部门 */
    department: string;
    /** 工作地点 */
    location: string;
    /** 职位类型 */
    type: string;
    /** 职位摘要 */
    summary?: string;
    /** 职位详情（富文本） */
    content?: string;
    /** 任职要求 */
    requirements?: string;
    /** 福利待遇 */
    benefits?: string;
    /** 薪资范围 */
    salaryRange?: string;
    /** 招聘人数 */
    headcount?: number;
    /** 排序号 */
    sort: number;
    /** 发布时间 */
    publishedAt?: string;
    /** 截止时间 */
    deadline?: string;
    /** 状态 */
    status: string;
    /** 联系邮箱 */
    contactEmail?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  }

  /** 创建对象 */
  export interface Create {
    /** 职位名称 */
    title: string;
    /** 所属部门 */
    department: string;
    /** 工作地点 */
    location: string;
    /** 职位类型 */
    type: string;
    /** 职位摘要 */
    summary?: string;
    /** 职位详情（富文本） */
    content?: string;
    /** 任职要求 */
    requirements?: string;
    /** 福利待遇 */
    benefits?: string;
    /** 薪资范围 */
    salaryRange?: string;
    /** 招聘人数 */
    headcount?: number;
    /** 排序号 */
    sort?: number;
    /** 发布时间 */
    publishedAt?: string;
    /** 截止时间 */
    deadline?: string;
    /** 状态 */
    status?: string;
    /** 联系邮箱 */
    contactEmail?: string;
  }

  /** 更新对象 */
  export interface Update extends Partial<Create> {}

  /** 批量删除 */
  export interface BatchDelete {
    /** 职位ID列表 */
    jobIds: number[];
  }
}
