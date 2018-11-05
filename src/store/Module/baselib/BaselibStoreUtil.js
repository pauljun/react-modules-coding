import { action, observable } from 'mobx'
import Service from '../../../service/BaselibService';
  


class BaselibStoreUtil {
  
  @observable searchData = {}

  // 初始化store
  initData(searchData){
    this.initSearchData(searchData);
  }

  // 编辑搜索条件
  editSearchData(options){
    const searchData = Object.assign({}, this.searchData, options);
    return this.setData({ searchData })
  }

  /* 处理deviceId */
  getDeviceId(list) {
    return list.map(v => v.manufacturerDeviceId + '' || v.id + '');
  }

  // type: face, body, vehicle
  getList(type, options) {
    const searchData = this.handleSearchData(options);
    return Service.getList(type, searchData)
  }

  // type: face, body
  getTotal(type) {
    const urlType = {
      face: 'faceListSize',
      body: 'bodyListSize',
    }
    let pageType = 0, maxId, minId;
    const oldSearchData = Object.assign({}, this.searchData, { pageType, maxId, minId })
    const searchData = this.handleSearchData(oldSearchData);
    return Service.getListSize(urlType[type], searchData);
  }

  @action
  setData(json) {
    for (var k in json) {
      if (this.hasOwnProperty(k)) {
        this[k] = json[k]
      }
    }
    return Promise.resolve()
  }
}

export default BaselibStoreUtil
