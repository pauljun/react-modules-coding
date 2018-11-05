import React from 'react';
import OrgSelectDevice from '../../BusinessComponent/OrgSelectDevice';
import { Modal, Input } from 'antd';
export default class GroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.group ? props.group.groupName : null
    };
  }
  onChange = event => {
    this.setState({ name: event.target.value });
  };
  submit = list => {
    const { onOk, group } = this.props;
    let isEdit = !!group;
    onOk && onOk(isEdit, this.state.name, list, group);
  };
  render() {
    const { name } = this.state;
    const { visible, onOk, onCancel, group, ...props } = this.props;
    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        {...props}
        footer={null}
        width={970}
        className="group-modal-layout"
        title={group ? `编辑分组-${group.groupName}` : '新建分组'}
      >
        <div className="modal-group-form">
          <div className="group-name">收藏夹名称：</div>
          <Input
            placeholder="请填写分组名称"
            onChange={this.onChange}
            value={name}
          />
        </div>
        <span className="select-label">请在下方勾选摄像机：</span>
        <OrgSelectDevice
          defaultSelectList={group ? group.deviceList : []}
          footer={true}
          defaultExpandAll={false}
          onCancel={onCancel}
          onOk={this.submit}
          disabled={name === null || name === ''}
        />
      </Modal>
    );
  }
}
