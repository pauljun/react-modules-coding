import CommunityService from '../../../service/Community/CommunityService';
import { observable, action } from 'mobx';

class CommunityEntry {
	@observable searchData = {};
	/**編輯搜索條件 */
	editSearchData(options) {
		return new Promise((resolve) => {
			let params = Object.assign({}, this.searchData, options);
			this.setData({ searchData: params });
			resolve();
		});
	}

	//小区总览列表查询
	searchCommunityList(option) {
		return CommunityService.searchCommunityList(option).then((res) => res.result);
	}

	//已登记、未登记人口数量统计
	getCountPeopleByVillIds(option) {
		return CommunityService.getCountPeopleByVillIds(option).then((res) => res.result);
	}

	//查询小区绑定设备
	getvillageDevices(option) {
		return CommunityService.getvillageDevices(option).then((res) => res.result);
	}

	//小区数据统计面板
	getCountVillageSolidData(option) {
		return CommunityService.getCountVillageSolidData(option).then((res) => res.result);
  }
  
	//小区实有设备统计
	getCountDeviceByVillage(option) {
		return CommunityService.getCountDeviceByVillage(option).then((res) => res.result);
	}

		//查询用户权限下的所有小区设备列表
		selectCommunityDeviceByUserId(option) {
			return CommunityService.selectCommunityDeviceByUserId(option).then((res) => res.result);
		}
}

export default new CommunityEntry();
