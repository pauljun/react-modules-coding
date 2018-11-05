import { httpRequest } from '../../utils/HttpUtil';
import { VILLAGE } from '../RequestUrl';

@httpRequest
class VillageService {
  /**
   * 小区列表
   * @param {Object} options
   */
  getVillageList(options) {
    return this.$httpRequest({
      url: VILLAGE.TABLE_LIST.value,
      method: 'POST',
      data: options
    });
  }

  /**
   *
   * @param {Object} options
   */
  getCentersByVillage(id) {
    return this.$httpRequest({
      url: VILLAGE.GET_CENTER_BY_VILLAGE.value.replace('<id>', id),
      method: 'GET'
    });
  }
  /**
   *
   * @param {Object} options
   */
  assignedByVillage(options) {
    return this.$httpRequest({
      url: VILLAGE.ASSIGNED_BY_VILLAGE.value,
      method: 'POST',
      data: options
    });
  }
  /**
   *
   * @param {Object} options
   */
  resetVillage(options) {
    return this.$httpRequest({
      url: VILLAGE.RESET_VILLAGE.value,
      method: 'POST',
      data: options
    });
  }
  /**
   *
   * @param {Object} options
   */
  assignedByUser(options, description = '编辑小区') {
    let logInfo = {
      description,
      ...VILLAGE.ASSIGNED_BY_USER.logInfo[0]
    };
    return this.$httpRequest({
      url: VILLAGE.ASSIGNED_BY_USER.value,
      method: 'POST',
      data: options,
      logInfo
    });
  }
  queryVillageDevices(id) {
    return this.$httpRequest({
      url: VILLAGE.villageDevice.value,
      method: 'POST',
      data: { villageId: id }
    });
  }
  updateVillageDevices(options) {
    return this.$httpRequest({
      url: VILLAGE.villageDeviceUpdate.value,
      method: 'POST',
      data: options
    });
  }
  queryUnbindedVillageDevices() {
    return this.$httpRequest({
      url: VILLAGE.queryUnbindedVillageDevices.value,
      method: 'POST'
    });
  }
}

export default new VillageService();
