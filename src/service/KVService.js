
import { httpRequest } from '../utils/HttpUtil';
import { KV_STORE } from './RequestUrl';
import * as _ from 'lodash'

@httpRequest
class KVService {
  getKVStore(userId, storeKey) {
    return this.$httpRequest({
      url: KV_STORE.GET_DATA.value,
      method: 'POST',
      data: { 
        storeKey,
        userId
      }
    }).then(result => {
      const storeValue = result.result && result.result.userKvStroe && result.result.userKvStroe.storeValue;
      if(!storeValue){
        return false
      } 
      return JSON.parse(storeValue)
    })
  }
  setKVStore(userId, storeKey, storeValue,logName) {
    let options={
      userId,
      storeKey,
      storeValue
    }
    let bodyStr = ''
    for (var k in options) {
      bodyStr += `&${k}=${_.isObject(options[k]) ? JSON.stringify(options[k]) : options[k]}`
    }
    bodyStr = bodyStr.substring(1);
    let logInfo =( logName && logName === 'Panel') ? {...KV_STORE.PANEL_CODE} : null
    return this.$httpRequest({
      url: KV_STORE.SET_DATA.value,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: 'POST',
      data: bodyStr,
      logInfo
    })
  }
}

export default new KVService();