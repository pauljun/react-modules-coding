import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd';
import PictureCanvas from './pictureCanvas'
import Player from '../H5Player/PlayerBox.jsx'

import './index.scss'

class ImgView extends React.Component {
  static create() {
    class Decorator extends React.Component {
      pictureViewer = Object.create({})
      static childContextTypes = {
        pictureViewer: PropTypes.object
      }
      getChildContext() {
        return {
          pictureViewer: this.pictureViewer
        }
      }
      render() {
        let WrapperComponent = this.getWrapperComponent()
        return (
          <WrapperComponent
            pictureViewer={this.pictureViewer}
            {...this.props}
          />
        )
      }
    }
    return WrappedComponent => {
      Decorator.prototype.getWrapperComponent = () => WrappedComponent;
      return Decorator
    }
  }
  state = {
    active:'img'
  }
  static contextTypes = {
    pictureViewer: PropTypes.object
  }

  onSearchPic = () => {
    return this.props.onSearchPic()
  }

  videoImgChange = (type) => {
    this.setState({active: type},() => {
      this.props.videoImgChange(type)
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.active !== nextProps.active) {
      this.setState({
        active:'img'
      })
    }
  }
  render() {
    // console.log(this.props.item,'item')
    let {
      downloadPic, //下载
      storageImg, //收藏
      changeScale, //缩放事件
      rolate, //旋转事件
      searchPic, //以图搜图
      fullBtn,//全屏事件
      url,
      imgVideoChange,
      item,
      fragment,
      videoEvents,
      file,
      type,
    } = this.props;
    item = item || {cameraName:'ss', captureTime: '13123213121',cameraId: '12131231'}
    return (
      <div className='picture-viewer-wrapper'>
        <div className="title">
          <span
            className={this.state.active ==='img' ? 'active' : ''}
            onClick={() => this.videoImgChange('img')}
          >
            <Icon type='shoucangtupian'/> 查看原图
          </span>
          <span
            onClick={() => this.videoImgChange('video')}
            className={this.state.active ==='video' ? 'active' : ''}
          >
            <Icon type='shishishipin' /> 查看视频
          </span>
        </div>
        <div className="container">
          {imgVideoChange ? (
            <PictureCanvas
              fullBtn={fullBtn}
              downloadPic={downloadPic}
              storageImg={storageImg}
              changeScale={changeScale}
              rolate={rolate}
              searchPic={searchPic}
              onSearchPic={this.onSearchPic}
              url={url}
              cameraInfo={{
                id: item.cameraId,
                name: item.cameraName,
                time: item.captureTime,
                points: []
              }}
              frame={[
                { points: item[type + 'Rect'] && item[type + 'Rect'].split(',')}
              ]}
            />
          ) : (
            <Player
              playerRef={player => {
                this.player = player
              }}
              watermark={window.__watermark__}
              title={{
                cameraName: item.cameraName,
                captureScreen: true,
                closeVideo: false
              }}
              isLiving={false}
              fragment={fragment}
              controls={{
                download: false,
                playMethod: false
              }}
              videoEvents={videoEvents}
              file={file}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ImgView