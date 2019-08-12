import React, { PureComponent } from 'react';
import { Card } from 'antd';
import CurdTable from './components/CurdTable/index';
import CurdList from './components/CurdList/index';
import QueryPanel from './components/QueryPanel/index';
import { injectChildren } from './utils';


export interface CurdProps {
  modelName: string;
  dispatch: Function;
  onRef?: (__curd__: Curd) => void;
  children?: any;
}

export interface CurdState {
  /** sharing query panel search form */
  searchForm: any;
  /** sharing table's pagination, filter and sorter params */
  searchParams: any;
}

class Curd extends PureComponent<CurdProps, CurdState> {
  static defaultProps = {
    modelName: '',
    dispatch: () => { },
  };

  static QueryPanel = QueryPanel;
  static CurdTable = CurdTable;
  static CurdList = CurdList;

  state = {
    searchForm: {} as any,
    searchParams: {} as any,
  };

  componentDidUpdate() {
    if (process.env.NODE_ENV === 'development') {
      const { searchForm, searchParams } = this.state;
      console.log('latest curd\'s state:');
      console.log('searchForm', searchForm);
      console.log('searchParams', searchParams);
    }
  }

  handleSearch = () => {
    const { modelName, dispatch } = this.props;
    const { searchForm, searchParams } = this.state;
    dispatch({
      type: `${modelName}/fetch`,
      payload: { ...searchForm, ...searchParams },
    })
  }

  renderChildren = () => {
    const { children } = this.props;
    return injectChildren(children, { __curd__: this })
  }

  handleRef = () => {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  render() {
    this.handleRef();
    return (
      <Card bordered={false}>
        {this.renderChildren()}
      </Card>
    );
  }
}

export default Curd;
