import { RegionType } from './enum';

export namespace Region {
  export type RegionTypeType = typeof RegionType.valueType;

  export interface View {
    id: number;
    title: string;
    code: string;
    level: number;
    parentId?: number;
    type?: RegionTypeType;
    createTime?: string;
    updateTime?: string;
  }

  export interface Condition {
    title?: string;
    code?: string;
    level?: number;
    parentId?: number;
    type?: RegionTypeType;
    page?: number;
    pageSize?: number;
  }

  export interface Post {
    title: string;
    code: string;
    level?: number;
    parentId?: number;
    type?: RegionTypeType;
  }
}
