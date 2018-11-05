import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import ClusterMarker from '../../../components/Map/MapComponent/component/ClusterMarker';
import MouseTool from '../../../components/Map/MapComponent/component/MouseTool';
import DrawTools from './DrawTools';
import { inject } from 'mobx-react';
import DeviceList from '../DeviceList';
import PropTypes from 'prop-types';
import ReT from '../../../components/Map/MapComponent/component/MapResetTools';
import './index.scss';

@inject('DeviceStore')
@providerMap('map-select-layout')
export default class MapMarkerVideo extends React.Component {
  static contextTypes = {
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.clusterMarker = null;
    this.mouseTool = null;
    this.cursor = null;
  }
  componentWillUnmount() {
    this.clusterMarker = null;
    this.mouseTool = null;
    this.cursor = null;
  }
  initClusterMarker = clusterMarker => {
    this.clusterMarker = clusterMarker;
    this.forceUpdate();
  };

  initMouseTools = mouseTool => {
    this.mouseTool = mouseTool;
  };

  startDrawRect() {
    const { mapMethods } = this.context;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.rectangle();
  }
  startDrawCircle() {
    const { mapMethods } = this.context;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.circle();
  }
  startDrawPolygon() {
    const { mapMethods } = this.context;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.polygon();
  }

  drawEnd = (path, isCircle) => {
    const { mapMethods } = this.context;
    const { selectList = [] } = this.props;
    const allPoints = this.clusterMarker.getAllPoints();
    this.mouseTool.close();
    mapMethods.setDefaultCursor(this.cursor);
    let points = [];
    if (isCircle) {
      points = mapMethods.computedPointsInCircle(
        allPoints,
        path.center,
        path.radius
      );
    } else {
      points = mapMethods.computedPointsInArea(allPoints, path);
    }

    const list = [...new Set([...points, ...selectList])];
    this.props.onSelect && this.props.onSelect(list);
  };

  clearDraw = () => {
    this.mouseTool.close(true);
    this.props.onSelect && this.props.onSelect([]);
  };

  render() {
    const {
      DeviceStore,
      selectList = [],
      deleteDeviceItem,
      points,
      isShowList,
      hideOther = false
    } = this.props;
    return (
      <React.Fragment>
        <ClusterMarker
          points={points ? points : DeviceStore.deviceArray}
          init={this.initClusterMarker}
        />
        {!hideOther && (
          <DrawTools
            startDrawRect={this.startDrawRect.bind(this)}
            startDrawCircle={this.startDrawCircle.bind(this)}
            startDrawPolygon={this.startDrawPolygon.bind(this)}
            clearDraw={this.clearDraw}
          />
        )}
        {!hideOther && (
          <MouseTool init={this.initMouseTools} drawEnd={this.drawEnd} />
        )}
        {(selectList.length > 0 || isShowList) && (
          <DeviceList
            deleteDeviceItem={deleteDeviceItem}
            clearSelect={this.clearDraw}
            deviceList={selectList}
            checkable={false}
            title={`已选摄像机(${selectList.length}个)`}
          />
        )}
        <ReT />
      </React.Fragment>
    );
  }
}
