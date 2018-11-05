import React from 'react';
import DeviceIcon from '../../DeviceIcon';
import './style/map-icon.scss';
export default function MapIcon(props) {
  return (
    <div className={`map-icon ${props.selected ? 'map-icon-select' : ''}`}>
      <DeviceIcon
        type={props.deviceType}
        status={props.deviceData}
        onlineClass={'device-online'}
        offlineClass={'device-off-line'}
      />
    </div>
  );
}
