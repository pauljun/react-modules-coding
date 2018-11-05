import React, { Component } from "react";
import { Button, Select, Dropdown, Icon, Menu, Modal, message } from "antd";
import PropTypes from "prop-types";
import H5Player from "html5-player";
import H5HisPlayer from "html5-player/libs/history";
import * as util from 'src/utils';
import "./Player.scss";

import CameraControl from "./CameraControl";
import CaptureList from "./CaptureList";
import DownloadWindow from "./DownloadWindow";
// import DownloadWindow from "./DownloadWindow.1.jsx";

  // ************************************************************* //
  // *********************    player可配置项     ****************** //
  // ************************************************************* //
/** 
  const playerProps = {
    file: "string",
    isLiving: false,
    height: "100%",
    width: "100%",
    title: "",
    logo: "",
    poster: "",
    muted: false,
    loop: false,
    autoplay: false,
    selection: {
      begin,
      end,
      minGap,
      maxGap
    }
    stretching: "uniform", // 画面拉伸 uniform：自适应， exactfit:填充不裁剪，fill：裁剪后填充，none：原始尺寸
    controls: true || {
      // 是否展示 controllerbar
      timeSlider: true, // 播放进度控制条（直播没有）
      playPause: true, // 开始暂停按钮
      volume: true, // 音量按钮
      time: true, // 播放时间（直播没有）
      // setting: true, // 配置（播放速度等）目前只有配置播放速度的功能
      speed: true // 播放速度
      // method: customMethod,
      // download: customDownload,
    },
    localization: {
      // 多语言设置，以下为默认值
      loadingPlayerText: "播放器加载中...",
      unknownError: "发生了未知错误",
      fileCouldNotPlay: "视频加载出错",
      timeout: "视频加载超时",
      speed: "倍速",
      normalSpeed: "正常"
    },
    tracks: {
      // 各种 track 设置
    },
    fragment: "/fragment.json", // 视频断片功能
    playbackRates: [1, 1.25, 1.5, 1.75, 2], // video 的 playebackRates 设置
    playbackRateControls: true, // 是否开启 playebackRate 控制
    showLoadingLazyTime: 500, // 延时展示loading的时间（毫秒）
    showErrorMessageLazyTime: 1000, // 延时展示错误信息的时间（毫秒）
    contextMenu: false // 右键菜单
  };

  const fragmentData = {
    total: {
      begin: "2017-10-03 00:00:00",
      end: "2017-10-03 00:01:19"
    },
    fragments: [
      {
        begin: "2017-10-03 00:00:02",
        end: "2017-10-03 00:00:12"
      }
    ]
  };
  const fragmentDataNew = {
    beginDate: '2018-08-06 10:39:00',
    duration: 3601,
    fragments: [
      {
        begin: 0,
        end: 1800,
        file: "https://jxsr-oss1.antelopecloud.cn/records/m3u8_info2/1533523140_1533524940.m3u8?access_token=538379219_3356491776_1565062811_9fc6c13c2c64e93102aa8534b655531b&head=1"
      },
      {
        begin: 1800,
        end: 2000
      },
      {
        begin: 2000,
        end: 3601,
        file: "https://jxsr-oss1.antelopecloud.cn/records/m3u8_info2/1533524940_1533526741.m3u8?access_token=538379219_3356491776_1565062811_9fc6c13c2c64e93102aa8534b655531b"
      }
    ]
  }

  const events = {
    focus:
      "鼠标是否聚焦在播放器，鼠标移动到播放器或者点击播放器都会聚焦，解除聚焦需要点击非播放器的其他地方",
    loading: "事件加载事件，中途因为的视频加载也会触发此事件",
    ready: "视频准备完成，可以播放（video dom dataloaded事件触发）",
    replay: "视频播放结束，点击重新播放按钮，会触发重新播放事件",
    volume: "音量变化事件",
    seek: "视频时间轴（time-line）拖动，点击触发",
    fullscreen: "全屏事件触发，包括退出全屏",
    controlbar: "视频控制台显示与隐藏事件",
    reload: "重载事件，这个事件一般都是视频加载触发，出现刷新按钮，点击后触发",
    error: "这个错误事件是 hls 或者 flv 视频解析报错时触发的"
  };

 */

const localization = {
  // 多语言设置，以下为默认值
  loadingPlayerText: "播放器加载中...",
  unknownError: "发生了未知错误",
  fileCouldNotPlay: "视频加载出错",
  timeout: "视频加载超时",
  speed: "x",
  normalSpeed: "正常"
}

class Player extends Component {
  static contextTypes = {
    player: PropTypes.object
  };

  id = "player" + Math.random();
  defaultGap = 60*5 // 默认前后5分钟s
  minGap = 10 // 
  maxGap = 3600 * 24 * 3 // 最大3天 60 * 2400 *3 

  state = {
    captureData: [],
    stretching: "uniform",
    ptzToggle: false, // 云台控制按钮显示状态
    downloadWindowVisible: false, // 下载时间弹窗显示状态
    startTime: null, // 下载的开始时间 毫秒时间戳
    endTime: null, // 下载的结束时间
  };

  // ************************************************************* //
  // *****************    自定义controlbar按钮   ****************** //
  // ************************************************************* //

  // 自定义下载按钮
  customDownload = (
    <a className="video-download fr">
      <Icon type="Download" onClick={() => this.showDownload()} />
    </a>
  );
  // 实时历史切换按钮
  renderCustomMethod = isLiving => (
    <div className="method-btns">
      <Button
        className={isLiving ? "active" : ""}
        onClick={() => this.setPlayMethod(true)}
      >
        实时
      </Button>
      <Button
        className={isLiving ? "" : "active"}
        onClick={() => this.setPlayMethod(false)}
      >
        历史
      </Button>
    </div>
  );
  // 视频轮巡状态显示
  customVideoTurnBtn = (
    <span className="video-turn-status">
      <span>{util.lan("视频轮巡中")}</span>
      <Icon type="loading" />
    </span>
  );
  //云台控制按钮
  ptzControlIcon = (ptzToggle, cameraId) => (
    <span className={`ptz-btn ${ptzToggle ? 'open' : 'close'}`}>
      <span
        className="ptz-status-icon"
        title={"云台控制"}
        onClick={() => this.setPtzControl()}
      />
      { ptzToggle && (
          <CameraControl
            cameraId={cameraId}
            close={this.setPtzControl.bind(this)}
          />
      )}
    </span>
  );
  // 画面拉伸按钮
  customStretchBtn = stretching => (
    <span className="stretching-btn fr">
      <Icon
        type={stretching === "uniform" ? "Size_1" : "Size_"}
        title={util.lan(stretching === "uniform" ? "画面自适应" : "画面填充")}
        onClick={() => this.setStretch()}
      />
    </span>
  );
  // 停止按钮
  customStopBtn = (
    <span className="stop-btn fl">
      <Icon type="Stop" title={"停止"} onClick={() => this.stopVideo()} />
    </span>
  );
  // 时间轴截取按钮
  customSelectionBtn = () => {
    return (
      <span className='html5-player-selection-btn' onClick={this.setSelection}>
      </span>
    )
  }

  // ************************************************************* //
  // *********************    视频默认配置   ********************** //
  // ************************************************************* //
  defaultConfig = {
    title: {
      // cameraName:'',
      closeVideo: true, // 关闭video按钮
      captureScreen: true // 抓图按钮
    },
    controls: {
      // rotate: true, // 旋转
      pictureQuality: false, // 画质
      playMethod: "", // 切换播放模式的按钮
      videoTurn: this.customVideoTurnBtn, // 轮巡状态
      download: this.customDownload, // 下载按钮
      stretch: "",
      stop: "",
      selection: '',
    }
  };

  // ************************************************************* //
  // **********************     播放器事件    ********************* //
  // ************************************************************* //

  // 播放器时间截取事件（默认前后30秒）  
  setSelection = (begin, end) => {
    this.player.pause();
    // 计算当前播放时间对应的时间戳
    const currentTime = this.player.currentTime; // 当前播放时长
    // 断片时间
    if(!begin){
      begin = currentTime - this.defaultGap;
      begin = begin > 0 ? begin : 0;
    }
    if(!end){
      const total = this.player.duration; // 总时长
      end = currentTime + this.defaultGap;
      end = end < total ? end : total;
    }
    const selection = {
      begin,
      end,
      seekingDisabled: true,
      minGap: this.minGap,
      maxGap: this.maxGap
    }
    // this.handleSelectionChange({begin, end})
    this.player.setSelection(selection)
  }
  // 显示下载视频选时弹窗
    // showDownload = () => {
    //   const downloadWindowVisible = this.state.downloadWindowVisible;
    //   if (downloadWindowVisible) {
    //     this.setState({
    //       downloadWindowVisible: false,
    //       currentDate: null
    //     });
    //     return this.player.play();
    //   }
    //   this.player.pause();
    //   const { fragment } = this.props;
    //   // 计算当前播放时间对应的时间戳
    //   const currentTime = this.player.currentTime; // 秒
    //   const begin = new Date(fragment.beginDate) * 1; // 毫秒
    //   const currentDate = begin + currentTime*1000;
    //   this.setState({ downloadWindowVisible: true, currentDate });
  // };
  // 显示下载视频选时弹窗
  showDownload = () => {
    const downloadWindowVisible = this.state.downloadWindowVisible;
    if (downloadWindowVisible) {
      return this.cancelDownload()
    }
    this.player.pause();
    this.setSelection();
    this.setState({ 
      downloadWindowVisible: true,
    });
  };
  // 取消下载
  cancelDownload = (play=true) => {
    this.player.setSelection(false)
    this.setState({
      downloadWindowVisible: false,
      startTime: null,
      endTime: null
    });
    if(play){
      this.player.play();
    }
  };
  // 开始下载视频
  handleDownload = () => {
    const { videoEvents, fileData, index } = this.props;
    const { startTime, endTime } = this.state;

    const videoId = this.id;
    const video = document.getElementById(videoId).querySelector("video");
    // 执行回调函数继续播放视频
    videoEvents.download && videoEvents.download({ 
      fileData, 
      begin: Math.floor(startTime/1000), 
      end: Math.floor(endTime/1000), 
      index,
    }, () => {
      this.player.play();
      this.cancelDownload(false)   
    });
  };
  // 下载时间控件改变事件
  handleDateChange = (type, value) => {
    const { startTime, endTime } = this.state;    
    const { fragment } = this.props;
    const begin = new Date(fragment.beginDate) * 1;
    let selectionBegin = startTime - begin;
    let selectionEnd = endTime - begin;
    let maxDate;
    if(type === 'startTime'){
      maxDate = endTime - value;
      selectionBegin = value - begin;
    }else{
      maxDate = value - startTime;            
      selectionEnd = value - begin;
    }
    if(Math.floor(maxDate/1000) > this.maxGap){
      return message.error('最大下载时间不能超过3天');
    }
    this.setSelection(selectionBegin/1000, selectionEnd/1000)
  }
  // 监听截取时间改变
  handleSelectionChange = ({ begin, end }) => {
    const { fragment } = this.props
    const start = new Date(fragment.beginDate) * 1;
    const startTime = Math.floor(start + begin*1000);
    const endTime = Math.floor(start + end*1000);
    this.setState({
      startTime, 
      endTime
    })
  }
  // 设置云台开关状态
  setPtzControl() {
    let { ptzToggle } = this.state;
    this.setState({ ptzToggle: !ptzToggle });
  }
  //云台控制
  ptzControl = type => {
    const fileData = this.fileData;
    let direction = "";
    switch (type) {
      case "top-left":
        direction = "leftup";
        console.log("开始向左上移动");
        break;
      case "top-middle":
        direction = "up";
        console.log("开始向上移动");
        break;
      case "top-right":
        direction = "rightup";
        console.log("开始向右上移动");
        break;
      case "middle-left":
        direction = "left";
        console.log("开始向左移动");
        break;
      case "middle-middle":
        break;
      case "middle-right":
        direction = "right";
        console.log("开始向右移动");
        break;
      case "bottom-left":
        direction = "leftdown";
        console.log("开始向左下移动");
        break;
      case "bottom-middle":
        direction = "down";
        console.log("开始向下移动");
        break;
      case "bottom-right":
        direction = "rightdown";
        console.log("开始向右下移动");
        break;
      default:
    }
    const { ptzControl } = this.props.videoEvents;
    ptzControl && ptzControl(fileData, direction);
  };
  // 停止视频
  stopVideo = () => {
    this.player.setSeeking(0);
    setTimeout(() => {
      this.player.pause();
    }, 100);
  };
  // 设置画面拉伸
  setStretch = () => {
    const stretching =
      this.state.stretching === "uniform" ? "exactfit" : "uniform";
    this.setState({
      stretching
    });
  };
  // 切换直播、回放
  setPlayMethod = isLiving => {
    const index = this.props.index;
    this.props.videoEvents.setPlayMethod(index, isLiving);
  };
  // 视频截图
  captureScreen = event => {
    event.stopPropagation();
    if (this.player.isError || this.player.loading || this.player.ended){
      return message.info('当前状态无法截屏')
    }
    const videoId = this.id;
    const video = document.getElementById(videoId).querySelector("video");
    const url = util.drawImage({
      target: video,
      width: video.videoWidth,
      height: video.videoHeight,
      imgQuality: 0.6
    })
    const time = new Date() * 1;
    const index = this.props.index;
    const start = {
      clientX: event.clientX,
      clientY: event.clientY
    };
    // 单个截图操作
    this.props.videoEvents.captureScreen([{ url, time }], { start, index });
    // 截图列表操作
    // const { captureData } = this.state;
    // captureData.push({ url,time });
    // this.setState({ captureData })
    // this.props.videoEvents.captureScreen(captureData);
  };
  // 清空视频截图
  clearCapture = () => {
    this.setState({
      captureData: []
    });
  };
  // 删除一张图片
  delCaptureImg = (e, k) => {
    e.stopPropagation();
    let { captureData } = this.state;
    captureData.splice(k, 1);
    this.setState({
      captureData
    });
  };
  // 关闭视频
  closeVideo = () => {
    const index = this.props.index;
    this.setState({
      captureData: []
    });
    const callback = this.props.videoEvents.closeVideo;
    callback && callback(index);
  };
  // 渲染空播放器
  renderEmptyPlayer(EmptyPlayer) {
    if (React.isValidElement(EmptyPlayer)) {
      return <div className='empty-player'>{EmptyPlayer}</div>;
    }
    const content = EmptyPlayer ? EmptyPlayer : "请选择播放源";
    return <div className='empty-player'><i></i><span>{content}</span></div>;
  }
  // 渲染视频的title
  rendereTitle({ cameraName = "", netRate = "", closeVideo, captureScreen }) {
    const defaultTitle = (
      <div
        className="player-title-wrapper clearfix"
        onClick={e => util.stopPropagation(e)}
      >
        <span className="player-title-left fl">
          <span className="camera-name">{cameraName}</span>
          {/* <span className='net-rate'>{netRate}</span> */}
        </span>
        <span className="player-title-right fr clearfix">
          {closeVideo && (
            <Icon
              className="fr"
              type="video_close"
              title="关闭"
              onClick={this.closeVideo}
            />
          )}
          {captureScreen && (
            <Icon
              className="fr"
              type="Photo"
              title="抓图"
              onClick={e => this.captureScreen(e)}
            />
          )}
        </span>
      </div>
    );
    return defaultTitle;
  }
  // 事件监听的回调
  onEvents = player => {
    const { index } = this.props;
    const posIndex = this.props.posIndex + 1;
    if (player) {
      const {
        onPlay,
        onLoading,
        onReady,
        onSeek,
        onEnd,
        onReplay,
        onReload,
        onError
      } = this.props.videoListener;
      player.on("play", data => {
        console.log("--- player play ---");
        console.log(`第 ${posIndex} 个视频播放成功，对应videoData索引${index}`);
        onPlay && onPlay(data);
      });
      player.on("loading", data => {
        console.log("--- player loading ---");
        // console.log(`第 ${posIndex} 个视频加载中，对应videoData索引${index}`);
        onLoading && onLoading(data);
      });
      player.on("ready", data => {
        console.log("--- player ready ---");
        console.log(`第 ${posIndex} 个视频准备播放，对应videoData索引${index}`);
        onReady && onReady(data);
      });
      player.on("seek", data => {
        console.log("--- player seek ---");
        onSeek && onSeek(data);
      });
      player.on("ended", data => {
        console.log("--- player ended ---");
        console.log(`第 ${posIndex} 个视频播放结束，对应videoData索引${index}`);
        onEnd && onEnd(data);
      });
      player.on("replay", data => {
        console.log("--- player replay ---");
        console.log(`第 ${posIndex} 个视频重新播放，对应videoData索引${index}`);
        onReplay && onReplay(data);
      });
      player.on("reload", data => {
        console.log("--- player reload ---");
        console.log(`第 ${posIndex} 个视频重新加载，对应videoData索引${index}`);
        onReload && onReload(data);
      });
      player.on("error", data => {
        console.log("--- player error ---");
        console.log(`第 ${posIndex} 个视频播放出错，对应videoData索引${index}`);
        console.log(data);
        onError && onError(data);
      });
      // player.on('all', (data) => {
      //   console.log('--- all ---')
      //   console.log(data)
      // })
    }
  };
  
  // ************************************************************* //
  // ***********************    生命周期   ************************ //
  // ************************************************************* //

  // 组件将要卸载
  componentWillUnmount() {
    if (this.player) {
      this.player.off();
    }
  }

  render() {
    // console.log('=================================================')
    let {
      EmptyPlayer,
      fileData = {}, // 视频的所有信息
      file,
      title,
      controls = {},
      fragment = false,
      isLiving = true,
      ptzControl,
      videoEvents,
      index,
      posIndex,
      videoTurn,
      playerRef,
      videoListener,
      watermark = "", // 字符串
      children = null,
      ...other
    } = this.props;
    const {
      captureData,
      ptzToggle,
      downloadWindowVisible,
      currentDate
    } = this.state;
    const defaultConfig = this.defaultConfig;
    let content, minDate, maxDate;
    if (file) {
      // 处理title
      if (!React.isValidElement(title) && util.judgeType(title, "Object")) {
        //如果title不是React组件且title是object
        title = Object.assign({}, defaultConfig.title, title);
        title = this.rendereTitle({
          cameraName: title.cameraName,
          // netRate: '120Kbps',
          closeVideo: title.closeVideo === undefined ? true : title.closeVideo,
          captureScreen: title.captureScreen === undefined ? true : title.captureScreen
        });
      }
 
      // 处理controls  true/false/json
      controls =
        !util.judgeType(controls, "Object") && controls ? {} : controls;
      // 对象
      if (util.judgeType(controls, "Object")) {
        // 设置默认值 controls download默认为true，playMethod默认为true
        if (controls.playMethod !== false) {
          defaultConfig.controls.playMethod = this.renderCustomMethod(isLiving);
        }
        controls = Object.assign({}, defaultConfig.controls, controls);
        for (var k in controls) {
          if (controls[k] || controls[k] === undefined) {
            controls[k] = defaultConfig.controls[k];
          } else {
            delete controls[k];
          }
        }
        controls.stretch = this.customStretchBtn(this.state.stretching);
        // controls.selection = this.customSelectionBtn();
        if (!videoTurn) {
          delete controls.videoTurn;
        } else {
          delete controls.playMethod;
        }
      }
      console.log(fragment)
      let options = {
        historyList: fragment,
        file,
        title,
        controls,
        isLiving,
        autoplay: true,
        stretching: this.state.stretching, // 画面拉伸
        contextMenu: [], // 鼠标右键
        playbackRateControls: true, // 是否开启 playebackRate 控制
        livingMaxBuffer: 3, // 直播缓存时间
        timeout: 1000 * 15, // 超时重载
        retryTimes: 10, // 重载次数
        controlbarHideTime: 800, // 用户不活跃后，多长时间隐藏controlbar，毫秒
      };
      if (options.controls) {
        if (isLiving) { // 直播
          if (ptzControl !== false) { // 是否显示云台功能
            options.controls.ptzControl = this.ptzControlIcon(ptzToggle, fileData.cameraId);
          }
          options.flvConfig = { enableWorker: true };
          delete options.controls.download;
        } else { // 历史
          options.timeSliderShowFormat = "date";
          // options.controls.stop = this.customStopBtn;
          options.controls.speed = true;
          options.playbackRates = [0.125, 0.25, 0.5, 1, 2, 4, 8]; // 播放速度
        }
      }
      if(isLiving){
        content = (
          <H5Player
            videoCallback={player => {
              //player参数是实例化后的播放器
              playerRef(player);
              this.player = player;
              this.onEvents(player);
            }}
            key={file}
            {...options}
            localization={localization}
          >
            {children}
            {/* { // 播放器方向键云台控制
              ptzControl && (
                <CameraControl
                  cameraId={fileData.cameraId}
                  close={this.setPtzControl.bind(this)}
                />
            )} */}
            {!!captureData.length && (
              <CaptureList
                captureData={captureData}
                clearCapture={this.clearCapture}
                delImg={this.delCaptureImg}
              />
            )}
            {watermark && (
              <div
                className="player-watermark"
                style={{
                  backgroundImage: `url(${util.drawWaterMark({ watermark })})`
                }}
              />
            )}
          </H5Player>
        )
      } else {
        // minDate = new Date(fragment.beginDate)*1;
        // maxDate = new Date(fragment.beginDate)*1 + fragment.duration * 1000;
        content= (
          <H5HisPlayer
            videoCallback={player => {
              //player参数是实例化后的播放器
              playerRef(player);
              this.player = player;
              this.player.on('selection',data => this.handleSelectionChange(data))
              this.onEvents(player);
            }}
            key={file}
            {...options}
            leftSelectionComponent={<span></span>}
            rightSelectionComponent={<span></span>}
            localization={localization}
          >
            {children}
            {!!captureData.length && (
              <CaptureList
                captureData={captureData}
                clearCapture={this.clearCapture}
                delImg={this.delCaptureImg}
              />
            )}
            {watermark && (
              <div
                className="player-watermark"
                style={{
                  backgroundImage: `url(${util.drawWaterMark({ watermark })})`
                }}
              />
            )}
          </H5HisPlayer>
        )
      }
    } else {
      // 空视频源
      content = (
        <div className="empty-player-wrapper">
          {children}
          {this.renderEmptyPlayer(EmptyPlayer)}
        </div>
      );
    }
    return (
      <div id={this.id} className="player-box" draggable={false} {...other}>
        { content }
        { downloadWindowVisible && (
          <DownloadWindow
            currentDate={currentDate}
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            // minDate={minDate}
            // maxDate={maxDate}
            handleDownload={this.handleDownload}
            cancelDownload={this.cancelDownload}
            onDateChange={this.handleDateChange}            
          />
        )}
      </div>
    );
  }
}

export default Player;
