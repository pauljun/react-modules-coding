import React, { Component } from 'react';
import { Icon, Modal } from 'antd';
import Player from './Player';
import * as util from 'src/utils';

// 分屏数对应将屏幕划分的列数, 及对应的宽度比例
const colsMap = {
  1: { colsNum: 1, percent: 100 },
  4: { colsNum: 2, percent: 50 },
  9: { colsNum: 3, percent: 33.3333333 },
  16: { colsNum: 4, percent: 25 }
}
class MutilPlayer extends Component {
  idSuffix = Math.random();
  idPrefix = 'player-container';

  render () {
    let { 
      videoData, 
      videoEvents, 
      screenNum, 
      currIndex, 
      draggable, 
      ptzControl,
      posIndexArr, 
      playerRef, 
      videoListener,
      watermark
    } = this.props;
    const colsTemp = colsMap[+screenNum];
    const colsNum = colsTemp.colsNum;
    const percent = colsTemp.percent;
    const cols = 'cols-' + colsNum;
    return (
      <div className={`multiplayer-body ${cols}`}>
				{!!videoData && videoData.map((v, k) => {
          v = v ? v : {};
          const isActive = currIndex === k ? 'active-player' : '';
          const posIndex = posIndexArr[k];
          const top = Math.floor(posIndex / colsNum) * percent + '%';
          const left = (posIndex % colsNum) * percent + '%';
          const key = v.file + '_' + k;
          const id = `${this.idPrefix}-${k}-${this.idSuffix}`
          return (
            <div
              key={key}
              className={`player-container ${isActive}`}
              style={{top, left}}
              id={id}
            >
              <Player
                playerRef={player => playerRef(player, k)}
                watermark={watermark}
                videoListener={videoListener}
                ptzControl={ptzControl ? v.ptzControl : false}
                index={k}
                fileData={v}
                posIndex={posIndex}
                videoEvents={videoEvents}
                file={v.file}
                title={v.title}
                videoTurn={v.videoTurn}
                isLiving={v.isLiving}
                fragment={v.fragment}
                controls={v.controls}
                onDragOver={this.onDragOver}
                onDrop={(e) => this.onDrop(e, k)}
              >
                <div className='drag-title'
                  draggable={draggable}
                  onDragStart={(e) => this.onDragStart(e, k)}
                  onClick={() => videoEvents.onSelectPlayer(k)}
                  onDoubleClick={() => videoEvents.onDoubleClick(k)}
                  style={{ position: 'absolute', top: '0', height: '100%', width: '100%', background: 'rgba(0,0,0,0)' }}
                ></div>
              </Player>
            </div>
          );
        })}
      </div>
    )
  }
  // 拖动实现方式：改变div的定位
  // dragstart 设置一个事件监听器存储拖拽数据
  onDragStart = (event, i) => {
    console.log('onDragStart')
    // 存储拖拽数据和拖拽效果...
    event.dataTransfer.setData('srcIndex', i);
  }
  // dragover事件，用来确定给用户显示怎样的反馈信息
  onDragOver = (event) => {
    // 阻止浏览器默认事件
    event.preventDefault();
  }
  // onDrop事件，允许放置对象
  onDrop = (event, tarIndex) => {
    console.log('onDrop')
    event.preventDefault();
    const srcIndex = +event.dataTransfer.getData('srcIndex');
    if (srcIndex !== tarIndex){
      // 交换posIndex;
      let posIndexArr = this.props.posIndexArr;
      const srcTemp = posIndexArr[srcIndex];
      const tarTemp = posIndexArr[tarIndex];
      posIndexArr[srcIndex] = tarTemp;
      posIndexArr[tarIndex] = srcTemp;
      const srcDom = document.getElementById(`${this.idPrefix}-${srcIndex}-${this.idSuffix}`);
      const desDom = document.getElementById(`${this.idPrefix}-${tarIndex}-${this.idSuffix}`);
      let srcLeft = srcDom.style.left;
      let srcTop = srcDom.style.top;
      let desLeft = desDom.style.left;
      let desTop = desDom.style.top;
      srcDom.style.top = desTop;
      srcDom.style.left = desLeft;
      desDom.style.top = srcTop;
      desDom.style.left = srcLeft;
      // 拖动结束后改变选中的索引
      this.props.videoEvents.updatePosIndex(posIndexArr)
      this.props.videoEvents.onSelectPlayer(srcIndex);
    }
  }
}

export default MutilPlayer;

/* 

  videoData = [{
    file:'',
    isLiving: true,
    controls: {
      download: true,
      playMethod: true,
    },
    title: {
      cameraName: '我的摄像机',
      netRate: true,
      close: true,
      captureScreen: true,
      download: false,
    }
  }]

  视频容器组件：<PlayerContainer />
    提供方法，ui有用户自定义
    功能点：
      js部分：分屏、拖动、选中、关闭所有、路径切换、（全屏）、轮巡功能
      硬件部分：GPU硬解、发送到扩展屏、比例缩放、
    参数：
        videoConfig = {
          controlbar: true,
          draggable: true // 是否拖动
          screenNum: 4, // 屏幕数量
          playbackRates: [], // 调速
        }
        videoEvents = {
          setScreenNum: '', // 设置屏幕数量
          closeAll: '', // 关闭所有视频
          closeVideo: '', // 关闭视频
          downloadVideo: '', // 下载视频
          captureScreen: ''// 视频截图
          setPlayMethod: '', // 设置播放模式
          ...otherFunc
        },
        videoData = [ // 传递给<Player />
          {
            file:'',
            isLiving: true,
            fragment: '', // isLiving为false时有效
            controls: {
              download: true,
              playMethod: true,
            },
            title: {
              cameraName: '我的摄像机',
              netRate: true,
              close: true,
              captureScreen: true,
              download: false,
            }
          }
        ],    

  基础视频组件：<Player />
    直播方式： flv 直播
      flvConfig={{ enableWorker: true }}
        
    功能点：
      基础已有功能：播放、暂停、变速、调音、点播、全屏、重播
      添加功能：截图（截图列表）、直播回放切换、历史调阅、关闭、网速、云台、下载、旋转
    参数：
      file
      title
      controls
      isLiving
      fragment
      cameraControlFlag:false // 是否展示云台控制
    
    直播时可显示的按钮：
      关闭、抓怕、isLive切换、音量、云台（球机）
    历史时可显示的按钮：
      关闭、抓怕、进度条、倍速、下载、播放，暂停、音量

    <div className='drag-title'
      style={{ position: 'absolute', top: '0', height: '30px', width: '100%', background: 'rgba(0,0,0,0)', zIndex: 9999 }}
      draggable={true}
      onDragStart={(e) => this.onDragStart(e, k)}
      onDragOver={this.onDragOver}
      onDrop={(e) => this.onDrop(e, k)}
    ></div> 
*/