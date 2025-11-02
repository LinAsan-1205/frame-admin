export namespace ContactUs {
  /** 查询条件 */
  export interface Condition {
    /** 联系人姓名 */
    name?: string;
    /** 联系人邮箱 */
    email?: string;
    /** 联系类型 */
    type?: string;
    /** 主题 */
    subject?: string;
  }

  /** 视图对象 */
  export interface View {
    /** 联系记录ID */
    id: number;
    /** 联系人姓名 */
    name: string;
    /** 联系人邮箱 */
    email: string;
    /** 联系电话 */
    phone?: string;
    /** 联系类型 */
    type: string;
    /** 主题 */
    subject: string;
    /** 消息内容 */
    message: string;
    /** IP地址 */
    ipAddress?: string;
    /** 用户代理 */
    userAgent?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  }

  /** 创建对象 */
  export interface Create {
    /** 联系人姓名 */
    name: string;
    /** 联系人邮箱 */
    email: string;
    /** 联系电话 */
    phone?: string;
    /** 联系类型 */
    type: string;
    /** 主题 */
    subject: string;
    /** 消息内容 */
    message: string;
    /** IP地址 */
    ipAddress?: string;
    /** 用户代理 */
    userAgent?: string;
  }

  /** 更新对象 */
  export interface Update extends Partial<Create> {}

  /** 批量删除 */
  export interface BatchDelete {
    /** 联系记录ID列表 */
    contactIds: number[];
  }
}
