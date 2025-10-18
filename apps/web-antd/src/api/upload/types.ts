export declare namespace Upload {
  export interface View {
    /** 文件URL */
    fileUrl: string;
    /** 文件名 */
    originalName: string;
    /** 文件大小 */
    fileSize: number;
    /** 文件ID */
    id: number;
    /** 文件类型 */
    fileType: string;
    /** 上传时间 */
    uploadTime: string;
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
