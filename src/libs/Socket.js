import io from './socket.io-1.4.5';
import cookie from 'js-cookie';
import EventEmitter from './EventEmitter';
import { Logger, unenumerable } from '../utils/Decorator';

@Logger('Socket', true)
class Socket extends EventEmitter {
  @unenumerable
  sokect = null;
  connect() {
    if (!this.sokect) {
      let url =
        process.env.NODE_ENV !== 'production'
          ? `${window.location.hostname}:8892/socket.io`
          : '/socket.io';

      const token = cookie.get('token');
      this.Logger.debug('第一次尝试连接socket.io');
      this.sokect = io(`${url}?token=${token}`);
      this.sokect.on('connect', () => {
        this.Logger.success('连接成功');
      });
      this.sokect.on('disconnect', () => {
        this.Logger.warn('断开连接');
      });

      //TODO 订阅所有事件
      this.subscribeAllRealAlarm();
      this.libsImportEvent();
      this.subscribeAlarmNum();
    }
  }
  disconnect() {
    this.sokect && this.sokect.disconnect();
    this.sokect = null;
  }
  /**
   * 监听所有报警信息
   * @update hjj 2018年10月15日12:25:36
   */
  subscribeAllRealAlarm() {
     /* setInterval(() => {
this.emit('alarm',{
  alarmLogId: "93B98B58DBD248B59CAA669DD2E6676D",
alarmNotifyUsers: null,
alarmTime: "1539857798942",
cameraId: 538379224,
cameraName: "产品市场部抓拍机",
captureTime: "1539858008000",
cid: null,
collectId: null,
collectStatus: null,
facePath: "https://jxsr-oss1.antelopecloud.cn/files?access_token=2147500035_3356491776_1546271999_25d08183632312b0cb0aa941896abe27&key=%2f1539858008000002",
faceRect: "1248,222,72,67",
geoAddress: null,
id: "370857F2133941228A10EDA7E2864649",
imageUrl: "https://jxsr-oss1.antelopecloud.cn/files?obj_id=5bc19dc48000400304103f8b&access_token=2147500035_3356491776_1570950032_61ab10fb564e60ee48e60071ad979bea",
infoId: "6896620",
isEffective: null,
isHandle: 0,
latitide: null,
libId: "101000009818",
libName: "重点人员库名称1",
logType: "2",
longitude: null,
objectMainJson: {name: "face (51)", identityNumber: ""},
oid: null,
operationDetail: null,
scenePath: "https://jxsr-oss1.antelopecloud.cn/files2/538379224/5bc85e58201703d8041004a2?access_token=538379224_0_1571393797_7fd255fc2e648f3c2dccbefbb942c903&key=%2Fiermu%2Fai%2F137898535035_538379224_1539858008128_1539858008579220684.jpg",
similarity: 88.40524291992188,
structuredInfoJson: {attr: {age: 0, eyeglass: 0, facemask: 0, female: 0, male: 0}},
taskId: "AE6C274EC75449C28F2E9709EAFF0077",
taskName: "重点人员布控任务1",
taskType: 101501
})

    },3000)  */
      this.sokect.on('alarm', data => {
      let json;
      this.Logger.debug('alarm', data);
      try {
        json = JSON.parse(data);
      } catch (e) {
        data = json;
      }
      this.emit('alarm', json);
    });
  }

  /**
   * 监听布控一体机导入成功事件
   * @update hjj 2018年10月15日12:25:36
   */
  libsImportEvent() {
    this.sokect.on('importLib', data => {
      let json;
      this.Logger.debug('importLib', data);
      try {
        json = JSON.parse(data);
      } catch (e) {
        json = data;
      }
      this.emit('importLib', json);
    });
  }

  /**
   * 推送报警数量
   * @update hjj 2018年10月15日12:25:36
   */
  subscribeAlarmNum() {
    this.sokect.on('alarmNum', data => {
      let json;
      this.Logger.debug('alarmNum', data);
      try {
        json = JSON.parse(data);
      } catch (e) {
        json = data;
      }
      this.emit('alarmNum', json);
    });
  }

}

export default new Socket();
