import React from 'react';
import MapTools from '../components/mapTools';
import MouseTool from '../../../components/Map/MapComponent/component/MouseTool';
import PropTypes from 'prop-types';
import DeviceCheckList from '../components/DeviceCheckList';

export default class VideoSurveillanceMapView extends React.Component {
  static contextTypes = {
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.mapView = React.createRef();
    this.cursor = null;
    this.state = {
      mapSelectPoints: []
    };
  }
  initMouseTools(mouseTool) {
    this.mouseTool = mouseTool;
  }
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

  drawEnd(path, isCircle) {
    const { mapMethods } = this.context;
    const { clusterMarker } = this.props;
    const allPoints = clusterMarker.getAllPoints();
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
    const list = [
      ...new Set([...points, ...this.state.mapSelectPoints])
    ];
    this.setState({ mapSelectPoints: list });
  }
  clearDraw() {
    this.mouseTool.close(true);
    this.setState({ mapSelectPoints: [] });
  }
  deleteDeviceItem(item) {
    const { mapSelectPoints } = this.state;
    let index = mapSelectPoints.findIndex(v => v.id === item.id);
    index > -1 && mapSelectPoints.splice(index, 1);
    this.setState({ mapSelectPoints });
  }
  render() {
    const { mapSelectPoints } = this.state;
    return (
      <React.Fragment>
        <MapTools
          clearDraw={this.clearDraw.bind(this)}
          clusterMarker={this.props.clusterMarker}
          startDrawRect={this.startDrawRect.bind(this)}
          startDrawCircle={this.startDrawCircle.bind(this)}
          startDrawPolygon={this.startDrawPolygon.bind(this)}
        />
        <MouseTool
          init={mouseTool => this.initMouseTools(mouseTool)}
          drawEnd={(path, isCircle) => this.drawEnd(path, isCircle)}
        />
        {mapSelectPoints.length > 0 && (
          <DeviceCheckList
            onSelectDevice={this.props.onSelectDevice}
            clearSelect={this.clearDraw.bind(this)}
            deviceList={mapSelectPoints}
            deleteDeviceItem={this.deleteDeviceItem.bind(this)}
            className="map-select-dvice"
          />
        )}
      </React.Fragment>
    );
  }
}
