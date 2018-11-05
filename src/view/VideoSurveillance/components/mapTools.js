import React from 'react';
import { Icon, Popover } from 'antd';
import IconFont from '../../../components/IconFont';
import FullScreenLayout from '../../../components/FullScreenLayout';
import DeviceIcon from '../../../components/DeviceIcon';
import { CameraType, DeviceState } from '../../../libs/DeviceLib';
import '../style/mapTools.scss';

const deviceType = CameraType.filter(v => v.value !== '-1');
const deviceData = DeviceState.filter(v => v.value !== '-1');
export default class MapTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: deviceType.map(v => v.value),
      status: deviceData.map(v => v.value)
    };
  }
  changeMapMarker(changeType, code, flag) {
    const { clusterMarker } = this.props;
    const state = this.state;
    const index = state[changeType].indexOf(code);
    if (index > -1) {
      state[changeType].splice(index, 1);
    } else {
      state[changeType].push(code);
    }
    this.setState({ [changeType]: state[changeType] }, () => {
      clusterMarker.showCustomMarker(this.state.type, this.state.status);
    });
  }
  getPopupContent = () => {
    const { type, status } = this.state;
    return (
      <div className="type-popup-layout">
        <div className="type-part">
          <div className="type-name">设备种类</div>
          <div className="type-content">
            {deviceType.map(item => (
              <div
                className={`type-item ${
                  type.indexOf(item.value) > -1 ? 'active' : ''
                } `}
                key={item.value}
                onClick={() => this.changeMapMarker('type', item.value)}
              >
                <span className="icon">
                  <DeviceIcon
                    deviceType={item.value}
                    type={item.value}
                    theme="outlined"
                  />
                </span>
                <span className="lable-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="type-part">
          <div className="type-name">在离线状态：</div>
          <div className="type-content">
            {deviceData.map(item => (
              <div
                className={`type-item ${
                  status.indexOf(item.value) > -1 ? 'active' : ''
                } `}
                key={item.value}
                onClick={() => this.changeMapMarker('status', item.value)}
              >
                <span className="icon">
                  <IconFont
                    type={
                      item.value === '1'
                        ? 'icon-OnLine_Main'
                        : 'icon-OffLine_Main'
                    }
                    theme="outlined"
                  />
                </span>
                <span className="lable-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  render() {
    const {
      startDrawRect,
      startDrawCircle,
      startDrawPolygon,
      clearDraw
    } = this.props;
    return (
      <div className="video-map-tools">
        <div className="resource-popup-layout" />
        <div className="tools-layout">
          <Popover
            trigger={'click'}
            getPopupContainer={() =>
              document.querySelector('.resource-popup-layout')
            }
            content={this.getPopupContent()}
          >
            <div className="tools-resource">
              <IconFont type="icon-Layer_Main" theme="outlined" />
              资源
              <IconFont type="icon-Arrow_Small_Down_Mai" theme="outlined" />
            </div>
          </Popover>
          <div className="map-draw-layout">
            <div
              className="tools-draw"
              onClick={() => startDrawRect && startDrawRect()}
            >
              <IconFont type="icon-Choose__Main1" theme="outlined" />
              框选
            </div>
            <div
              className="tools-draw"
              onClick={() => startDrawCircle && startDrawCircle()}
            >
              <IconFont type="icon-Choose__Main" theme="outlined" />
              圆选
            </div>

            <div
              className="tools-draw"
              onClick={() => startDrawPolygon && startDrawPolygon()}
            >
              <IconFont type="icon-Choose__Main2" theme="outlined" />
              多边形
            </div>
            <div
              className="tools-draw"
              onClick={() => clearDraw && clearDraw()}
            >
              <IconFont type="icon-Close_Main1" theme="outlined" />
              清除
            </div>
          </div>
          <FullScreenLayout
            className="tools-screen"
            getContainer={() => document.querySelector('.video-surveillance')}
          />
        </div>
      </div>
    );
  }
}
