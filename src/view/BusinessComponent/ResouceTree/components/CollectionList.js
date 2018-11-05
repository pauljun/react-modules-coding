import React from 'react';
import IconFont from '../../../../components/IconFont';
import DeviceIcon from '../../../../components/DeviceIcon';
import PropTypes from 'prop-types';
import { AutoSizer, List } from 'react-virtualized';
import { Collapse, message, Modal } from 'antd';
import { stopPropagation } from '../../../../utils';
const Panel = Collapse.Panel;
const confirm = Modal.confirm;

export default class CollectionList extends React.Component {
  static contextTypes = {
    isMapMode: PropTypes.bool,
    selectCount: PropTypes.number,
    onSelectDevice: PropTypes.func,
    selectDevice: PropTypes.array,
    deleteGroupDevice: PropTypes.func,
    deleteGroup: PropTypes.func,
    showGroupModal: PropTypes.func,
    showLoopSettingLayout: PropTypes.func,
    loopGroupName: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null
    };
  }
  onChange = key => {
    this.setState({ activeKey: key[key.length - 1] });
  };
  clickDeviceItem(item) {
    const { onSelectDevice } = this.context;
    onSelectDevice(item);
  }
  deleteDevice(e, groupName, item) {
    stopPropagation(e);
    let data = {
      groupName,
      deviceKey: `${item.manufacturerDeviceId}/${item.deviceName}`
    };
    this.context
      .deleteGroupDevice(data)
      .then(() => message.success('操作成功！'));
  }
  deleteGroup(e, name) {
    stopPropagation(e);
    const { deleteGroup } = this.context;
    confirm({
      title: '提示',
      content: `确定删除分组“${name}”`,
      onOk() {
        return deleteGroup(name).then(() => message.success('操作成功！'));
      },
      onCancel() {}
    });
  }
  editGroup = (e, group) => {
    stopPropagation(e);
    const { showGroupModal } = this.context;
    showGroupModal(true, group);
  };
  loopVideo = (e, group) => {
    stopPropagation(e);
    this.context.showLoopSettingLayout(group, true);
  };
  rowRender = ({ key, style, data, groupName }) => {
    const { selectDevice } = this.context;
    const ids = selectDevice.map(v => v.id);
    return (
      <div
        style={style}
        className={`device-item ${ids.indexOf(data.id) > -1 ? 'active' : ''}`}
        key={key}
        onClick={() => this.clickDeviceItem(data)}
      >
        <div className="device-item-layout">
          <DeviceIcon
            onlineClass="device-online"
            offlineClass="device-offline"
            type={data.deviceType}
            status={data.deviceData}
            deviceType={data.manufacturerDeviceType}
          />
          <span className="device-name">{data.deviceName}</span>
          <span className="device-item-tools">
            <IconFont
              type="icon-Delete_Main"
              title="删除"
              onClick={e => this.deleteDevice(e, groupName, data)}
            />
          </span>
        </div>
      </div>
    );
  };
  render() {
    const { isMapMode, loopGroupName } = this.context;
    const { activeKey } = this.state;
    const { collectionList } = this.props;
    return (
      <div className="collection-list-layout">
        <Collapse
          bordered={false}
          onChange={this.onChange}
          activeKey={activeKey}
        >
          {collectionList.map(item => (
            <Panel
              showArrow={false}
              className={`${
                loopGroupName === item.groupName ? 'loopGroup-item' : ''
              }`}
              header={
                <span className="group-name-layout">
                  <IconFont
                    type={
                      activeKey === item.groupName
                        ? 'icon--_Main'
                        : 'icon-_Main1'
                    }
                  />
                  <span>{item.groupName}</span>

                  <span className="group-tools">
                    {!isMapMode && (
                      <IconFont
                        type="icon-RoundPlay_Main"
                        onClick={e => this.loopVideo(e, item)}
                        title="轮巡"
                      />
                    )}
                    <IconFont
                      title="编辑"
                      type="icon-Edit_Main"
                      onClick={e => this.editGroup(e, item)}
                    />
                    <IconFont
                      title="删除"
                      type="icon-Delete_Main"
                      onClick={e => this.deleteGroup(e, item.groupName)}
                    />
                  </span>
                  <span className="device-count">
                    <i className="online-count">
                      {
                        item.deviceList.filter(v => v.deviceData * 1 === 1)
                          .length
                      }
                      /
                    </i>
                    <i className="count">{item.deviceList.length}</i>
                  </span>
                </span>
              }
              key={item.groupName}
            >
              <div
                className="device-list-content"
                style={{
                  height: `calc(100vh - ${50 +
                    72 +
                    44 +
                    30 * collectionList.length +
                    collectionList.length}px)`
                }}
              >
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      width={width}
                      height={height}
                      rowCount={item.deviceList.length}
                      rowHeight={25}
                      rowRenderer={({ key, index, style }) =>
                        this.rowRender({
                          key,
                          index,
                          style,
                          data: item.deviceList[index],
                          groupName: item.groupName
                        })
                      }
                    />
                  )}
                </AutoSizer>
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  }
}
