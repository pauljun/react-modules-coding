import { observable, action, computed, toJS } from 'mobx';
import KVService from '../../service/KVService';
import * as _ from 'lodash';

const KEY = 'MY_GROUP';
export default class UserGroupStore {
  @observable
  listMap = {};

  @action
  get() {
    const { userInfo } = window.GlobalStore.UserStore;
    return KVService.getKVStore(userInfo.id, KEY).then(res => {
      res && this.setData(res);
    });
  }

  @action
  setData(result) {
    this.listMap = result;
  }

  @computed
  get list() {
    let list = [];
    let map = this.listMap;
    try {
      map.groups.map(v => {
        const ids = map.sets.filter(x => x.split(':')[0] === v).map(x => x.split(':')[1].split('/')[0] * 1);
        const deviceList = window.GlobalStore.DeviceStore.queryCameraListByIds(ids);
        list.push({ groupName: v, deviceList });
      });
    } catch (e) {
      console.warn('转换分组数据异常', e);
    }
    return list;
  }

  getgroupsbycid = key => {
    let map = this.listMap;
    return (
      map &&
      map.sets &&
      map.sets
        .filter(x => {
          return x.split(':')[1] === key;
        })
        .map(x => x.split(':')[0])
    );
  };

  /**
   * 添加分组
   * @param {Object} item 
   */
  add(item) {
    const { userInfo } = window.GlobalStore.UserStore;
    let mapData = this.listMap;
    let groups = new Set(mapData && mapData.groups);
    let sets = new Set(mapData && mapData.sets);
    groups.add(item.groupName);
    item.deviceIds.map(v => {
      sets.add(`${item.groupName}:${v}`);
    });
    mapData = {
      groups: Array.from(groups),
      sets: Array.from(sets)
    };
    return KVService.setKVStore(userInfo.id, KEY, mapData).then(res => {
      this.setData(mapData);
    });
  }

  /**
   * 删除分组
   */
  delete(item) {
    const { userInfo } = window.GlobalStore.UserStore;
    let mapData = this.listMap;
    let groups = mapData.groups.filter(v => {
      return v !== item.groupName;
    });
    let sets = mapData.sets.filter(v => {
      return v.split(':')[0] !== item.groupName;
    });
    return KVService.setKVStore(userInfo.id, KEY, { groups, sets }).then(() => {
      this.setData({ groups, sets });
    });
  }

  /**
   * 修改分组下的设备
   * @param {object} item 
   * @param {bool} isAdd 
   */
  edit(item, isAdd) {
    const { userInfo } = window.GlobalStore.UserStore;
    let mapData = this.listMap;
    let sets = new Set(mapData.sets);
    if (isAdd) {
      sets.add(`${item.groupName}:${item.deviceKey}`);
    } else {
      sets.delete(`${item.groupName}:${item.deviceKey}`);
    }
    mapData = {
      groups: mapData.groups,
      sets: Array.from(sets)
    };
    return KVService.setKVStore(userInfo.id, KEY, mapData).then(() => {
      this.setData(mapData);
    });
  }

  /**
   * 批量修改分组下的设备
   * @param {Array} item s
   * @param {bool} isAdd 
   */
  editDevice(items, isAdd) {
    const { userInfo } = window.GlobalStore.UserStore;
    let mapData = this.listMap;
    let sets = new Set(mapData.sets);
    items.map(item => {
      if (isAdd) {
        sets.add(`${item.groupName}:${item.deviceKey}`);
      } else {
        sets.delete(`${item.groupName}:${item.deviceKey}`);
      }
    })
    mapData = {
      groups: mapData.groups,
      sets: Array.from(sets)
    };
    return KVService.setKVStore(userInfo.id, KEY, mapData).then(() => {
      this.setData(mapData);
    });
  }

  /**
   * 修改分组
   * @param {*} item 
   * @param {*} options 
   */
  editGroup(item, options) {
    const { userInfo } = window.GlobalStore.UserStore;
    let mapData = this.listMap;
    let groups = mapData.groups.concat([]);
    let sets = mapData.sets.concat([]);
    groups[mapData.groups.indexOf(item.groupName)] = options.groupName;
    sets = sets.filter(v => {
      return v.split(':')[0] !== item.groupName;
    });
    options.deviceIds.map(v => {
      sets.push(`${options.groupName}:${v}`);
    });
    mapData = {
      groups: groups,
      sets: sets
    };
    return KVService.setKVStore(userInfo.id, KEY, {
      groups: groups,
      sets: sets
    }).then(res => {
      this.setData({
        groups: groups,
        sets: sets
      });
    });
  }
}
