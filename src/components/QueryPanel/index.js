import React, { PureComponent } from 'react';
import { Row, Col, Form, Icon, Button } from 'antd';
import FormMate from 'antd-form-mate';
import { callFunctionIfFunction } from '../../utils';
import './index.less';

const { FormProvider, createFormItems } = FormMate;
const RowCount = [1, 2, 3, 4, 6, 8, 12, 24];
const addAllowClearToItemsConfig = itemsConfig =>
  itemsConfig.map(item => {
    const { componentProps = {}, ...rest } = item;
    return {
      componentProps: {
        ...componentProps,
        allowClear: true,
      },
      ...rest,
    };
  });

function calculateSpan(rowCount) {
  if (RowCount.includes(rowCount)) {
    return 24 / rowCount;
  }
  throw new Error(`QueryPanel: rowCount value only one of [${RowCount}]`);
}

class QueryPanel extends PureComponent {
  state = {
    expandForm: false,
  };

  handleFormReset = () => {
    const { form, onReset, onValuesChange } = this.props;
    form.resetFields();
    if (onValuesChange) {
      onValuesChange({}, {});
    }

    callFunctionIfFunction(onReset)();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { form, onSearch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('QueryPanel form:', fieldsValue);
      callFunctionIfFunction(onSearch)(fieldsValue);
    });
  };

  renderForm() {
    const {
      form,
      queryArgsConfig = [],
      rowCount = 3,
      maxCount = 2,
      rowProps = {},
      colProps: customColProps,
    } = this.props;
    if (!queryArgsConfig.length) return null;
    let colProps = { span: calculateSpan(rowCount) };
    if (customColProps) {
      colProps = customColProps;
    }
    const { expandForm } = this.state;
    let formItems = [];
    if (!expandForm) {
      formItems = addAllowClearToItemsConfig(queryArgsConfig).slice(0, maxCount);
    } else {
      formItems = addAllowClearToItemsConfig(queryArgsConfig);
    }

    const action = expandForm ? (
      <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
        收起 <Icon type="up" />
      </a>
    ) : (
        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
          展开 <Icon type="down" />
        </a>
      );
    const actions = (
      <div style={{ overflow: 'hidden' }}>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            重置
          </Button>
          {queryArgsConfig.length > maxCount ? action : null}
        </div>
      </div>
    );
    formItems = [...createFormItems(formItems), actions];

    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <FormProvider value={form}>
          <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }} {...rowProps}>
            {formItems.map(item => (
              <Col {...colProps} key={item.key}>
                {item}
              </Col>
            ))}
          </Row>
        </FormProvider>
      </Form>
    );
  }

  render() {
    return <div className='_query-panel-search-form'>{this.renderForm()}</div>;
  }
}

export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    const { onValuesChange } = props;
    if (onValuesChange) {
      onValuesChange(changedValues, allValues);
    }
  }
})(QueryPanel);
