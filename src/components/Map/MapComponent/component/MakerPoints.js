import React from 'react';
import PropTypes from 'prop-types';
import { createMarker } from '../factory/MapFactory';
import { errorBoundary } from '../../../../utils/Decorator';

@errorBoundary
export default class MakerPoints extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.markers = {};
  }
  componentDidMount() {
    this.props.init && this.props.init(this);
  }

  componentWillUnmount() {
    Object.keys(this.markers).map(id => {
      this.removeMarker(id);
    });
    this.markers = null;
  }

  /**
   * 创建marker
   * @param {string} id
   * @param {Object} points
   * @param {Object} options
   */
  createMarker(point, options, active, icon = false) {
    this.removeMarker(point.id);
    let marker = createMarker(point, options, icon, active);
    this.markers[point.id] = marker;
    marker.setMap(this.context.map);
    return marker;
  }
  /**
   * 创建markers
   * @param {Object} points
   * @param {Object} options
   */
  createMarkers(points, options) {
    return points.map(item => this.createMarker(item, options));
  }

  /**
   * 删除marker
   * @param {*} id
   */
  removeMarker(id) {
    if (this.markers[id]) {
      this.context.mapMethods.removerOverlayers(this.markers[id]);
      delete this.markers[id];
    }
  }

  /**
   * 删除所有markers
   *
   */
  removeAllMarker() {
    Object.keys(this.markers).map(id => this.removeMarker(id));
  }

  /**
   * 获取地图的Marker对象
   * @param {} id
   */
  getMarkerForId(id) {
    return this.MarkerMap[id] ? this.MarkerMap[id] : null;
  }

  /**
   * 设置marker content zindex
   * @param {string} id
   * @param {number} num
   */
  setMarkerZindex(id, num) {
    this.getMarkerForId(id).setZindex(num);
  }

  render() {
    return null;
  }
}
