import { observable, action } from 'mobx';
import Service from 'src/service/DeviceService';
import _ from 'lodash';
import { DeviceType } from '../../../libs/DeviceLib';

class OperationCenterDeviceSollotStore {
  /**左侧栏查询条件 */
  @observable
  allSearchData = {
    deviceName: null,
    sn: null,
    page: 1,
    pageSize: 20,
    orderType: '-1',
    deviceType: '-1',
    distributionState: '2',
    lygroupId: '-1'
  };

  /**右侧栏查询条件 */
  @observable
  searchData = {
    deviceName: null,
    sn: null,
    page: 1,
    pageSize: 20,
    lygroupId: '-1'
  };

  @action
  mergeAllSearchData(data) {
    this.allSearchData = Object.assign(this.allSearchData, { ...data });
  }

  @action
  mergeSearchData(data) {
    this.searchData = Object.assign(this.searchData, { ...data });
  }

  @action
  initData() {
    this.initAllSearch();
    this.initSearch();
  }

  @action
  initAllSearch() {
    this.allSearchData = {
      deviceName: null,
      sn: null,
      page: 1,
      pageSize: 20,
      orderType: '-1',
      deviceType: '-1',
      distributionState: '2',
      lygroupId: '-1'
    };
  }

  @action
  initSearch() {
    this.searchData = {
      deviceName: null,
      sn: null,
      page: 1,
      pageSize: 20,
      lygroupId: '-1'
    };
  }

  /**
   * 列表查询所有设备
   */
  getAllList(id) {
    let searchData = Object.assign({}, this.allSearchData);
    if(searchData.deviceType === '-1'){
      let deviceTypes = DeviceType.filter(v => v.value !== '-1' && v.label !== '单兵').map(v => v.value)
      searchData.deviceTypes = deviceTypes
    }
    _.forIn(searchData, (value, key) => {
      if (!value || value === '-1') {
        searchData = _.omit(searchData, [key]);
      }
    });
    searchData.currentOptCenterId = id;
    return Service.getCameraList(searchData);
  }

  /**地图查询所有设备 */
  getMapAllList(id){
    return Service.getCameraList({
      currentOptCenterId: id,
      distributionState: '2',
      page: 1,
      pageSize: 20000
    })
  }

  /**
   * 查询当前运营中心下设备
   */
  getList(id) {
    let searchData = this.searchData;
    _.forIn(searchData, (value, key) => {
      if (!value || value === '-1') {
        searchData = _.omit(searchData, [key]);
      }
    });
    searchData.operationCenterIds = [id];
    return Service.getCameraListByOcId(searchData);
  }

  /**
   * 分配设备
   */
  updateDeviceOcId(params) {
    return Service.updateDeviceOcId(params);
  }
}

export default new OperationCenterDeviceSollotStore();
