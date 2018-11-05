import React from 'react';
import { Button } from 'antd';
import './index.scss';

export default class ModalFooter extends React.Component {
  state = {
    loading: false
  };
  onSubmit = () => {
    if (this.props.noLoading !== false) {
      this.setState({ loading: true });
    }
    this.props.onOk();
  };
  render() {
    const { className = '', onCancel, disabled } = this.props;
    return (
      <div className={`modal-footer ${className}`}>
        <Button onClick={() => onCancel()}>取消</Button>
        <Button
          onClick={this.onSubmit}
          htmlType="submit"
          type="primary"
          loading={this.state.loading}
          disabled={disabled}
        >
          确定
        </Button>
      </div>
    );
  }
}
