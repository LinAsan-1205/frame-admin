export declare namespace Upload {
  export interface View {
    /** 文件URL */
    url: string;
    /** 文件名 */
    name: string;
    /** 文件大小 */
    size: number;
    /** 文件ID */
    id?: number;
    /** 文件类型 */
    type?: string;
    /** 上传时间 */
    uploadTime?: string;
  }

  export interface Post {
    /** 文件对象 */
    file: Blob | File;
    /** 额外参数 */
    data?: Record<string, any>;
  }

  export interface Response {
    /** 是否成功 */
    success: boolean;
    /** 文件信息 */
    data: View;
    /** 错误信息 */
    message?: string;
  }
}
