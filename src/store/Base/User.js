import { observable, autorun, action } from 'mobx';
import { getCacheItem, setCacheItem } from '../../utils';
import UserService from '../../service/UserService';
import DeviceService from '../../service/DeviceService';
import createHistory from 'history/createBrowserHistory';
import cookie from 'js-cookie';

export default class UserStore {
  constructor() {
    autorun(() => {
      let userInfo = getCacheItem('userInfo', 'local') || {};
      let isLogin = getCacheItem('isLogin', 'session') || false;
      let theme = getCacheItem('theme', 'local') || 'default-theme';
      this.setTheme(theme);
      this.setUserInfo(userInfo);
      this.setLoginState(isLogin);
    });
  }
  @observable
  btnInfo = {}; // 按钮权限

  @observable
  isLogin = false;

  @observable
  userInfo = {};

  @observable
  theme = getCacheItem('theme', 'local') || 'default-theme';

  @observable
  lyToken = null;

  @observable
  userList = [];

  @observable
  centerInfo = {};

  @observable
  systemConfig = {};

  // 布控一体机导入文件成功路径
  @observable
  filePath = '';

  /**
   * 更新路径
   * @param {string} filePath
   */
  @action
  updateFilePath(filePath) {
    this.filePath = filePath;
  }

  /**
   * 更新羚羊云token
   * @param {string} token
   */
  @action
  updataLyToken(token) {
    this.lyToken = token;
  }

  /**
   * 更新用户信息
   * @param {Object} userInfo
   */
  @action
  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  /**
   * 修改皮肤
   * @param {string} name
   */
  @action
  setTheme(name) {
    setCacheItem('theme', name, 'local');
    this.theme = name;
  }

  @action
  setUserList(list) {
    this.userList = list;
  }
  @action
  setCenterInfo(info) {
    this.centerInfo = info;
  }
  @action
  setSystemConfig(info) {
    this.systemConfig = info;
  }
  /**
   * 登陆接口
   * @param {Object} options
   */
  loginAction(options) {
    return UserService.Login(options);
  }

  /**
   * 查询用户信息
   */
  queryUserInfo() {
    return UserService.queryUserInfo().then(res => {
      setCacheItem('userInfo', res.result.userInfo, 'local');
      this.setUserInfo(res.result.userInfo);
      return res.result;
    });
  }

  /**
   * 查询羚羊云的token
   */
  queryLyToken() {
    return DeviceService.queryLyToken().then(res => {
      if (res.result) {
        this.updataLyToken(res.result.token);
      }
    });
  }

  /**
   * 修改登陆状态
   * @param {Boolean} flag
   */
  @action
  setLoginState(flag) {
    this.isLogin = flag;
    setCacheItem('isLogin', flag, 'session');
  }

  /**
   * 新增用户
   * @param {Object} options
   */
  addUser(options) {
    return UserService.addUser(options).then(async () => {
      await this.queryUserList();
    });
  }

  userLogout() {
    return UserService.Logout().then(() => {
      this.setLoginState(false);
    });
  }

  /**
   * 更新用户
   * @param {Object} options
   */
  updateUser(options) {
    return UserService.updateUser(options).then(async () => {
      await this.queryUserList();
    });
  }

  /**发送手机有验证码 */
  sendLoginIdentifyCode(phoneNum) {
    return UserService.sendCode(phoneNum);
  }

  /**修改用户头像 */
  editUserLogp(options) {
    return UserService.updateUserLogo(options);
  }

  /**
   * 删除用户
   * @param {Object} options
   */
  deleteUser(options) {
    return UserService.deleteUser(options).then(async () => {
      await this.queryUserList();
    });
  }

  getUserList(params) {
    return UserService.queryUserList(params);
  }

  /**
   * 修改密码
   * @param {Object} params
   */
  changePassword(params) {
    return UserService.changePassword(params);
  }

  queryWebConfig() {
    return UserService.queryWebConfig().then(res => {
      window.webConfig = res;
    });
  }

  /**
   * 获取系统服务器时间
   */
  getSystemTime() {
    return UserService.getSystemTime();
  }

  queryCenterInfo(id) {
    return UserService.queryCenterInfo(id).then(res => {
      this.setCenterInfo(res.result);
    });
  }

  getUserZoomLevelCenter() {
    return UserService.getUserZoomLevelCenter().then(res => {
      document.title = res.result.systemName || '智慧云眼';
      this.setSystemConfig(res.result);
    });
  }
  countAlarmCountByUserIds(data) {
    return UserService.countAlarmCountByUserIds(data);
  }

  @action
  logout() {
    this.setLoginState(false);
    cookie.remove('token');
    window.sessionStorage.clear();
    // window.GlobalStore.TabStore.tabList = [];
    window.location.replace('/login');
  }
}
