import { FileStatus, FileType, StorageType } from './enum';

export declare namespace File {
  export interface View {
    fileHash: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: typeof FileType.valueType;
    fileUrl: string;
    id: number;
    mimeType: string;
    originalName: string;
    remark: string;
    status: typeof FileStatus.valueType;
    storageType: typeof StorageType.valueType;
    uploadUserId: number;
    createTime: string;
  }

  export interface Condition {
    name?: string;
    size?: number;
    type?: string;
  }
}
