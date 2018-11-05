import { Config } from '../Config';
export default {
  villageModule: {
    code: 107000,
    text: '小区管理',
    moduleName: 'VillageView'
  },
  enterVillageModule: {
    text: '进入小区管理界面',
    code: 1070000,
    parent: 107000,
    moduleName: 'VillageView',
  },
  TABLE_LIST: {
    value: `${Config.api}cloud/community/villageManageListByPage`,
    label: '获取小区列表'
  },
  GET_CENTER_BY_VILLAGE:{
    value:`${Config.api}cloud/community/getCentersByVillage/<id>`,
    label:'获取小区分配的运营中心'
  },
  ASSIGNED_BY_VILLAGE:{
    value:`${Config.api}cloud/community/assignedByVillage`,
    label:'平台管理员给小区分配运营中心'
  },
  RESET_VILLAGE:{
    value:`${Config.api}cloud/community/resetVillage`,
    label:'重置小区'
  },
  ASSIGNED_BY_USER:{
    value:`${Config.api}cloud/community/assignedByUser`,
    label:'运营中心管理员给小区分配用户',
    logInfo: [{
      code: 107001,
      parent: 107000,
      text: '编辑小区'
     }]
  },
  villageDevice:{
    value:`${Config.api}villageDevice/queryVillageDevices`,
    label:'查询小区绑定设备'
  },
  villageDeviceUpdate:{
    value:`${Config.api}villageDevice/update`,
    label:'小区绑定设备'
  },
  queryUnbindedVillageDevices:{
    value:`${Config.api}villageDevice/queryUnbindedVillageDevices`,
    label:'查询未分配到小区的设备'
  }
}
