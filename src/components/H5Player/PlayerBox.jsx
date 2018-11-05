import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from './components/Player';
import util from '../../utils';

/**
 *  单视频播放器配置项
 */
/*  
  是否必传 参数名:     参数类型及可选值                      备注
  true    file:         'string',                   // 视频流地址
  false   height:       '100%',
  false   width:        '100%',
  false   title:        '' || {                     // 播放器顶部标题栏
                          cameraName: '',           // 标题
                          closeVideo: true,         // 关闭按钮
                          captureScreen: true,      // 截图按钮
                        },
  false   controls:     true || {                   // 播放器底部控制条
                          playMethod: true,         // 实时历史切换按钮
                          download: true,           // 下载按钮
                          volume: true,             // 音量按钮
                          time: true,               // 播放时间(直播没有)
                          playPause: true,          // 开始暂停按钮(直播没有)
                          timeSlider: true,         // 播放进度控制条（直播没有）
                        }, 
  false   isLiving:     true,                       // 播放模式(直播、历史)
  false   fragment:     {},                         // 视频断片播放,isLiving为false时有效
  false   videoEvents:  {                           // 事件回调
                          closeVideo: () => { },    // 关闭单个视频
                          download: () => { },      // 下载视频
                          captureScreen: () => { }, // 视频截图
                          setPlayMethod: () => { }, // 设置播放模式
                          ptzControl: () => { },    // 云台控制
                        },
  false   videoListener: {                          // 播放状态的回调函数
                          onPlay,
                          onLoading,
                          onReady,
                          onSeek,
                          onEnd,
                          onReplay,
                          onReload,
                          onError,
                        }
*/
class SinglePlayer extends Component {
  static contextTypes = {
    player: PropTypes.object,
  };
  id = 'player' + Math.random();

  state = {
    file:''
  }

  // 切换直播、回放
  setPlayMethod = (index, isLiving) => {
    const callback = this.props.videoEvents.setPlayMethod;
    callback && callback(isLiving);
  }

  // 视频截图
  captureScreen = (captureData, data) => {
    const callback = this.props.videoEvents.captureScreen;
    callback && callback(captureData, data);
  }
  
  // 关闭视频
  closeVideo = () => {
    this.setState({
      file: undefined
    });
    const callback = this.props.videoEvents.closeVideo;
    callback && callback();
  }

  // 双击全屏
  onDoubleClick = (k) => {
    const player = this.player;
    if (!player) {
      return
    }
    if (util.isFullscreen()) {
      player.fullscreen(false)
    } else {
      player.fullscreen(true)
    }
  }

  /* 
    生命周期
  */
  // 组件初次渲染
  componentDidMount() {
    let { file } = this.props;
    this.setState({
      file
    })
  }

  componentWillReceiveProps(nextProps){
    const { file } = nextProps;
    if (file !== this.state.file){
      this.setState({
        file
      })
    }
  }

  render () {
    let { EmptyPlayer, title, controls = {}, fragment, isLiving = true, cameraControlFlag, videoListener = {}, watermark = '', fileData, videoEvents, ptzControl, playerRef } = this.props;
    const { file } = this.state;
    videoEvents = Object.assign({}, videoEvents,{
      closeVideo: this.closeVideo,
      setPlayMethod: this.setPlayMethod,
      captureScreen: this.captureScreen,
    })
    return (
      <Player
        fileData={fileData}
        watermark={watermark}
        videoListener={videoListener}
        playerRef={player => {
          playerRef&&playerRef(player)      
          this.player = player
        }}
        videoEvents={videoEvents}
        ptzControl={ptzControl ? true : false}
        file={file}
        title={title}
        isLiving={isLiving}
        fragment={fragment}
        controls={controls}
        onDoubleClick={this.onDoubleClick}
      />
    )
  }
}

export default SinglePlayer;