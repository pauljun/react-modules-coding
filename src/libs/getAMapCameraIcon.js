import React from 'react'
// import ReactDOM from 'react-dom'
import { getCameraTypeIcon, cameraOrientation } from './Dictionary'

const getCameraIcon = point => {
  let { url, color } = getCameraTypeIcon(point.deviceType, point.deviceData)
  let score = 0
  if (point.extJson && point.extJson.extMap && point.extJson.extMap.cameraOrientation) {
    let result = cameraOrientation.filter(v => v.value === point.extJson.extMap.cameraOrientation.toString())
    if (result.length) {
      score = result[0].score
    }
  } else {
    color = 'transparent'
  }
  let Content = `<div><div class='map-icon-content'><div class='bd' style='background-image: url( ` + url +
    `'></div><div class='circle' style='border-color: ` + color + 
    ` transparent transparent transparent; transform: rotate( ` + score +
    `deg)'></div></div></div>`
  // ReactDOM.render(Content, Div);
  return Content
}

export default getCameraIcon