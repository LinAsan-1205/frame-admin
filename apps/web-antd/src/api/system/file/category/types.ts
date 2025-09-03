import { FileCategoryStatusEnum, FileCategoryTypeEnum } from './enum';

export declare namespace FileCategory {
  export interface View {
    id: number;
    name: string;
    code: string;
    sort: number;
    description?: string;
    icon?: string;
    allowedMimeTypes?: string;
    status: typeof FileCategoryStatusEnum.valueType;
    type: typeof FileCategoryTypeEnum.valueType;
  }

  export type Post = Omit<View, 'id'>;
}
