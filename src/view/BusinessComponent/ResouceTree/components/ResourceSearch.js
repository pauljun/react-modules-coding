import React from 'react';
import SearchForm from './SearchForm';
import OrgTreeWithDevice from '../../../BusinessComponent/OrgTreeWithDevice';
import CollectionList from './CollectionList';
import { computTreeList } from '../../../../utils';
import IconFont from '../../../../components/IconFont'
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import * as _ from 'lodash';

import '../style/resouce-search.scss';

export default class ResourceSearch extends React.Component {
  static contextTypes = {
    isMapMode: PropTypes.bool,
    showLoopSettingLayout: PropTypes.func,
    isLoop: PropTypes.bool,
    loopOrgInfo: PropTypes.object,
    showGroupModal:PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      isResource: true,
      form: {
        keyword: '',
        status: '',
        type: '',
        org: ''
      }
    };
  }
  changeForm(form) {
    this.setState({ form });
  }
  queryDevice(list, params) {
    let { keyword, status, type, org } = params;
    let arr = list;
    keyword = _.trim(keyword);
    if (!keyword && !status && !type && !org) {
      return arr;
    }
    if (!!org) {
      let orgIds = window.GlobalStore.OrgStore.queryOrgIdsForParentOrgId(org);
      arr = list.filter(item => {
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
    }
    !!keyword
      ? (arr = arr.filter(
          item => item.deviceName && item.deviceName.indexOf(keyword) > -1
        ))
      : null;

    !!type && type !== '-1'
      ? (arr = arr.filter(item => item.deviceType * 1 === type * 1))
      : null;

    !!status && status !== '-1'
      ? status * 1 === 0
        ? (arr = arr.filter(item => item.deviceData * 1 === 0))
        : (arr = arr.filter(item => item.deviceData * 1 === 1))
      : null;

    return arr;
  }
  changeOrg(id) {
    const { form } = this.state;
    this.setState({ form: Object.assign(form, { org: id }) });
  }
  addGroup = () => {
    const {showGroupModal} = this.context;
    showGroupModal()
  }
  render() {
    const { deviceList, orgList, collectionList } = this.props;
    const { isResource, form } = this.state;
    const {
      isMapMode,
      showLoopSettingLayout,
      isLoop,
      loopOrgInfo
    } = this.context;
    const listOrg = computTreeList(_.cloneDeep(toJS(orgList)));
    const listDevice = this.queryDevice(deviceList, form);
    return (
      <div className="resource-search">
        <div className="tab-layout">
          <div
            onClick={() => !isResource && this.setState({ isResource: true })}
            className={`tab-item ${isResource ? 'tab-item-active' : ''}`}
          >
            全部资源
          </div>
          <div
            onClick={() => isResource && this.setState({ isResource: false })}
            className={`tab-item ${!isResource ? 'tab-item-active' : ''}`}
          >
            我的收藏 <IconFont type="icon-_Main1" onClick={this.addGroup} style={{fontSize:14}}></IconFont>
          </div>
        </div>
        <div className={`resource-part ${!isResource ? 'hide-resource' : ''}`}>
          <SearchForm changeForm={this.changeForm.bind(this)} />
          <OrgTreeWithDevice
            changeOrg={this.changeOrg.bind(this)}
            deviceList={listDevice}
            orgList={listOrg}
            isMapMode={isMapMode}
            isLoop={isLoop}
            keyword={form.keyword}
            showLoopSettingLayout={showLoopSettingLayout}
            collectionList={collectionList}
            loopOrgInfo={loopOrgInfo}
            className="org-tree-with-device"
          />
        </div>
        <div
          className={`collection-part ${isResource ? 'hide-collection' : ''}`}
        >
          <CollectionList collectionList={collectionList} />
        </div>
      </div>
    );
  }
}
