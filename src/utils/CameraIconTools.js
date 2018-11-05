import { cameraOrientation } from '../libs/Dictionary';
import { getCameraTypeIcon } from '../libs/Dictionary/mapIcon';

export function getAMapCameraIcon(point, active) {
  let { url, color, bgColor } = getCameraTypeIcon(
    point.manufacturerDeviceType === 103401
      ? point.deviceType
      : point.manufacturerDeviceType,
    point.deviceData
  );
  let score = 0;
  if (
    point.extJson &&
    point.extJson.extMap &&
    point.extJson.extMap.cameraOrientation
  ) {
    let result = cameraOrientation.filter(
      v => v.value === point.extJson.extMap.cameraOrientation.toString()
    );
    if (result.length) {
      score = result[0].score;
    }
  } else {
    color = 'transparent';
  }
  let Content = `<div class='map-icon-content'>
    <div class='bd' style='background-image: url(${url});background-color:${
    active ? '#ffaa00' : bgColor
  };background-size:16px'></div>
    <div class='circle' style='border-color: ${color} transparent transparent transparent; transform: rotate(${score}deg)'></div>
  </div>`;
  return Content;
}
