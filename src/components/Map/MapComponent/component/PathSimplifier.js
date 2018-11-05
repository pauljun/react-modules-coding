import React from 'react';
import PropTypes from 'prop-types';
import MakerPoints from './MakerPoints';
import InfoWindow from './InfoWindow';
import { errorBoundary } from '../../../../utils/Decorator';
import IconFont from '../../../../components/IconFont';
import { Divider, Switch } from 'antd';
import '../style/map-path-tools.scss';

@errorBoundary
export default class PathSimplifier extends React.Component {
  static contextTypes = {
    map: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.pathSimplifier = null;
    this.pathNavigator = null;
    this.data = [];
    this.pointIndex = -1;
    this.MakerPoints = React.createRef();
    this.timer = 0;
    this.state = {
      center: [0, 0],
      visible: true,
      status: 'resume' //'resume' : 'pause'
    };
  }
  initWinInfo = () => {
    if (!this.pathSimplifier) {
      this.initPathSimplifier(() => {
        this.props.init && this.props.init(this);
        this.data.length > 0 && this.createMarkers();
      });
    }
  };
  componentWillUnmount() {
    clearTimeout(this.timer);

    this.clearPathNavigators();
    this.pathSimplifier = null;
    this.pathNavigator = null;
    this.data = null;
    this.pointIndex = null;
    this.timer = null;
  }

  createMarkers() {
    if (this.MakerPoints.current) {
      this.MakerPoints.current.createMarkers(
        this.data.map(v => v.cameraInfoStore)
      );
    }
  }
  initPathSimplifier(callback) {
    const { map } = this.context;
    AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
      this.pathSimplifier = new PathSimplifier(this.createOptions(map));
      callback && callback();
    });
  }
  createOptions = map => {
    return {
      map,
      zIndex: 101,
      clickToSelectPath: false,
      renderOptions: {
        eventSupport: false,
        eventSupportInvisible: false,
        pathTolerance: 0,
        //轨迹线的样式
        pathLineStyle: {
          strokeStyle: '#f7a319',
          lineWidth: 6,
          dirArrowStyle: true,
          eventSupportInvisible: false
        },
        pathLineHoverStyle: {
          strokeStyle: 'orange',
          lineWidth: 6,
          dirArrowStyle: true,
          eventSupportInvisible: false
        }
      },
      getPath: function(pathData, pathIndex) {
        //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
        return pathData.path;
      },
      getHoverTitle() {
        return false;
      }
    };
  };
  setDataInfo(data) {
    this.data = data.filter(v => v.longitude && v.latitide);
    for (let i = 0, l = this.data.length; i < l; i++) {
      let item = this.data[i];
      item.cameraInfoStore = window.GlobalStore.DeviceStore.queryCameraById(
        item.cameraId
      );
    }
    this.data.length > 0 && this.createMarkers();
  }

  setData(arr) {
    this.setDataInfo(arr);
    const data = this.data.map(v => [
      v.cameraInfoStore.longitude,
      v.cameraInfoStore.latitude
    ]);
    this.pathSimplifier.setData([{ path: data }]);
    this.createStart();
  }

  clearPathNavigators() {
    if (this.pathNavigator) {
      this.pathNavigator.off('move', this.moveAction);
      this.pathNavigator.off('pause', this.stopAction);
      this.pathNavigator.destroy();
    }
    this.pathSimplifier && this.pathSimplifier.clearPathNavigators();
  }
  createStart() {
    //创建一个巡航器
    this.pointIndex = -1;
    this.pathNavigator = this.pathSimplifier.createPathNavigator(0, {
      loop: false,
      speed: 10
    });
    this.pathNavigator.on('move', this.moveAction);
    this.pathNavigator.on('pause', this.stopAction);
    this.pathNavigator.start();
    this.setState({ status: 'resume' });
  }
  moveAction = event => {
    const { idx } = event.target.getCursor();
    if (idx !== this.pointIndex) {
      this.pointIndex = idx;
      const current = this.data[this.pointIndex];
      const next = this.data[this.pointIndex + 1];
      if (current && next) {
        const dis = AMap.GeometryUtil.distance(
          [current.cameraInfoStore.longitude, current.cameraInfoStore.latitude],
          [next.cameraInfoStore.longitude, next.cameraInfoStore.latitude]
        );
        dis > 10 && event.target.setSpeed(dis / 3 / (1000 / 3600));
      }
      setTimeout(() => {
        this.setState({
          center: [
            current.cameraInfoStore.longitude,
            current.cameraInfoStore.latitude
          ]
        });
        this.setCurrentPoint(current);
      }, 10);
      this.props.changePointIndex &&
        this.props.changePointIndex(this.pointIndex, current);
    }
  };
  stopAction = event => {
    this.createMarkers();
    this.setState({ status: 'repeat' });
  };
  setCurrentPoint(item) {
    clearTimeout(this.timer);
    this.createMarkers();
    this.timer = setTimeout(() => {
      this.MakerPoints.current.createMarker(item.cameraInfoStore, {}, true);
    }, 100);
  }
  hide() {}
  show() {}
  changeIndex = index => {
    clearTimeout(this.timer);
    this.pathNavigator.pause();
    this.setState({ status: 'pause' });
    const current = this.data[index];
    setTimeout(() => {
      this.setState({
        center: [
          current.cameraInfoStore.longitude,
          current.cameraInfoStore.latitude
        ]
      });
      this.setCurrentPoint(current);
    }, 10);
  };
  navClk(status) {
    const currentStatus = this.pathNavigator.getNaviStatus();
    if (status === 'repeat' || status === 'stop') {
      this.pathNavigator.start();
      this.setState({ status: 'resume' });
      return false;
    }
    if (currentStatus === 'moving') {
      this.pathNavigator.pause();
      this.setState({ status: 'pause' });
      return false;
    }
    if (currentStatus === 'pause') {
      this.pathNavigator.resume();
      this.setState({ status: 'resume' });
      return false;
    }
  }
  prev() {
    if (this.pointIndex > 0) {
      this.pathNavigator.moveToPoint(this.pointIndex - 1, 1);
    }
  }
  next() {
    if (this.pointIndex < this.data.length) {
      this.pathNavigator.moveToPoint(this.pointIndex + 1, 1);
    }
  }
  onCheck(flag) {
    this.setState({ visible: flag });
  }
  render() {
    const { center, status, visible } = this.state;
    const { content } = this.props;
    const isMove = status === 'resume';
    return (
      <React.Fragment>
        <MakerPoints ref={this.MakerPoints} />
        {visible && (
          <InfoWindow
            init={this.initWinInfo}
            center={center}
            content={content}
            visible={visible}
            notMove={true}
          />
        )}
        <div className="map-path-tools">
          <div
            className="tool-item"
            onClick={this.navClk.bind(this, isMove ? 'pause' : status)}
          >
            <IconFont
              type={!isMove ? 'icon-Play_Main' : 'icon-Pause_Main'}
              title={!isMove ? '开始' : '暂停'}
            />
          </div>

          <div className="tool-item" onClick={this.navClk.bind(this, 'repeat')}>
            <IconFont type={'icon-Reset_Dark'} title="复位" />
          </div>

          <div className="tool-item" onClick={this.prev.bind(this)}>
            <IconFont type={'icon-Forward_Main'} title="上一个" />
          </div>
          <div className="tool-item next-btn" onClick={this.next.bind(this)}>
            <IconFont type={'icon-Backward_Main'} title="下一个" />
          </div>
          <div className="tool-item">
            <Switch
              checked={visible}
              onChange={this.onCheck.bind(this)}
              title={`${visible ? '关闭' : '开启'}图片`}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
