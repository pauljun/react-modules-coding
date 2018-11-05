import React from 'react';
import MapView from './view/map';
import { Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import IconFont from '../../components/IconFont';
import ListView from './view/list';
import ResourceTreeView from '../BusinessComponent/ResouceTree';
import MapMarkerVideo from '../BusinessComponent/MapMarkerVideo';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { BusinessProvider } from '../../utils/Decorator/BusinessProvider';
import VideoLoopSetting from './components/VideoLoopSetting';
import videoScreen from '../../libs/Dictionary/videoScreen';
import GroupModal from './components/GroupModal';
import { exitFullscreen } from '../../utils/FullScreen';
import LogsComponent from '../../components/LogsComponent';
import './style/index.scss';

@withRouter
@BusinessProvider(
  'OrgStore',
  'DeviceStore',
  'VideoSurveillanceStore',
  'UserGroupStore',
  'TabStore'
)
@LogsComponent()
@observer
export default class VideoSurveillance extends React.Component {
  static childContextTypes = {
    isMapMode: PropTypes.bool,
    selectDevice: PropTypes.array,
    onSelectDevice: PropTypes.func,
    setDeviceListForCurrentPlayerBox: PropTypes.func,
    startVideoLoop: PropTypes.func,
    endVideoLoop: PropTypes.func,
    showLoopSettingLayout: PropTypes.func,
    closeLoopSettingLayout: PropTypes.func,
    playBoxConfig: PropTypes.array,
    isLoop: PropTypes.bool,
    loopOrgInfo: PropTypes.object,
    loopGroupName: PropTypes.string,
    deleteGroupDevice: PropTypes.func,
    addGroupDevice: PropTypes.func,
    showGroupModal: PropTypes.func,
    goPage: PropTypes.func,
    deleteGroup: PropTypes.func
  };

  getChildContext() {
    return {
      isMapMode: this.state.mapMode, //是否地图模式
      selectDevice: this.state.selectDevice, //选中的设备集合
      onSelectDevice: this.onSelectDevice, //选中设备后执行的逻辑
      setDeviceListForCurrentPlayerBox: this.setDeviceListForCurrentPlayerBox, //对比播放中的设备，匹配当前选中设备列表，去除无效的设备选中状态
      startVideoLoop: this.startVideoLoop, //
      endVideoLoop: this.endVideoLoop, //
      showLoopSettingLayout: this.showLoopSettingLayout, //
      closeLoopSettingLayout: this.closeLoopSettingLayout, //
      playBoxConfig: [], //对于轮巡的窗口配置
      isLoop: this.state.isLoop, //轮巡的状态
      loopOrgInfo: this.state.loopOrgInfo,
      loopGroupName: this.state.loopGroupName,
      deleteGroupDevice: this.deleteGroupDevice,
      addGroupDevice: this.addGroupDevice,
      showGroupModal: this.showGroupModal,
      goPage: this.goPage,
      deleteGroup: this.deleteGroup
    };
  }

  constructor(props) {
    super(props);
    const { location } = this.props;
    this.mapViewRef = React.createRef();
    this.listViewRef = React.createRef();
    this.playerDatas = []; //当前播放的视频列表

    //TODO 轮巡相关
    this.loopList = []; //轮巡设备列表
    this.loopInterval = 1000; //轮巡间隔时间
    this.loopVideoBox = null; //可轮巡的播放容器配置
    this.loopListNumber = 1; //轮巡设备的页数
    this.loopTimer = null; //轮巡定时器
    this.loopOneListSize = 0; //每次轮巡的数量

    //TODO 获取页面参数
    let mapMode = true;
    if (location.state && location.state.pageState) {
      const { pageState = {} } = location.state;
      const { selectIds = [] } = pageState;
      let currentVideoScreen = videoScreen[1];
      if (selectIds.length > 4) {
        currentVideoScreen = videoScreen[2];
      }
      if (selectIds.length > 9) {
        currentVideoScreen = videoScreen[3];
      }
      if (currentVideoScreen !== videoScreen[1]) {
        this.selectSrceen(currentVideoScreen);
      }
      mapMode = !(pageState.mapMode === false);
    }

    this.state = {
      mapMode,
      isSlide: true,
      selectDevice: [],
      isLoop: false,
      showLoopSetting: false,
      loopOrgInfo: {},
      loopGroupName: null,
      showGroup: false,
      currentGroup: null,
      groupModalKey: Math.random(),
      loopModalKey: Math.random()
    };
  }

  componentDidMount() {
    const { DeviceStore, location } = this.props;
    if (location.state && location.state.pageState) {
      const { pageState = {} } = location.state;
      const { selectIds = [] } = pageState;
      const list = DeviceStore.queryCameraListByIds(selectIds);
      if (list.length > 0) {
        this.setState({ selectDevice: list }, () => {
          this.listViewRef.current.selectDevice(list);
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.loopTime);
    setTimeout(() => {
      this.mapViewRef = null;
      this.listViewRef = null;
      this.playerDatas = null;
      this.loopList = null;
      this.loopInterval = null;
      this.loopVideoBox = null;
      this.loopListNumber = null;
      this.loopTimer = null;
      this.loopOneListSize = null;
    }, 60);
  }

  /**
   * 隐藏左侧树形控件
   */
  slideAction = () => {
    const { isSlide } = this.state;
    this.setState({ isSlide: !isSlide });
  };

  /**
   * 显示轮巡的配置Modal 获取轮巡的摄像机列表
   * @param {object} item 组织信息
   * @param {boolean} isGroup 是否从分组过来
   */
  showLoopSettingLayout = (item, isGroup) => {
    const { isLoop } = this.state;
    if (isLoop) {
      return message.warn('当前正在执行轮巡任务！');
    }
    if (isGroup) {
      this.loopList = item.deviceList;
      this.setState({
        showLoopSetting: true,
        loopGroupName: item.groupName,
        loopModalKey: Math.random()
      });
    } else {
      const { DeviceStore } = this.props;
      this.loopList = DeviceStore.queryCameraByIncludeOrgId(item.id);
      this.setState({
        showLoopSetting: true,
        loopOrgInfo: item,
        loopModalKey: Math.random()
      });
    }
  };

  /**
   * 关闭轮巡配置窗口
   */
  closeLoopSettingLayout = () => {
    this.setState(
      {
        showLoopSetting: false,
        loopOrgInfo: {},
        loopGroupName: null
      },
      () => {
        setTimeout(() => this.setState({ loopModalKey: Math.random() }), 500);
      }
    );
  };

  /**
   * 开始轮巡
   */
  startVideoLoop = ({ loopInterval, loopScreen, loopVideoBox }) => {
    this.setState({ showLoopSetting: false });
    this.selectSrceen(loopScreen);
    this.loopInterval = loopInterval;
    this.loopVideoBox = loopVideoBox;
    this.loopListNumber = 1;
    this.loopOneListSize = this.loopVideoBox.filter(v => v.isLoop).length;
    this.listViewRef.current.setLoopVideBox(this.loopVideoBox);
    this.setState({ isLoop: true });
    this.setCurrentLoopList();
    this.loopTimer = setInterval(() => {
      this.loopListNumber++;
      Array.isArray(this.loopList) && this.setCurrentLoopList();
    }, this.loopInterval + 1000);
  };

  /**
   * 设置当前需要轮巡的设备
   */
  setCurrentLoopList() {
    const { selectDevice } = this.state;
    let startIndex = (this.loopListNumber - 1) * this.loopOneListSize;
    if (this.loopList.length <= this.loopOneListSize) {
      this.loopListNumber = 0;
    } else {
      if (startIndex + this.loopOneListSize >= this.loopList.length) {
        startIndex = this.loopList.length - this.loopOneListSize;
        this.loopListNumber = 0;
      }
    }
    let list = this.loopList.slice(
      startIndex,
      startIndex + this.loopOneListSize
    );
    this.listViewRef.current.playMethodForLoopDevice(list);
    this.setState({ selectDevice: selectDevice.concat(list) });
  }

  /**
   * 结束轮巡
   */
  endVideoLoop = () => {
    this.loopList = [];
    this.loopListNumber = 1;
    this.loopVideoBox.forEach(item => {
      item.isLoop = false;
    });
    this.listViewRef.current.setLoopVideBox(this.loopVideoBox);
    clearInterval(this.loopTimer);
    this.setState({
      isLoop: false,
      loopOrgInfo: {},
      loopGroupName: null
    });
    message.success('结束轮巡！');
  };

  /**
   * 选中设备后，执行的逻辑
   */
  onSelectDevice = item => {
    const { mapMode } = this.state;
    if (mapMode) {
      //TODO 地图模式只能选中一个设备
      this.setState({ selectDevice: [item] });
      this.mapViewRef.current.wrappedInstance.markerClick(item);
    } else {
      //TODO 列表模式可选中多个设备
      const { selectDevice } = this.state;

      //TODO 当前设备已经在播放视频，不做任何操作
      const isPlaying = selectDevice.findIndex(v => v.id === item.id) > -1;
      if (isPlaying) {
        return false;
      }
      selectDevice.push(item);
      this.setState({ selectDevice });
      this.listViewRef.current.selectDevice([item]);
    }
  };

  /**
   * 切换模式清空已选中的设备
   */
  changeModeBtn = () => {
    const { mapMode, isLoop } = this.state;
    exitFullscreen();
    if (isLoop) {
      this.endVideoLoop();
    }
    this.playerDatas = [];
    this.setState({
      mapMode: !mapMode,
      selectDevice: []
    });
  };

  /**
   * 方法成功后，play容器返回，播放信息集合对比选中设备，删除无效选中的设备
   */
  setDeviceListForCurrentPlayerBox = playerDatas => {
    const { selectDevice } = this.state;
    this.playerDatas = playerDatas;

    //TODO 子组件反馈播放容器数据后，核对选中的设备
    let list = selectDevice
      .map(item => {
        const isHas =
          this.playerDatas
            .filter(v => !!v)
            .findIndex(
              v => v.id === item.manufacturerDeviceId || v.id === item.id
            ) > -1;
        return isHas ? item : null;
      })
      .filter(v => !!v);
    this.setState({ selectDevice: list, loopModalKey: Math.random() });
  };

  /**
   * 切换屏幕数量
   */
  selectSrceen = item => {
    const { VideoSurveillanceStore } = this.props;
    VideoSurveillanceStore.setVideoScreen(item);
  };

  /**
   * 关闭按钮后，清空选中的设备
   */
  clearSelectDevice = () => {
    this.playerDatas = [];
    this.setState({ selectDevice: [], loopModalKey: Math.random() });
  };

  /**
   * 删除收藏下的设备
   */
  deleteGroupDevice = item => {
    const { UserGroupStore } = this.props;
    return UserGroupStore.edit(item);
  };

  /**
   * 提供子组件新开页签的方法
   */
  goPage = options => {
    const { history, TabStore } = this.props;
    TabStore.goPage({
      history,
      ...options
    });
  };

  /**
   * 新增收藏下的设备
   */
  addGroupDevice = items => {
    const { UserGroupStore } = this.props;
    return UserGroupStore.editDevice(items, true);
  };

  /**
   * 打开分组弹窗
   */
  showGroupModal = (isEdit, group) => {
    this.setState({
      showGroup: true,
      currentGroup: isEdit ? group : null,
      groupModalKey: Math.random()
    });
  };

  /**
   * 关闭分组弹窗
   */
  hideGroupModal = () => {
    this.setState({ showGroup: false });
  };

  /**
   * 新增分组
   */
  addOrEditGroup = (isEdit, name, list, group) => {
    const { UserGroupStore } = this.props;
    let deviceIds = list.map(v => `${v.manufacturerDeviceId}/${v.deviceName}`);
    if (isEdit) {
      console.log(isEdit, name, list, group);
      UserGroupStore.editGroup(
        { groupName: group.groupName },
        { groupName: name, deviceIds }
      ).then(() => {
        this.hideGroupModal();
        message.success('操作成功！');
      });
    } else {
      UserGroupStore.add({
        groupName: name,
        deviceIds
      }).then(() => {
        this.hideGroupModal();
        message.success('操作成功！');
      });
    }
  };
  cancelAddGroup = () => {
    this.setState({ showGroup: false });
  };

  /**
   * 新增收藏下的设备
   */
  deleteGroup = name => {
    const { UserGroupStore } = this.props;
    return UserGroupStore.delete({ groupName: name });
  };
  render() {
    const {
      VideoSurveillanceStore,
      DeviceStore,
      UserGroupStore,
      OrgStore
    } = this.props;
    const {
      isSlide,
      mapMode,
      showLoopSetting,
      showGroup,
      currentGroup,
      groupModalKey,
      loopModalKey
    } = this.state;
    return (
      <div className="video-surveillance">
        <div className={`left-tree ${isSlide ? 'left-tree-slide' : ''}`}>
          <div className="slide-layout-left-tree">
            <ResourceTreeView
              deviceList={DeviceStore.cameraArray}
              collectionList={UserGroupStore.list}
              orgList={OrgStore.orgArray}
            />
          </div>
          <span className="slider-btn" onClick={this.slideAction}>
            <IconFont
              type={
                isSlide
                  ? 'icon-Arrow_Small_Left_Mai'
                  : 'icon-Arrow_Small_Right_Ma'
              }
              theme="outlined"
            />
          </span>
        </div>
        <div className="right-content">
          <Button
            type="primary"
            className="change-mode-btn orange-btn"
            onClick={this.changeModeBtn}
          >
            <IconFont type={mapMode ? 'icon-List_Map_Main' : 'icon-Map_Main'} />
            {mapMode ? '分屏模式' : '地图模式'}
          </Button>
          {mapMode ? (
            <MapMarkerVideo ref={this.mapViewRef} logData={{isOther: false}}>
              <MapView onSelectDevice={this.onSelectDevice} />
            </MapMarkerVideo>
          ) : (
            <ListView
              closeVideo={this.clearSelectDevice}
              asyncGetCurrentVideoList={DeviceStore.asyncGetCurrentVideoList}
              asyncGetHistoryVideo={DeviceStore.asyncGetHistoryVideo}
              ref={this.listViewRef}
              selectSrceen={this.selectSrceen}
              currentScreen={VideoSurveillanceStore.currentVideoScreen}
            />
          )}
        </div>
        <VideoLoopSetting
          playerDatas={this.playerDatas}
          startVideoLoop={this.startVideoLoop}
          closeLoopSettingLayout={this.closeLoopSettingLayout}
          showLoop={showLoopSetting}
          key={loopModalKey}
          currentScreen={VideoSurveillanceStore.currentVideoScreen}
          loopListSize={this.loopList.length}
        />
        <GroupModal
          onOk={this.addOrEditGroup}
          visible={showGroup}
          onCancel={this.hideGroupModal}
          key={groupModalKey}
          group={currentGroup}
        />
      </div>
    );
  }
}
