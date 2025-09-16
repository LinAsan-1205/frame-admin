import { ConfigGroupStatus, InputComponentType } from './enum';

export declare namespace ConfigGroup {
  export type Status = typeof ConfigGroupStatus.valueType;

  export interface View {
    id: number;
    groupName: string;
    remark?: string;
    status: Status;
    sortOrder: number;
    configItemCount?: number;
    createTime: string;
    updateTime: string;
  }

  export interface Condition {
    groupName?: string;
    status?: Status;
    createFromDate?: string;
    createToDate?: string;
  }

  export interface Post {
    groupName: string;
    remark?: string;
    status?: Status;
    sortOrder: number;
  }
}

export declare namespace ConfigItem {
  export type InputComponent = typeof InputComponentType.valueType;

  export interface View {
    id: number;
    title: string;
    configKey: string;
    configValue?: string;
    sortOrder: number;
    inputComponent: InputComponent;
    componentProps?: string;
    options?: string;
    description?: string;
    validationRules?: string;
    groupId: number;
    createTime: string;
    updateTime: string;
    group?: Pick<ConfigGroup.View, 'groupName' | 'id'>;
  }

  export interface Condition {
    title?: string;
    configKey?: string;
    groupId?: number;
    inputComponent?: InputComponent;
    createFromDate?: string;
    createToDate?: string;
  }

  export interface Post {
    title: string;
    configKey: string;
    configValue?: string;
    sortOrder: number;
    inputComponent: InputComponent;
    componentProps?: string;
    options?: string;
    description?: string;
    validationRules?: string;
    groupId: number;
  }

  export interface BatchUpdateValues {
    configs?: Array<{
      configKey: string;
      configValue: string;
      id: number;
    }>;
  }
}

export declare namespace ConfigTree {
  export interface View extends ConfigGroup.View {
    children?: ConfigItem.View[];
  }
}
