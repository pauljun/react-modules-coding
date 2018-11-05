import { observable, action, toJS, computed, autorun } from 'mobx';
import { computTreeList } from '../../utils';
import OrgService from '../../service/OrgService';
import { setCacheItem, getCacheItem } from '../../utils';

export default class OrgStore {
  constructor() {
    autorun(() => {
      if (process.env.NODE_ENV !== 'production') {
        const orgList = getCacheItem('orgList') || [];
        this.setOrgList(orgList);
      }
    });
  }
  @observable
  orgList = [];

  @action
  setOrgList(list) {
    this.orgList = list;
    if (process.env.NODE_ENV !== 'production') {
      setCacheItem('orgList', list);
    }
  }

  @computed
  get orgArray() {
    return this.orgList.map(v => {
      return {
        id: v.id,
        type: 'org',
        parentId: v.parentId,
        name: v.name,
        title: v.name,
        organizationType: v.organizationType,
        deviceCount: {
          onlineCount: v.deviceCount ? v.deviceCount.onlineCount : 0,
          count: v.deviceCount ? v.deviceCount.count : 0
        }
      };
    });
  }

  /**获取组织结构树 */
  getOrgList() {
    return OrgService.getList({}).then(orgList => {
      let list = [];
      orgList.map(v =>
        list.push({
          name: v.organizationName,
          id: v.id,
          parentId: v.parentId,
          desc: v.desc,
          type: v.organizationType,
          createTime: v.createTime,
          orgSort: v.orgSort
        })
      );
      this.setOrgList(list);
    });
  }

  /*根据组织id获取当前组织详细信息*/
  getOrgInfoByOrgId(orgId) {
    return OrgService.getList({}).then(res => {
      let newid = res.filter(v => v.id === orgId)[0];
      return newid;
    });
  }

  /**获取层级组织结构 */
  @computed
  get orgAllList() {
    let orgList = toJS(this.orgList);
    return computTreeList(orgList);
  }

  /**
   * 获取组织下的所有组织id
   * @param {string} orgId
   * @param {Array} ids = []
   */
  queryOrgIdsForParentOrgId(orgId, ids = []) {
    this.orgList.forEach(item => {
      if (item.id === orgId) {
        ids.push(item.id);
      }
      if (item.parentId === orgId) {
        this.queryOrgIdsForParentOrgId(item.id, ids);
      }
    });
    return ids;
  }

  /**根据orgId获取当前组织下所有组织 */
  getOrgListByOrgId(orgId) {
    let orgList = toJS(this.orgList);
    let list = orgList.filter(v => v.id === orgId);
    let arr = [];
    function treeInit(item, orgList) {
      if (!item) {
        return;
      }
      let newArray = orgList.filter(v => v.parentId === item.id);
      arr = arr.concat(newArray);
      newArray.map(v => treeInit(v, orgList));
    }
    treeInit(list[0], orgList);
    return arr;
  }

  /**根据组织id获取父级组织*/
  getParentOrgListByOrgId(orgId, list = []) {
    this.orgList.forEach(item => {
      if (item.id === orgId) {
        list.push(item);
        if (item.parentId) {
          this.getParentOrgListByOrgId(item.parentId, list);
        }
      }
    });
    return list;
  }

  getOrgTreeText(orgId) {
    let arr = this.getParentOrgListByOrgId(orgId);
    let text = '';
    arr.reverse().map((m, i) => {
      return (text = text + m.name + (i === arr.length - 1 ? '' : ' > '));
    });
    return text;
  }

  /*获取组织树与摄像机列表*/
  getOrgsCameraLists(orgId, userType, ocId, buttonInfo, cb) {
    this.orgId = orgId;
    this.userType = userType;
    this.ocId = ocId;
    // 获取组织列表
    let data = {};
    if (orgId && userType !== 100702 && userType !== 100703) {
      data = { pid: orgId || this.orgid };
    }
    OrgService.getList(data).then(res => {
      let orgList = [];
      if (res && res.length) {
        res.map(org => {
          if (!org) {
            return;
          }
          orgList.push({
            id: org.id,
            key: org.id,
            name: org.organizationName,
            orgCode: org.organizationCode,
            parentId: org.parentId,
            children: [],
            createTime: org.createTime,
            onlineNum: 0,
            allNum: 0,
            organizationName: org.organizationName,
            organizationCode: org.organizationCode,
            organizationType: org.organizationType,
            organizationDesc: org.organizationDesc,
            // desc:org.organizationDesc,
            validStartTime: org.validStartTime,
            validEndTime: org.validEndTime
          });
        });
      }
      //this.setOrgList(orgList);
      // this.setOrgCameraList(orgList, [])
      return orgList;
    });
  }
}
