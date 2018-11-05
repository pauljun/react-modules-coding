import React from 'react';
import FullScreenLayout from '../../../components/FullScreenLayout';
import SreenChiose from './SreenChiose';
import IconFont from '../../../components/IconFont';
import '../style/listTools.scss';

export default class ListTools extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      currentScreen,
      closeVideo,
      selectSrceen,
      isLoop,
      stopLoop
    } = this.props;
    return (
      <div className="video-list-tools">
        <div className="split-screen-popup-layout" />
        <div className="tools-layout">
          <SreenChiose
            currentScreen={currentScreen}
            selectSrceen={selectSrceen}
            getPopupContainer={() =>
              document
                .querySelector('.ant-tabs-tabpane-active')
                .querySelector('.split-screen-popup-layout')
            }
          />
          <FullScreenLayout
            className="tools-screen"
            getContainer={() =>
              document
                .querySelector('.ant-tabs-tabpane-active')
                .querySelector('.player-mutipart-layout')
            }
          />

          <div
            className="tools-draw"
            onClick={() => (isLoop ? stopLoop() : closeVideo())}
          >
            <IconFont type="icon-Close_Main1" theme="outlined" />
            {isLoop ? '结束轮巡' : '关闭'}
          </div>
        </div>
      </div>
    );
  }
}
