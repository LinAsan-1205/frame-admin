import { FileStatus, FileType, StorageType } from './enum';

export declare namespace File {
  export interface View {
    /**
     * 文件哈希值
     */
    fileHash: string;
    /**
     * 存储文件名
     */
    fileName: string;
    /**
     * 文件路径
     */
    filePath: string;
    /**
     * 文件大小（字节）
     */
    fileSize: number;
    /**
     * 文件类型
     */
    fileType: typeof FileType.valueType;
    /**
     * 文件访问URL
     */
    fileUrl: string;
    /**
     * 文件ID
     */
    id: number;
    /**
     * MIME类型
     */
    mimeType: string;
    /**
     * 原始文件名
     */
    originalName: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 文件状态: 0=正常,1=已删除
     */
    status: typeof FileStatus.valueType;
    /**
     * 存储类型: local=本地存储,oss=阿里云OSS,cos=腾讯云COS
     */
    storageType: typeof StorageType.valueType;
    /**
     * 上传用户ID
     */
    uploadUserId: number;
  }

  export interface Condition {
    name?: string;
    size?: number;
    type?: string;
  }
}
