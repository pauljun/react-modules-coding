import React from 'react';
import PropTypes from 'prop-types';
import ClusterTools from '../tools/ClusterTools';
import { IbsAMapCustomStyles } from '../../config';
import { errorBoundary } from '../../../../utils/Decorator';

@errorBoundary
export default class ClusterMarker extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.ClusterTools = new ClusterTools();
    this.clusterLayer = null;
  }
  componentWillMount() {
    this.props.init && this.props.init(this);
  }
  componentDidMount() {
    this.createClusterLayer(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { points = [], options = {} } = nextProps;
    this.ClusterTools.updatePoints(points, options, this.clusterLayer);
  }
  componentWillUnmount() {
    this.clearMarkers();
    this.ClusterTools = null;
    this.context.mapMethods.removerOverlayers(this.clusterLayer);
    this.clusterLayer = null;
  }
  createClusterLayer(props) {
    const { points = [], options = {} } = props;
    const { map } = this.context;
    //TODO 数据交给ClusterTools管理
    this.ClusterTools.setPointsAndCreateMarks(points, options);
    let markersList = this.ClusterTools.getAllMarkers();
    //TODO 创建图层
    AMap.plugin('AMap.MarkerClusterer', () => {
      this.clusterLayer = new AMap.MarkerClusterer(map, markersList, {
        styles: IbsAMapCustomStyles,
        minClusterSize: 0,
        gridSize: 20,
        maxZoom: 17,
        averageCenter: false
      });
      if (options.clusterclick) {
        this.clusterLayer.on('click', function(e) {
          options.clusterclick(e);
        });
      }
    });
  }
  clearMarkers() {
    this.clusterLayer.clearMarkers();
    this.ClusterTools.clearMarkers();
  }
  getAllPoints() {
    return this.ClusterTools.getAllPoints();
  }

  showCustomMarker(types, status) {
    types = types.map(v => v * 1);
    status = status.map(v => v * 1);
    let AllMarkers = this.ClusterTools.getAllMarkers();
    this.clusterLayer.clearMarkers();
    let markers = AllMarkers.filter(item => {
      const info = item.getExtData();
      return (
        types.indexOf(info.type * 1) > -1 &&
        status.indexOf(info.status * 1) > -1
      );
    });
    this.clusterLayer.addMarkers(markers);
  }

  hideOrHideClusterMarkerForType(type, isShow) {
    let AllMarkers = this.ClusterTools.getAllMarkers();
    let markers = AllMarkers.filter(
      item => item.getExtData().type * 1 === type * 1
    );
    isShow
      ? this.clusterLayer.addMarkers(markers)
      : this.clusterLayer.removeMarkers(markers);
  }

  hideOrHideClusterMarkerForStatus(status, isShow) {
    let AllMarkers = this.ClusterTools.getAllMarkers();
    let markers = [];
    if (status * 1 === 0) {
      markers = AllMarkers.filter(
        item => item.getExtData().status * 1 === status * 1
      );
    } else {
      markers = AllMarkers.filter(item => item.getExtData().status * 1 === 1);
    }
    isShow
      ? this.clusterLayer.addMarkers(markers)
      : this.clusterLayer.removeMarkers(markers);
  }

  render() {
    return null;
  }
}
