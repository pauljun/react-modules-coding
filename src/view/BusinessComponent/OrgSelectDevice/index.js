import React from 'react';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';

import * as _ from 'lodash';
import { computTreeList } from 'src/utils';
import OrgTreeWithCount from '../OrgTreeWithDevice/components/OrgTreeWithCount';
import DeviceList from '../DeviceList';
import ModalFooter from '../ModalFooter';
import InputSearch from 'src/components/SearchInput';

import './index.scss';

/* 
  组件：从组织树选择设备
  参数：
  className
  defaultSelectList： 默认选择设备集合（设备的详细信息, 至少包含id 和 deviceName）
  onChange: 选中列表改变事件
  footer: 是否显示底部按钮
  onOk： 确定按钮
  onCancel： 取消按钮
*/
@inject('DeviceStore', 'OrgStore')
export default class OrgSelectDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '', // 搜索关键字
      selectOrgId: null, // 选中组织的id
      orgDeviceList: [], // 选中组织下的设备列表
      selectDeviceList: [] // 已选设备集合
    };
  }

  handleSubmit = () => {
    const { onOk } = this.props;
    onOk && onOk(this.state.selectDeviceList);
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  // 选中列表改变事件
  handleChange = (selectDeviceList, update = true) => {
    this.setState({
      selectDeviceList
    });
    const { onChange } = this.props;
    update && onChange && onChange(selectDeviceList);
  };

  // 清空已选设备
  clearSelect = () => {
    this.handleChange([]);
  };

  // 列表全选事件
  handleCheckAllChange = checked => {
    const { orgDeviceList, selectDeviceList } = this.state;
    let selectList = [];
    if (checked) {
      selectList = _.uniq([].concat(selectDeviceList, orgDeviceList));
    } else {
      selectList = _.differenceBy(selectDeviceList, orgDeviceList, 'id');
    }
    this.handleChange(selectList);
  };

  // 单个选中改变事件
  handleCheckItemChange = (checked, item) => {
    let { selectDeviceList } = this.state;
    if (checked) {
      selectDeviceList.push(item);
      // 数组求交集
      selectDeviceList = _.intersectionBy(
        this.props.DeviceStore.cameraArray,
        selectDeviceList,
        'id'
      );
      this.handleChange(selectDeviceList);
    } else {
      this.deleteDeviceItem(item);
    }
  };

  // 删除单个已选设备
  deleteDeviceItem = item => {
    let { selectDeviceList } = this.state;
    selectDeviceList = selectDeviceList.filter(v => v.id !== item.id);
    this.handleChange(selectDeviceList);
  };

  // 组织树选中事件
  handleSelectOrg = item => {
    const { selectOrgId, keyWord } = this.state;
    const newOrgId = item[0] ? item[0] : selectOrgId;
    if (newOrgId !== selectOrgId) {
      this.queryDevice(keyWord, newOrgId);
    } else {
      this.setState({
        selectOrgId: newOrgId
      });
    }
  };

  // 设备查询
  queryDevice = (keyWord, selectOrgId) => {
    keyWord = _.trim(keyWord);
    let arr = this.props.DeviceStore.cameraArray;
    if (selectOrgId) {
      // arr = selectOrgId
      //   ? arr.filter(item => item.organizationIds.indexOf(selectOrgId) > -1)
      //   : arr;
      let orgIds = window.GlobalStore.OrgStore.queryOrgIdsForParentOrgId(selectOrgId);
      arr = arr.filter(item => {
        let flag = false;
        if (!Array.isArray(item.organizationIds)) {
          item.organizationIds = [];
        }
        for (let i = 0, l = item.organizationIds.length; i < l; i++) {
          if (orgIds.indexOf(item.organizationIds[i]) > -1) {
            flag = true;
            break;
          }
        }
        return flag;
      });
    } else {
      arr = keyWord
        ? arr.filter(
            item => item.deviceName && item.deviceName.indexOf(keyWord) > -1
          )
        : arr;
    }
    selectOrgId = selectOrgId ? selectOrgId : this.listOrg[0].id;
    this.setState({
      orgDeviceList: arr,
      keyWord,
      selectOrgId
    });
    return arr;
  };

  componentWillMount() {
    const { OrgStore, defaultSelectList } = this.props;
    const orgList = OrgStore.orgArray;
    this.listOrg = computTreeList(_.cloneDeep(toJS(orgList))) || [{}];
    const selectOrgId = this.listOrg[0].id;
    if (defaultSelectList && defaultSelectList.length) {
      this.handleChange(_.cloneDeep(toJS(defaultSelectList)));
    }
    this.setState(
      {
        selectOrgId
      },
      () => {
        this.queryDevice();
      }
    );
  }

  render() {
    const {
      className = '',
      footer = true,
      disabled,
      defaultExpandAll
    } = this.props;
    const { selectOrgId, selectDeviceList, orgDeviceList } = this.state;
    return (
      <div className={`org-select-device-wrapper ${className}`}>
        {/* <SearchInput
          className='device-search-wrapper'
          placeholder="请输入摄像机名称"
          onSearch={(value) => this.queryDevice(value)}
        /> */}
        <InputSearch
          className="device-search-wrapper"
          placeholder="请输入摄像机名称"
          onSearch={value => this.queryDevice(value)}
        />
        <OrgTreeWithCount
          className="org-select-wrapper"
          activeKey={[selectOrgId]}
          onSelect={this.handleSelectOrg}
          showSlideIcon={false}
          slideOrg
          defaultExpandAll={defaultExpandAll}
          orgList={this.listOrg}
          isMapMode={true}
        />
        <DeviceList
          className="org-device-wrapper"
          deviceList={orgDeviceList}
          selectDeviceList={selectDeviceList}
          onCheckAllChange={this.handleCheckAllChange}
          onCheckItemChange={this.handleCheckItemChange}
        />
        <DeviceList
          className="select-device-wrapper"
          deviceList={selectDeviceList}
          clearSelect={this.clearSelect}
          checkable={false}
          title={`已选摄像机(${selectDeviceList.length}个)`}
          deleteDeviceItem={this.deleteDeviceItem}
        />
        {footer && (
          <ModalFooter
            disabled={disabled}
            className="operate-wrapper"
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
          />
        )}
      </div>
    );
  }
}
