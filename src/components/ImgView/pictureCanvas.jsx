import React from 'react'
import { observer } from 'mobx-react';
import { BusinessProvider }from 'src/utils/Decorator/BusinessProvider'
import moment from 'moment'
import { Icon, message } from 'antd'
import { 
  downloadLocalImage as Util_downloadLocalImage,
  fullscreen as Util_fullScreen,
  exitFullscreen as Util_exitFullscreen,
} from 'src/utils';

import imgBase64 from './imgBase64'
function getClientPos(e) {
  let pageX;
  let pageY;

  if (e.touches) {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
  } else {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  return {
    x: pageX,
    y: pageY,
  };
}

@BusinessProvider('UserStore', 'MediaLibStore')
@observer
class view extends React.Component {
  state = {
    viewHeight: 500,
    viewWidth: 600,
    top: 0,
    left: 0,
    nowLeft: 0,
    nowTop: 0,
    scale: 1,
    rotate: 0,
    imgUrl: '',
    mouseDownState: false,
    firstClientPos: { x: 0, y: 0 },
    fullScreen: false,
    coverSpinShow: false,
  }
  // 滚轮事件
  handleWheel = (e) => {
    if (this.props.changeScale) {
      e.preventDefault();
      this.setScale(e.deltaY / 1000)
    }
  }

  /**缩放 */
  setScale(value) {
    let { scale } = this.state
    scale -= value
    message.destroy()
    if (scale < 0.4) {
      return message.warn('已缩放到最小级别')
    }
    if (scale > 3.1) {
      return message.warn('已缩放到最大级别')
    }
    this.setState({
      scale
    })
  }

  setRotate = (direction) => {
    let rotate = this.state.rotate
    if(direction === 'anticlockwise'){ // 逆时针旋转
      rotate = rotate - 90
    } else if(direction === 'clockwise'){ // 顺时针旋转
      rotate = rotate + 90
    } else { // 复位
      rotate = 0
      this.setState({
        top: 0,
        left: 0
      })
    }
    this.setState({
      rotate
    })
  }
  // 下载
  downloadPic() {
    const { url, cameraInfo } = this.props
    const time = moment(parseInt(cameraInfo.time, 10)).format('YYYY-MM-DD HH:mm:ss')
    Util_downloadLocalImage(url, cameraInfo.name + time)
  }

  /**收藏 */
  storageImg() {
    let { url, cameraInfo, MediaLibStore } = this.props
    cameraInfo = cameraInfo || 'ss';
    const localImgObg = {
      cameraId: cameraInfo.id,
      cameraName: cameraInfo.name,
      captureTime: Number(cameraInfo.time),
      imgUrl: url,
      type: 'image'
    }
    MediaLibStore.add(localImgObg).then(() => {
      message.success('添加成功！')
    })
  }

  /**图片转base64 打水印*/
  async getImgurl() {
    let { UserStore } = this.props;
    let timeSamp = await UserStore.getSystemTime()
    imgBase64(this.props, moment(parseInt(timeSamp, 10)).format('YYYYMMDDTHHmmss'), imgUrl => {
      this.setState({ imgUrl })
    })
  }
  //全屏
  setFullScreen = fullScreen => {
    fullScreen = fullScreen === undefined ? !this.state.fullScreen : fullScreen;
    this.setState({
      fullScreen
    });
    if (fullScreen) {
      Util_fullScreen(this.fullContainer);
    } else {
      Util_exitFullscreen();
    }
  };

  // 以图搜图
  handleSearchPic() {
    return this.props.onSearchPic();
  }

  onViewMouseTouchDown = (e) => {
    e.preventDefault();
    let { left, top } = this.state
    this.setState({
      mouseDownState: true
    })
    const clientPos = getClientPos(e);
    this.setState({
      firstClientPos: clientPos,
      nowLeft: left,
      nowTop: top
    })
  }

  onMouseTouchMove = (e) => {
    if (!this.state.mouseDownState) {
      return
    }
    let { firstClientPos, nowLeft, nowTop } = this.state
    const clientPos = getClientPos(e);
    let cx = clientPos.x, cy = clientPos.y, fx = firstClientPos.x, fy = firstClientPos.y,
      xPos = cx - fx,//x位移
      yPos = cy - fy //y位移
    this.setState({
      left: nowLeft + xPos,
      top: nowTop + yPos,
    })
  }

  onMouseTouchEnd = (e) => {
    if (!this.state.mouseDownState) {
      return
    }
    this.setState({
      mouseDownState: false
    })
  }

  setFullScreen() {
    return this.props.setFullScreen()
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseTouchMove)
    document.addEventListener('mouseup', this.onMouseTouchEnd)
    this.originUrl = this.props.url;
    this.getImgurl()
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.url !== this.originUrl){
      this.originUrl = nextProps.url;
      this.getImgurl();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseTouchMove);
    document.removeEventListener('mouseup', this.onMouseTouchEnd);
  }

  render() {
    const {
      top,
      left,
      scale,
      rotate,
      imgUrl,
      fullScreen,
      coverSpinShow,
      viewHeight,
      viewWidth,
    } = this.state
    const {
      downloadPic, //下载
      storageImg, //收藏
      changeScale, //缩放事件
      rolate, //旋转事件
      searchPic, //以图搜图
      fullBtn ,//全屏事件
    } = this.props

    let imgWidthStyle = 'auto'
    let imgHeightStyle = 'auto'
 
    return (
      <div
        className='canvas-img-container'
        onWheel={this.handleWheel}
        onMouseDown={this.onViewMouseTouchDown}
        ref={fullContainer => (this.fullContainer = fullContainer)}
      >
        <img
          className='wrapper-img'
          src={imgUrl}
          style={{
            top,
            left,
            transform: `scale(${scale}) rotate(${rotate}deg)`
          }}
        />
        <div className='full-btn' title='全屏'>
          <Icon type='video_full'/>
        </div>
        {fullBtn && (
          <div 
            className='full-btn' 
            title={fullScreen ? '退出全屏' : '全屏'} 
            onClick={() => this.setFullScreen()}
          >
            <div className='icon'>
              <Icon style={{ fontSize: '18px' }} type={!fullScreen ? "quanpingx" : 'zuixiaohua-copy'} />
            </div>
          </div>
        )}
        <div className='tools'>
          { changeScale && (
              <div className="ik">
                <span onClick={this.setScale.bind(this, -0.1)}>
                  <Icon type='tianjia' /> 放大
                </span>
                <span onClick={() => this.setState({ scale: 1 })}>
                  <Icon type='yuanshidaxiao' /> 原始大小
                </span>
                <span onClick={this.setScale.bind(this, 0.1)}>
                  <Icon type='jianshao'/> 缩小
                </span>
              </div>
          )}
          { rolate && (
              <div className="ik">
                <span onClick={() => this.setRotate('anticlockwise')}>
                  <Icon type='tianjia' /> 向左
                </span>
                <span onClick={() => this.setRotate('reset')}>
                  <Icon type='yuanshidaxiao' /> 复位
                </span>
                <span onClick={() => this.setRotate('clockwise')}>
                  <Icon type='jianshao' /> 向右
                </span>
              </div>
            )
          }
          <div className='ik'>
            { downloadPic && (
              <span onClick={this.downloadPic.bind(this)}>
                <Icon type='yuanshidaxiao' /> 下载
              </span>
            )}
            { storageImg && (
              <span onClick={this.storageImg.bind(this)}>
                <Icon type='jianshao' /> 收藏
              </span>
            )}
          </div>
          { searchPic && (
            <div className='ik' onClick={this.handleSearchPic.bind(this)}>
              <span>
                <Icon type='jianshao' /> 以图搜图
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default view