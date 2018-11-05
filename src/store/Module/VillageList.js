import { observable, action } from 'mobx';
import Service from '../../service/Community/VillageService';
import UserService from '../../service/UserService';

class VillageListStore {
  @observable
  searchData = {
    key: '',
    page: 1,
    pageSize: 10
  };

  @action
  initData() {
    this.searchData = {
      key: '',
      page: 1,
      pageSize: 10
    };
  }

  @action
  mergeSearchData(data) {
    this.searchData = Object.assign(this.searchData, { ...data });
  }

  getList() {
    let searchData = this.searchData;
    searchData.keyWord = searchData.key;
    return Service.getVillageList(searchData);
  }

  getUserList() {
    return UserService.queryUserList().then(res => {
      if (Array.isArray(res.result.list)) {
        return res.result.list.map(item => {
          return {
            id: item.id,
            parentId: item.organizationId,
            name: item.realName,
            type: 'user',
            title: item.realName
          };
        });
      } else {
        return [];
      }
    });
  }

  assignedByUser(options) {
    return Service.assignedByUser(options);
  }

  /**添加小区 */
  add(options) {
    return Service.add(options);
  }

  /**编辑小区 */
  update(options) {
    return Service.update(options);
  }

  /**查询小区 */
  getDetail(id) {
    return Service.getDetail(id).then(res => res.result);
  }
}

export default new VillageListStore();
