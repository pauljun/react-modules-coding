import React, { Component } from 'react';
import { Icon } from 'antd';
import * as util from 'src/utils';
import BtnScreenSplit from './BtnScreenSplit';
// 播放器控制台
const ControlBar = (props) => {
  const { 
    screenNumBtn, 
    setScreenNum, 
    maxScreenNum, 
    cloaseAllBtn, 
    closeAll, 
    videoTurnBtn, 
    showVideoTurnModal, 
    stopVideoTurn, 
    screenNum, 
    extendScreenBtn, 
    openExtendScreen, 
    isVideoTurn, 
    setFullScreen,
    fullScreen,
    children = null 
  } = props;
  return (
    <div className='multiplayer-header'>
      {
        screenNumBtn && 
        <BtnScreenSplit setScreenNum={setScreenNum} screenNum={screenNum} maxScreenNum={maxScreenNum} />
      }
      {
        setFullScreen &&
        <ControlBtn 
          onClick={() => setFullScreen()} 
          icon={fullScreen ? 'zuixiaohua-copy' : 'quanpingx1'} 
          label={`${fullScreen?'退出':''}全屏`} 
        />
      }
      {/* {
        videoTurnBtn &&
        <ControlBtn onClick={showVideoTurnModal} icon='retweet' label='轮巡' />
      } */}
      {
        isVideoTurn &&
        <ControlBtn onClick={stopVideoTurn} icon='retweet' label='结束轮巡' />
      }
      {/* {
        extendScreenBtn &&
        <ControlBtn onClick={openExtendScreen} icon='kuozhanping' label='发送到扩展屏' />
      } */}
      {
        cloaseAllBtn &&
        <ControlBtn onClick={closeAll} icon='close' label='关闭' />
      }
      { children }
    </div>
  )
}

const ControlBtn = ({ onClick, icon, label='', className='' }) => {
  return (
    <span 
      className={`multiplayer-control-btn ${className}`} 
      onClick={onClick} 
    >
      <Icon type={icon} />
      <span>{util.lan(label)}</span>
    </span>
  )
}

export default ControlBar;
