import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Icon, Slider } from 'antd'
import './cameraControl.scss'
import * as util from 'src/utils';

const layerPos = [
  'up',
  'rightup',
  'right',
  'rightdown',
  'down',
  'leftdown',
  'left',
  'leftup'
]

@inject('monitorModel', 'orgCameraModel')
@observer
export default class CameraControl extends Component {
  constructor(props) {
    super(props)
    const { orgCameraModel, cameraId } = this.props
    let cameraInfo = orgCameraModel.getCameraInfoByCid(cameraId)
    this.isGB = false
    // 国标摄像机
    // 控制速度0-3
    // 可以控制云台转动和焦距，持续控制

    // 非国标
    // 控制速度0-255
    // 上下控制较明显、左右不明显
    // 不能控制焦距，只能步骤控制（点控）

    try {
      this.isGB = cameraInfo.extJson.cameraInfo.type.toLowerCase() === 'gb'
    } catch (e) {
      console.error(e)
    }
    this.state = {
      active: null,
      speed: this.isGB ? 2 : 20
    }
  }
  setSpeed(speed) {
    console.log(speed);
    this.setState({ speed })
  }
  controlHandle(type) {
    let { monitorModel, cameraId } = this.props
    this.setState({ active: type })
    monitorModel.ptzControl(cameraId, type, this.isGB, this.state.speed, false, this.token).then(token => {
      this.token = token;
    })
  }

  async cancleControl(type,isZoom) {
    if (this.state.active || isZoom) {
      let { monitorModel, cameraId } = this.props
      if (this.isGB) {
        setTimeout(() => {
          monitorModel.ptzControl(
            cameraId,
            type,
            this.isGB,
            this.state.speed,
            true,
            this.token
          )
        }, 100)
      }
    }
  }

  onDoubleClick = (e) => {
    util.stopPropagation(e) 
  }
  pullCloser(e) { 
    this.zoomAction('zoomin')
  }
  pullFar(e) {   
    this.zoomAction('zoomout')
  }

  // 调焦
  zoomAction(type) {
    let { monitorModel, cameraId } = this.props
    console.log(type, this.isGB);
    if (this.isGB) {
      monitorModel
        .ptzControl(
          cameraId,
          type,
          this.isGB,
          this.state.speed,
          false,
          this.token
        )
        .then(token => {
          this.token = token
          //this.cancleControl(type,isZoom)
        });
    }
  }

  render() {
    let { close } = this.props
    let { active } = this.state
                
    return (
      <div className="cameraControl-layer" onDoubleClick={this.onDoubleClick}>
        <div className="cameraControl-wrapper">
          <ul onMouseOut={() => this.setState({ active: null })}>
            {layerPos.map((item, index) => (
              <li
                key={item}
                className={`cameraControl-${item} ${
                  item === active ? "active" : ""
                }`}
              >
                <a
                  onMouseDown={this.controlHandle.bind(this, item)}
                  onMouseUp={this.cancleControl.bind(this, item)}
                >
                  <span />
                </a>
              </li>
            ))}
          </ul>
          <div className="center-layer" />
        </div>
        <div className="box-focal">
          <span
            className="zoomin" 
            onMouseDown={this.pullCloser.bind(this)} 
            onMouseUp={this.cancleControl.bind(this, "zoomin", true)}
          >
            <Icon type="plus-circle-o" title="拉近" />
          </span>
          <span
            className="zoomout"
            onMouseDown={this.pullFar.bind(this)} 
            onMouseUp={this.cancleControl.bind(this, "zoomout", true)}
          >
            <Icon type="minus-circle-o" title="推远" />
          </span>
        </div>
        <div className="box-speed">
          <span className="box-speed-icon"></span>
          <Slider 
            min={0}
            max={this.isGB ? 3 : 255}
            defaultValue={this.isGB ? 2 : 20} 
            onAfterChange={this.setSpeed.bind(this)}
          />
        </div>
      </div>
    );
  }
}

// // 云台控制组件
// export default class CameraControl extends React.Component {
//   state = {};
//   static contextTypes = {
//     player: PropTypes.object,
//   };
//   componentDidMount() {
//     const player = this.context.player;
//     // 绑定滚轮事件
//     // player.on('loadeddata', () => {
//     //   this.mousewheelEvent(player);
//     // });
//     player.on('timeupdate', () => {
//       if (
//         ((player.ended || player.isError) && this.state.showArrowControler) ||
//         !player.playing
//       ) {
//         //视频结束或者中途报错
//         this.setState({
//           showArrowControler: false,
//         });
//       } else if (player.playing) {
//         this.setState({
//           showArrowControler: true,
//         });
//       }
//     });
//   }
//   onMouseDown = type => {
//     return e => {
//       this.props.ptzControl && this.props.ptzControl(type)
//     };
//   };
//   onMouseUp = type => {
//     return e => {
//       switch (type) {
//         case 'top-left':
//           console.log('结束向左上移动');
//           break;
//         case 'top-middle':
//           console.log('结束向上移动');
//           break;
//         case 'top-right':
//           console.log('结束向右上移动');
//           break;
//         case 'middle-left':
//           console.log('结束向左移动');
//           break;
//         case 'middle-middle':
//           if (!this.rotate) {
//             console.log('开始旋转');
//             this.rotate = true;
//           } else {
//             console.log('结束旋转');
//             this.rotate = false;
//           }
//           break;
//         case 'middle-right':
//           console.log('结束向右移动');
//           break;
//         case 'bottom-left':
//           console.log('结束向左下移动');
//           break;
//         case 'bottom-middle':
//           console.log('结束向下移动');
//           break;
//         case 'bottom-right':
//           console.log('结束向右下移动');
//           break;
//         default:
//       }
//     };
//   };
//   mousewheelEvent(player) {
//     let mousewheelEvent;
//     let mousewheelFirfoxEvent;
//     player.on('focus', flag => {
//       if (flag) {
//         const mousewheelCallback = e => {
//           e.preventDefault();
//           if (e.nativeEvent.wheelDelta > 0) {
//             console.log('摄像机开始放大镜头');
//           } else {
//             console.log('摄像机开始缩小镜头');
//           }
//         };
//         mousewheelEvent = player.on(document, 'mousewheel', mousewheelCallback);
//         //firfox
//         mousewheelFirfoxEvent = player.on(
//           document,
//           'DOMMouseScroll',
//           mousewheelCallback
//         );
//       } else {
//         mousewheelEvent && mousewheelEvent.off();
//         mousewheelFirfoxEvent && mousewheelFirfoxEvent.off();
//       }
//     });
//   }
//   render() {
//     // debugger
//     // const { showArrowControler } = this.state;
//     // if (!showArrowControler) {
//     //   return false;
//     // }
//     return (
//       <div className='camera-control-container'>
//         <div className='camera-control-top'>
//           <div
//             className='camera-control-top-left'
//             onMouseDown={this.onMouseDown('top-left')}
//             onMouseUp={this.onMouseUp('top-left')}
//           >
//             <span />
//           </div>
//           <div
//             className='camera-control-top-middle'
//             onMouseDown={this.onMouseDown('top-middle')}
//             onMouseUp={this.onMouseUp('top-middle')}
//           >
//             <span />
//           </div>
//           <div
//             className='camera-control-top-right'
//             onMouseDown={this.onMouseDown('top-right')}
//             onMouseUp={this.onMouseUp('top-right')}
//           >
//             <span />
//           </div>
//         </div>
//         <div className='camera-control-middle'>
//           <div
//             className='camera-control-middle-left'
//             onMouseDown={this.onMouseDown('middle-left')}
//             onMouseUp={this.onMouseUp('middle-left')}
//           >
//             <span />
//           </div>
//           <div
//             className='camera-control-middle-middle'
//             onMouseDown={this.onMouseDown('middle-middle')}
//             onMouseUp={this.onMouseUp('middle-middle')}
//           >
//             {/* <svg
//               className='nan-icon nan-middle-button nan-replay-icon'
//               aria-hidden='true'
//             >
//               <use xlinkHref='#icon-replay' />
//             </svg> */}
//           </div>
//           <div
//             className='camera-control-middle-right'
//             onMouseDown={this.onMouseDown('middle-right')}
//             onMouseUp={this.onMouseUp('middle-right')}
//           >
//             <span />
//           </div>
//         </div>
//         <div className='camera-control-bottom'>
//           <div
//             className='camera-control-bottom-left'
//             onMouseDown={this.onMouseDown('bottom-left')}
//             onMouseUp={this.onMouseUp('bottom-left')}
//           >
//             <span />
//           </div>
//           <div
//             className='camera-control-bottom-middle'
//             onMouseDown={this.onMouseDown('bottom-middle')}
//             onMouseUp={this.onMouseUp('bottom-middle')}
//           >
//             <span />
//           </div>
//           <div
//             className='camera-control-bottom-right'
//             onMouseDown={this.onMouseDown('bottom-right')}
//             onMouseUp={this.onMouseUp('bottom-right')}
//           >
//             <span />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
