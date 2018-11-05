import { observable, action } from 'mobx';
import { Promise } from 'core-js';
import CommunityService from '../../../service/Community/CommunityService';
class FloatPersonStore {
  /**搜索条件 */
  @observable
	FloatsearchOption = {
    villageIds:[],
    //tagCodes:[],
    fuzzyContent:'',
    peroidType:0,
		page: 1,
		pageSize: 24,
		startTime: undefined,
    endTime: undefined,
    sortType:'',
    faceFeature:'',
    floatingPeopleType:0,
  };
  @observable
	FloatsearchOptionUnappear = {
    villageIds:[],
    //tagCodes:[],
    fuzzyContent:'',
    peroidType:0,
		page: 1,
    pageSize: 24,
    faceFeature:'',
		startTime: undefined,
    endTime: undefined,
    sortType:'',
    floatingPeopleType:1
  };
// 流动人口列表查询
getListFlowFace(option) {
  return CommunityService.getListFlowFace(option).then(res => {
    return res.result ?res.result:{}
  });
}
// 流动人口近七日抓拍数（小区维度）
getCountSnappingTimesForVidByVillage(option) {
  return CommunityService.getCountSnappingTimesForVidByVillage(option);
}
	// 流动人口分类统计图
	getCountVidTypeByVillageIds(option) {
		return CommunityService.getCountVidTypeByVillageIds(option);
	}
}

export default new FloatPersonStore();