import React from 'react';
import _merge from 'lodash/merge';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { ItemConfig, Layout } from 'antd-form-mate/dist/lib/props';
import {
  formatSorter as formatSorterDefault,
  searchFieldName as searchFieldNameDefault,
  debounceWait as debounceWaitDefault,
} from '../defaultConfig';
import defaultLocale from '../defaultLocale';
import ConfigContext, { ConfigConsumerProps } from './context';

export interface ACLocaleProps {
  curd?: {
    createOk?: string;
    updateOk?: string;
    deleteOk?: string;
  },
  queryPanel?: {
    collapse?: string;
    expand?: string;
    search?: string;
    reset?: string;
  },
  drawer?: {
    ok?: string;
    cancel?: string;
  },
}

export interface SearchFieldNameProps {
  page?: string;
  limit?: string;
  sortor?: string;
}

export interface ConfigProviderProps {
  acLocale?: ACLocaleProps;
  /** only set how to format sorter, it's invalid if set container's handleFilterAndSort */
  formatSorter?: typeof formatSorterDefault;
  searchFieldName?: SearchFieldNameProps;
  debounceWait?: number;
  createFormItemsFn?: (form: WrappedFormUtils) => (
    itemsConfig: ItemConfig[],
    formLayout?: Layout,
  ) => JSX.Element[];
  children?: React.ReactNode;
}

export class ConfigProvider extends React.Component<ConfigProviderProps> {
  renderProvider = () => {
    const {
      acLocale,
      formatSorter,
      searchFieldName,
      debounceWait,
      createFormItemsFn = () => () => ([]),

      children,
    } = this.props;

    const config: ConfigConsumerProps = {
      acLocale: _merge(defaultLocale, acLocale),
      formatSorter: formatSorter || formatSorterDefault,
      searchFieldName: {
        ...searchFieldNameDefault,
        ...searchFieldName,
      },
      debounceWait: debounceWait || debounceWaitDefault,
      createFormItemsFn: createFormItemsFn,
    }

    return (
      <ConfigContext.Provider value={config}>
        {children}
      </ConfigContext.Provider>
    )
  }

  render() {
    return this.renderProvider();
  }
}
