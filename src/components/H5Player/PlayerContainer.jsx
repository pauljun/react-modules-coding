import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import PlayerControlBar from './components/PlayerControlBar.jsx';
import MultiPlayer from './components/MultiPlayer.jsx';
import VideoTurn from './components/VideoTurn.jsx';
import * as util from '../../utils';
import './PlayerContainer.scss';

/**
 *  多视频播放器配置项
 */
/*
  videoConfig: [ // 配置项( 数组 )
    {
      file: '',                     // 播放流地址（必要参数）
      draggable: true,              // 是否允许拖动
      screenNum: 4,                 // 初始屏幕数量（1,4,9,16）
      maxScreenNum: 9,              // 最大屏幕数量（1,4,9,16）
      height: '100%',
      width: '100%',
      title: '' || {                // 播放器顶部标题栏
        cameraName: '',
        closeVideo: true,                 // 关闭按钮
        captureScreen: true,                // 截图按钮
      },
      controls: {                 // 播放器底部控制条
        playMethod: true,                 // 实时历史切换按钮
        download: true,                 // 下载按钮
        volume: true,                 // 音量按钮
        time: true,                 // 播放时间(直播没有)
        playPause: true,                // 开始暂停按钮(直播没有)
        timeSlider: true,                 // 播放进度控制条（直播没有）
      },
      isLiving: true,                 // 播放模式(直播、历史)
      fragment: {},                 // 视频断片播放，isLiving为false时有效
    }
  ],
  videoEvents: {                // 事件回调
    closeVideo: () => {},                 // 关闭单个视频
    closeAll: () => { },                // 关闭所有视频
    download: () => { },                // 下载视频
    captureScreen: () => {},                // 视频截图
    setPlayMethod: () => {},                // 设置播放模式
    onSelectPlayer: () => {},                 // 选择一个播放器
    setScreenNum: () => {},                 // 设置分屏
    openExtendScreen: () => {},                 // 打开扩展屏
    ptzControl: () => {},                 // 云台控制
  },
  videoListener: {                // 播放状态的回调函数
    onPlay,
    onLoading,
    onSeek,
    onEnd,
    onReplay,
    onReload,
    onError,
  }
*/

class PlayerContainer extends Component {
  state = { 
    turnModalVisible: false, // 轮巡弹窗
    isVideoTurn: false, // 轮巡状态
    fullScreen: false, // 播放器容器全屏状态
    disabledList: [],
    videoTurnTask:[], // 记录轮巡任务占用的播放器（二维数组）
    videoData: [],
    posIndexArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // 存储屏幕位置的数组，值为屏幕位置，索引为对应videoFile的索引
    isSelect:false, // 是否鼠标点选，不是点选则是轮流
    // controlbar: true,
    // playbackRates: [1, 1.25, 1.5, 1.75, 2],
    // playbackRateControls: true 
    videoConfig: {
      maxScreenNum: 16,      
      screenNum: 4,
      currIndex: 0, // 对应videoData的下标
      draggable: true,
      ptzControl: true,
    }

  }
  
  // 设置屏幕数量
  setScreenNum = (v) => {
    if (this.state.isVideoTurn) {
      return message.error('当前正在轮巡中，无法进行此操作');
    }
    
    const json = JSON.parse(v.key);
    let videoConfig = this.state.videoConfig;
    if (videoConfig.screenNum !== json.value) {
      // 清除不在视野内的视频流参数, 否则会占用轮巡时的屏幕
      const { posIndexArr } = this.state;
      const newScreenList = Array.from({ length: json.value}).map((v,k) => {
        return posIndexArr.indexOf(k);
      })
      const videoData = this.state.videoData.map((v,k) => {
        const unavailable = newScreenList.indexOf(k) === -1;
        return unavailable ? undefined : v;
      })
      videoConfig.screenNum = json.value;
      videoConfig.currIndex = posIndexArr.indexOf(0);
      this.setState({
        videoConfig,
        videoData,
      })
      const callback = this.props.videoEvents.setScreenNum;
      callback && callback(videoConfig, videoData);
    }
  }
  // 关闭所有视频
  closeAll = () => {
    const maxScreenNum = this.state.videoConfig.maxScreenNum;
    const videoData = Array.from({ length: maxScreenNum });
    this.setState({
      videoData
    },() => {
      const callback = this.props.videoEvents.closeAll;
      callback && util.judgeType(callback, 'Function') && callback(videoData);
    }) 
  }
  // 关闭单个视频
  closeVideo = (index) => {
    const { videoData } = this.state;
    videoData.splice(index, 1, undefined)
    this.setState({
      videoData
    })
    const callback = this.props.videoEvents.closeVideo;
    callback && util.judgeType(callback, 'Function') && callback(videoData, index);
  }
  /** 下载视频
   *  callback: 继续播放视频
   */
  download = ({fileData, begin, end, index}, callback) => {
    const { download } = this.props.videoEvents
    download && download({ fileData, begin, end, index }, callback)
  }
  // 视频截图
  captureScreen = (captureData, data) => {
    const callback = this.props.videoEvents.captureScreen;
    callback && util.judgeType(callback, 'Function') && callback(captureData, data);
  }
  // 初始化扩展屏数据
  setExtendScreenData = ({ videoConfig, videoData, posIndexArr }) => {
    console.log('设置扩展屏数据')
    this.setState({ 
      videoConfig, videoData, posIndexArr
    })
  }
  // 选中播放器事件
  onSelectPlayer = (index) => {
    console.log('onSelectPlayer', index)
    const { videoConfig } = this.state;
    if (videoConfig.currIndex !== index) {
      videoConfig.currIndex = index;
      this.setState({
        videoConfig,
        isSelect: true
      })
      const callback = this.props.videoEvents.onSelectPlayer;
      callback && callback(index);
    }
  }

  onDoubleClick = (k) => {
    const player = this[`play${k}`];
    if (!player) {
      return
    }
    if (util.isFullscreen()) {
      player.fullscreen(false)
    } else {
      player.fullscreen(true)
    }
  }
  
  // 切换单个播放源功能
  playVideo = ({ fileData, index }, callback) => {
    const { videoConfig, videoData, isSelect, posIndexArr } = this.state;
    let currIndex = index || videoConfig.currIndex; // 对应当前videoData的下标
    if (index === 0){ // 处理数字0为false
      currIndex = 0
    }
    // 传入了index相当于点选
    const notTurn = index || index === 0 || isSelect; 
    if (!notTurn){ // 不是点选 或者 未传入index且是点选
      // 视频窗口轮流状态
      const screenNum = videoConfig.screenNum;
      let hasIdleScreen = false; // 是否有空闲屏幕
      // 已用的videoData索引
      let usedDataIdx = Array.from({ length: screenNum }).map((v, k) => {
        return posIndexArr.indexOf(k) // url位置
      })
      videoData[index] = undefined
      usedDataIdx.every(v => {
        const item = videoData[v];
        if (!item || !item.file ){
          currIndex = v;
          hasIdleScreen = true;
          return false
        }
        return true
      })
      if (!hasIdleScreen){ // 没有空闲屏幕
        const currPos = posIndexArr[currIndex]; // 找出currIndex对应的屏幕位置
        const newPos = (currPos + 1) % screenNum; // 位置加1处理
        currIndex = posIndexArr.indexOf(newPos); // 根据新位置找出对应的videoData索引
      }
    }
    videoConfig.currIndex = currIndex;
    videoData[currIndex] = fileData;
    this.setState({
      videoData,
      videoConfig,
      isSelect:false
    })
    console.log('playVideo 执行完毕', videoData)        
    callback && callback(videoData);
  }
  // 视频轮巡前
  beforeVideoTurn = (screenNum) => {
    let { videoConfig } = this.state;    
    if (screenNum !== videoConfig.screenNum) {
      videoConfig.screenNum = screenNum;
      this.setState({
        videoConfig
      })
    }
  }
  // 开始视频轮巡
  startVideoTurn = (fileDatas, callback) => {
    console.log('开始轮巡')
    let { videoData } = this.state;
    // 1. availableScreen可用的屏幕
    // 2. 从cameraList中获取availableScreen.length个摄像机的id，得到cameraIds
    // 3. cameraIds拉流组合数据 => videoFiles 
    // 4. 组合videoData和videoFiles得到新的
    let videoTurnTask = []
    fileDatas.map(v => {
      if (!v.fileData){
        return
      }
      v.fileData.videoTurn = true;
      videoData[v.index] = v.fileData;
      videoTurnTask.push(v.index);
    });
    this.setState({ 
      videoData,
      videoTurnTask,
      isVideoTurn: true      
    },() => {
      callback && callback(videoData);
    });
  }
  // 暂停轮巡
  pauseVideoTurn = (key) => {
    console.log('暂停轮巡')
  }
  // 停止轮巡
  stopVideoTurn = () => {
    // 关闭轮巡窗口，清空轮巡屏幕
    if (this.state.isVideoTurn){
      console.log('结束轮巡')
      message.success('结束轮巡')
      const { videoTurnTask } = this.state;
      let videoData = this.state.videoData;
      videoTurnTask.map(v => {
        if (videoData[v]){
          delete videoData[v].videoTurn;
        }
      })
      this.setState({
        videoData,
        videoTurnTask:[],
        isVideoTurn:false
      })
    }
  }
  // 显示轮巡Modal
  showVideoTurnModal = () => {
    const { videoData, posIndexArr} = this.state;
    // 处理disabledList
    let disabledList = [];
    videoData.map((v,k) => {
      const available = videoData[k] && videoData[k].file;
      if (available){
        disabledList.push(k)
      }
    })
    this.setState({
      turnModalVisible: true,
      disabledList
    })
  }
  // 隐藏轮巡Modal
  hideVideoTurnModal = () => {
    this.setState({
      turnModalVisible: false
    })
  }
  // 发送到扩展屏
  openExtendScreen = () => {
    console.log('发送到扩展屏')
    const { videoData, videoConfig, posIndexArr } = this.state;
    const isEmpty = videoData.every(v => {
      if(v || (v && v.file)){
        return false
      }
      return true
    })
    if (isEmpty){
      return message.error(util.lan('当前无播放数据，不可发送扩展屏'))
    }
    // 功能点：只能发送实时视频
    if (!util.getCacheItem('ExtendScreenIsOpen')) {
      window.extendScreen = window.open(
        '/extendScreen', 
        'extendScreen', 
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes,depended=yes'
      );
    }
    const ExtendScreenVideoData = {
      videoConfig,
      videoData,
      posIndexArr
    }
    localStorage.setItem('ExtendScreenVideoData', JSON.stringify(ExtendScreenVideoData))
    // 发送成功后清除当前视频数据
    this.closeAll();
    // const callback = this.props.videoEvents.openExtendScreen;
    // callback && callback(Array.from({ length: 16 })); 
  }
  // 设置播放模式（直播/历史）index: 播放器索引(切换播放源)
  setPlayMethod = (index, isLiving) => {
    const fileData = this.state.videoData[index];
    if (fileData.isLiving === undefined) {
      fileData.isLiving = true
    }
    if (!isLiving || fileData.isLiving !== isLiving) {  
      const callback = this.props.videoEvents.setPlayMethod;
      callback && callback(index, fileData, isLiving);
    }
  }
  // 多屏幕全屏
  setFullScreen = (fullScreen) => {
    fullScreen = fullScreen === undefined ? !this.state.fullScreen : fullScreen;
    this.setState({
      fullScreen
    })
    if (fullScreen){
      util.fullScreen(this.playerContainer);
    } else {
      util.exitFullscreen();
    }
  }

  // 处理控制台事件 setScreenNum，closeAll
  handleControlBar = (controlBar) => {
    if (!controlBar) {
      return false;
    }
    if (controlBar.screenNumBtn){
      controlBar.setScreenNum = this.setScreenNum;
      controlBar.screenNum = this.state.videoConfig.screenNum;
      controlBar.maxScreenNum = this.state.videoConfig.maxScreenNum
    }
    if (controlBar.cloaseAllBtn) {
      controlBar.closeAll = this.closeAll;
    } 
    if (controlBar.videoTurnBtn) {
      controlBar.showVideoTurnModal = this.showVideoTurnModal;
      controlBar.stopVideoTurn = this.props.stopVideoTurn;
    }
    if (controlBar.extendScreenBtn){
      controlBar.openExtendScreen = this.openExtendScreen;
    }
    if (controlBar.fullScreenBtn !== false){
      controlBar.setFullScreen = this.setFullScreen;
    }
    return controlBar;
  }
  // 拖动后更新位置信息
  updatePosIndex = (posIndexArr) => {
    this.setState({
      posIndexArr
    })
  }
  //云台控制
  ptzControl = (fileData,direction) => {
    this.props.videoEvents.ptzControl && this.props.videoEvents.ptzControl(fileData,direction)
  }

  // 保存传进来的参数，作为自己的初始化数据
  componentDidMount(){
    let { controlBar={}, videoData, videoEvents, videoConfig } = this.props;
    videoConfig = Object.assign({}, this.state.videoConfig, videoConfig);
    if (controlBar.screenNumBtn) { // 如果允许设置分屏，则需要maxScreenNum个player
      const videoTemp = Array.from({ length: videoConfig.maxScreenNum })
      videoData = Object.assign([], videoTemp, videoData);
    } else {
      videoConfig.maxScreenNum = videoData.length;
    }
    this.setState({
      videoData,
      videoConfig
    })
  }

  render () {
    let { className = '', controlBar, startVideoTurn, videoTurnBtn, videoListener = {}, watermark } = this.props;
    controlBar = this.handleControlBar(controlBar);
    const { 
      videoData, 
      videoConfig, 
      turnModalVisible, 
      disabledList, 
      posIndexArr, 
      isVideoTurn,
      fullScreen
    } = this.state;
    if (!videoData.length){
      return null
    }
    console.log(videoData,426)    
    const videoEvents = {
      onSelectPlayer: this.onSelectPlayer, // 选中播放器事件
      closeVideo: this.closeVideo, // 关闭单个视频
      captureScreen: this.captureScreen, // 截图事件（可选）
      setPlayMethod: this.setPlayMethod, // 切换播放模式
      updatePosIndex: this.updatePosIndex,
      download:this.download,
      ptzControl: this.ptzControl,
      onDoubleClick: this.onDoubleClick,
    };
    return (
      <div 
        className={`multiplayer-wrapper ${className}`}
        ref={playerContainer => this.playerContainer = playerContainer}
      >
        {controlBar && 
          <PlayerControlBar 
            {...controlBar}
            fullScreen={fullScreen}
            isVideoTurn={isVideoTurn}
          >
            {controlBar.customButton && controlBar.customButton}
          </PlayerControlBar>
        }
        <MultiPlayer
          watermark={watermark}
          playerRef={(player, index) => this[`play${index}`] = player}
          isVideoTurn={isVideoTurn}
          posIndexArr={posIndexArr}
          videoData={videoData}
          videoEvents={videoEvents}
          videoListener={videoListener}
          {...videoConfig}
        />
        {!isVideoTurn && turnModalVisible && startVideoTurn &&
          <VideoTurn 
            onCancel={this.hideVideoTurnModal}
            onOk={startVideoTurn}
            visible={turnModalVisible}
            disabledList={disabledList}
            posIndexArr={posIndexArr}
            screenNum={videoConfig.screenNum}
          />
        }
      </div>
    )
  }
  // // 添加播放器事件监听
  // on = (type,callback) => {
  //   this.player.on(type, callback)
  // }
  // // 移除播放器事件监听
  // off = (type) => {
  //   this.player.off(type)
  // }
}

export default PlayerContainer;
