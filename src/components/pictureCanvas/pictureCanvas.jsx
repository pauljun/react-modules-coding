import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import FullScreenLayout from '../FullScreenLayout';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { downloadLocalImage, uuid } from '../../utils';
import {
  fullscreen,
  isFullscreen,
  exitFullscreen
} from '../../utils/FullScreen';
import AuthComponent from '../../view/BusinessComponent/AuthComponent/';
import { Rnd } from 'react-rnd';
import IconFont from '../../components/IconFont';
import other from 'src/service/RequestUrl/other';
import imgBase64 from './imgBase64';

let index = 0;
@withRouter
@BusinessProvider('UserStore', 'MediaLibStore', 'TabStore')
@observer
class view extends React.Component {
  constructor(props) {
    super(props);
    this.rndRef = React.createRef();
    this.randomClass = 'canvas-img-container-' + uuid();
  }
  state = {
    top: 0,
    left: 0,
    scale: 1,
    rotate: 0,
    fullScreen: false,
    key: Math.random(),
    imgUrl: this.props.url,
    isFull: false
    // position: {
    // 	x: 0,
    // 	y: 0
    // }
  };
  componentDidMount() {
    this.rndRef.current.updatePosition({ x: 0, y: 0 });
  }

  // 滚轮事件
  handleWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      this.setScale(e.deltaY / 1000);
    }
  };

  /**图片转base64 打水印*/
  async getImgurl() {
    let { UserStore } = this.props;
    let timeSamp = await UserStore.getSystemTime();
    imgBase64(
      this.props,
      moment(parseInt(timeSamp, 10)).format('YYYYMMDDTHHmmss'),
      imgUrl => {
        this.setState({ imgUrl });
      }
    );
  }

  /**缩放 */
  setScale(value) {
    let { scale } = this.state;
    if (value == 1) {
      this.setState({
        scale: 1
      });
      return;
    }
    scale -= value;
    message.destroy();
    if (scale < 0.4) {
      scale = 0.4;
    }
    if (scale > 3) {
      scale = 3;
    }
    this.setState({
      scale
    });
  }
  /**旋转 */
  setRotate(type) {
    if (type == 0) {
      this.setState({
        rotate: 0
      });
      this.rndRef.current.updatePosition({ x: 0, y: 0 });
    } else {
      this.setState({
        rotate: this.state.rotate + 90 * type
      });
    }
  }
  componentWillMount() {
    window.onresize = this.handle;
    this.getImgurl();
  }

  setBig() {
    const ele = document
      .querySelector('.ant-tabs-tabpane-active')
      .querySelector('.canvas-img-container');
    const isFull = isFullscreen();
    let fullScreen;
    if (isFull && isFull === ele) {
      exitFullscreen();
      fullScreen = false;
    } else {
      fullscreen(ele);
      fullScreen = true;
    }
    this.setState({ fullScreen });
  }

  // 下载
  downloadPic() {
    const { url, name, data = {} } = this.props;
    const time = data.captureTime || data.passTime;

    downloadLocalImage(
      url,
      `${name}_${moment(+time || time).format('YYYYMMDDTHHmmss')}`
    );
    let logInfo = {
      ...other.downLoadImgModule,
      description: `下载点位【${name}】 ${moment(+time).format('YYYY-MM-DD HH:mm:ss')}的图片`
    };
    GlobalStore.LoggerStore.save(logInfo);
  }
  handleKeyDown = e => {
    let isFull;
    if (index % 2 == 0) {
      index = index + 1;
      isFull = true;
    } else {
      index = index + 1;
      isFull = false;
    }
    this.setState({ isFull });
  };

  /**收藏 */
  storageImg() {
    let { url, data = {}, MediaLibStore } = this.props;
    const localImgObg = {
      cameraId: data.cameraId || data.deviceId,
      cameraName: data.cameraName || data.deviceName,
      captureTime: Number(data.captureTime || data.passTime),
      imgUrl: url,
      type: 'image'
    };
    MediaLibStore.add(localImgObg).then(() => {
      message.success('添加成功！');
    });
  }

  handle = () => {
    this.handleKeyDown();
    let { isFull } = this.state;
    this.setState({
      fullScreen: !isFull ? false : true
    });
  };

  handleSearchPic = type => {
    exitFullscreen();
    const item = this.props.data;
    const data = {
      type,
      id: item.id,
      model: 2
    };
    if (type === 'face') {
      data.model = 13;
    }
    this.jumpUrl(data, type);
  };
  /**人体人脸关联查询 */
  searchFaceBody = cType => {
    exitFullscreen();
    const item = this.props.data;
    const data = { type: cType };
    if (cType === 'body') {
      data.id = item.bodyId;
      data.model = 2;
    } else {
      data.id = item.faceId;
      data.model = 13;
    }
    this.jumpUrl(data, cType);
  };
  // 跳转以图搜图
  jumpUrl = data => {
    const { TabStore, history } = this.props;
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: 'imgSearch',
      history,
      state: data
    });
  };

  getPoint(obj) {
    //获取某元素以浏览器左上角为原点的坐标
    var t = obj.offsetTop; //获取该元素对应父容器的上边距
    var l = obj.offsetLeft; //对应父容器的上边距
    //判断是否有父容器，如果存在则累加其边距
    while ((obj = obj.offsetParent)) {
      //等效 obj = obj.offsetParent;while (obj != undefined)
      t += obj.offsetTop; //叠加父容器的上边距
      l += obj.offsetLeft; //叠加父容器的左边距
    }
    return { l, t };
  }

  render() {
    const defaultOperations = {
      download: true,
      storage: true
    };
    const { scale, rotate, key, imgUrl } = this.state;
    const { data, type, operations = defaultOperations } = this.props;
    let cType;
    if (type === 'face' || type === 'body') {
      cType = type === 'face' ? 'body' : 'face';
    }
    const relatedFlag = cType && data[cType + 'Id'];
    return (
      <div
        className={`canvas-img-container ${this.randomClass}`}
        onWheel={this.handleWheel}
      >
        <FullScreenLayout
          className="footer_window"
          getContainer={() => document.querySelector(`.${this.randomClass}`)}
        >
          {isFullscreen => (
            <IconFont
              title={!isFullscreen ? '全屏' : '退出全屏'}
              type={!isFullscreen ? 'icon-Full_Main' : 'icon-ExitFull_Main'}
              theme="outlined"
            />
          )}
        </FullScreenLayout>
        <Rnd
          ref={this.rndRef}
          key={key}
          // position={{ x: position.x, y: position.y }}
          // size={{ width: '100%', height: '100%' }}
          // onDrag={this.onDragHandle}
          default={{
            x: 0,
            y: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <img
            className="wrapper-img"
            onKeyDown={this.handlePressEsc}
            onDoubleClick={this.setBig.bind(this)}
            src={imgUrl}
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`
            }}
          />
        </Rnd>
        <div className="left-content-footer">
          <div className="footer_narrow">
            <div
              className={`narrow_left narrow ${
                scale == 0.4 ? 'narrow_disable' : ''
              }`}
              onClick={this.setScale.bind(this, 0.2)}
            >
              <IconFont type={'icon-ZoomOut_Main'} theme="outlined" />
              <p className="narrow_p">缩小</p>
            </div>

            <div
              className="narrow_center narrow"
              onClick={this.setScale.bind(this, 1)}
            >
              <IconFont type={'icon-ZoomDefault_Main'} theme="outlined" />
              <p className="narrow_p">原始大小</p>
            </div>

            <div
              className={`narrow_left narrow ${
                scale == 3 ? 'narrow_disable' : ''
              }`}
              onClick={this.setScale.bind(this, -0.2)}
            >
              <IconFont type={'icon-ZoomIn_Main'} theme="outlined" />
              <p className="narrow_p">放大</p>
            </div>
          </div>
          <div className="footer_rotate">
            <div
              className="rotate_left narrow"
              onClick={this.setRotate.bind(this, -1)}
            >
              <IconFont type={'icon-Left_Main'} theme="outlined" />
              <p className="narrow_p">向左</p>
            </div>

            <div
              className="rotate_center narrow"
              onClick={this.setRotate.bind(this, 0)}
            >
              <IconFont type={'icon-Middle_Main'} theme="outlined" />
              <p className="narrow_p">复位</p>
            </div>

            <div
              className="rotate_right narrow"
              onClick={this.setRotate.bind(this, 1)}
            >
              <IconFont type={'icon-Right_Main'} theme="outlined" />
              <p className="narrow_p">向右</p>
            </div>
          </div>

          <div className="footer_down">
            {operations.download && (
              <div
                className="down_left narrow"
                onClick={this.downloadPic.bind(this)}
              >
                <IconFont type={'icon-Download_Main'} theme="outlined" />
                <p className="narrow_p">下载</p>
              </div>
            )}
            {operations.storage && (
              <div
                className="down_right narrow"
                onClick={this.storageImg.bind(this)}
              >
                <IconFont type={'icon-Keep_Main'} theme="outlined" />
                <p className="narrow_p">收藏</p>
              </div>
            )}
          </div>
          {type && (
            <div className="footer_search">
              {/* 关联人体搜图 */}
              {type === 'face' &&
                relatedFlag && (
                  <AuthComponent actionName={'BaselibImgSearch'}>
                    <div
                      className={`search_left narrow ${
                        relatedFlag ? '' : 'narrow_disable'
                      }`}
                      onClick={e => this.searchFaceBody('body', e)}
                    >
                      <IconFont type={'icon-Body_Light'} theme="outlined" />
                      <p className="narrow_p">关联人体</p>
                    </div>
                  </AuthComponent>
                )}
              {/* 直接人脸搜图 */}
              {type === 'face' && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <div
                    className="search_right narrow"
                    onClick={() => this.handleSearchPic('face')}
                  >
                    <IconFont
                      type={'icon-ImageSearch_Light'}
                      theme="outlined"
                    />
                    <p className="narrow_p">以图搜图</p>
                  </div>
                </AuthComponent>
              )}
              {/* 关联人脸搜图 */}
              {type === 'body' &&
                relatedFlag && (
                  <AuthComponent actionName={'BaselibImgSearch'}>
                    <div
                      className={`search_left narrow ${
                        relatedFlag ? '' : 'narrow_disable'
                      }`}
                      onClick={e => this.searchFaceBody('face', e)}
                    >
                      <IconFont type={'icon-Face_Light'} theme="outlined" />
                      <p className="narrow_p">关联人脸</p>
                    </div>
                  </AuthComponent>
                )}
              {/* 直接人体以图搜图 */}
              {type === 'body' && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <div
                    className="search_right narrow"
                    onClick={() => this.handleSearchPic('body')}
                  >
                    <IconFont
                      type={'icon-ImageSearch_Light'}
                      theme="outlined"
                    />
                    <p className="narrow_p">以图搜图</p>
                  </div>
                </AuthComponent>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default view;
