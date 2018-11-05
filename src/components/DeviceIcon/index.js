import React from 'react';
import IconFont from '../IconFont';
import './index.scss';
export default function DeviceIcon({
  type,
  status,
  onlineClass = 'online-device',
  offlineClass = 'offline-device',
  className,
  deviceType,
  ...props
}) {
  const onLine = status * 1 === 1;
  const currentType = deviceType * 1 !== 103401 ? deviceType : type;
  let iconType = null;
  let iconClassName = onLine ? onlineClass : offlineClass;
  switch (+currentType) {
    case 100602:
      iconType = 'icon-_Camera__Main';
      break;
    case 100603:
      iconType = 'icon-_Camera__Main3';
      break;
      case 100604:
        iconType = 'icon-_Camera__Main1';
        break;
    case 100605:
      iconType = 'icon-_Alarm__Main1';
      break;
    case 103406:
      iconClassName = onlineClass;
      iconType = 'icon-_Door__Main';
      break;
    case 103407:
      iconClassName = onlineClass;
      iconType = 'icon-_Car__Main';
      break;
    default:
      iconType = 'icon-_Camera__Main1';
      break;
  }
  return (
    <IconFont
      type={iconType}
      className={`${iconClassName} ${className ? className : ''}`}
      {...props}
    />
  );
}
