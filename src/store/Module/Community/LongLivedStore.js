import { observable, action } from 'mobx';
import { Promise } from 'core-js';
import CommunityService from '../../../service/Community/CommunityService';
class LongLivedStore {
  /**搜索条件 */
  @observable
	searchOption = {
    ///type:1,
    villageIds:[],
    tagCodes:[],
    fuzzyContent:'',
    faceFeature:'',
    //peroidType:'', 
		page: 1,
		 pageSize: 24,
		//startTime: undefined,
    //endTime: undefined,
    //sortType:'', 
    collectionType:1
  };
  @observable
	searchOptionUnappear = {
    //type:2,
    villageIds:[],
    tagCodes:[],
    fuzzyContent:'',
    faceFeature:'',
    //peroidType:'',
		page: 1,
		pageSize: 24,
		//startTime: undefined,
    //endTime: undefined,
    //sortType:'',
    collectionType:0
  };
  @action
  editSearchData(options) {
    return new Promise(resolve => {
      let params = Object.assign({}, this.searchOption,options)
      this.searchOption=params
      resolve()
    })
  }
  /**查询常住用户列表 */
  getListPersonalInformation(option) {
    return CommunityService.getListPersonalInformation(option).then(res => {
      return res.result?res.result:[]
    });
  }
  	//常住人口抓拍数（小区维度）
	getcountPeopleByVillage(option) {
		return CommunityService.getcountPeopleByVillage(option);
  }
  //常住人口分类统计图
	getCountPeopleTypeByVillageIds(option) {
		return CommunityService.getCountPeopleTypeByVillageIds(option);
	}
}

export default new LongLivedStore();