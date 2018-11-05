import React from 'react';
import { Modal } from 'antd';
import Tree from '../../../components/Tree';
import ModalFooter from '../ModalFooter';
import './index.scss';

export default class ModalOrgSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectKeys: []
    };
  }

  onSubmit = () => {
    const { selectKeys } = this.state;
    const { onOk, onCancel } = this.props;
    console.log(selectKeys)
    onOk && onOk(selectKeys[0]);
    onCancel();
  };
  onSelect = selectKeys => {
    this.setState({ selectKeys });
  };
  render() {
    const { selectKeys } = this.state;
    const {
      visible,
      onCancel,
      onOk,
      className,
      treeProps,
      ...params
    } = this.props;
    return (
      <Modal
        width={400}
        visible={visible}
        footer={null}
        onCancel={onCancel}
        className={`modal-org-select ${className ? className : ''}`}
        {...params}
      >
        <div className="modal-layout-content">
          <Tree
            {...treeProps}
            selectedKeys={selectKeys}
            onSelect={this.onSelect}
          />
        </div>
        <ModalFooter
          onCancel={onCancel}
          onOk={() => this.onSubmit(selectKeys)}
        />
      </Modal>
    );
  }
}
