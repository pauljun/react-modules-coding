import React from 'react';
import PropTypes from 'prop-types';
import { differenceWith } from 'lodash';

export default class CommunityPolygon extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.polygons = [];
    this.villages = [];
  }

  componentDidMount() {
    const { villages, options = {} } = this.props;
    const { mapMethods } = this.context;
    this.createPolygons(villages, options);
    mapMethods.addOverlayers(this.polygons.filter(v => !!v));
  }

  componentWillReceiveProps(nextProps) {
    const { villages, options = {} } = nextProps;
    const { mapMethods } = this.context;
    this.computedVillages(villages)
      .then(diffArr => {
        console.warn('小区数据变化 -> 变化数据：', diffArr);
        this.clearPolygons();
        this.createPolygons(villages, options);
        mapMethods.addOverlayers(this.polygons.filter(v => !!v));
      })
      .catch(() => console.warn('小区数据无变化！'));
  }
  componentWillUnmount() {
    this.clearPolygons();
    setTimeout(() => {
      this.villages = null;
      this.polygons = null;
    }, 10);
  }

  computedVillages(villages) {
    return new Promise((resolve, reject) => {
      let diffArr = differenceWith(villages, this.villages, function(
        newValue,
        oldView
      ) {
        let flag = true;
        if (newValue.id !== oldView.id) {
          flag = false;
        }
        return flag;
      });
      if (diffArr.length > 0) {
        resolve(diffArr);
      } else {
        reject();
      }
    });
  }

  clearPolygons() {
    const { mapMethods } = this.context;
    mapMethods.removerOverlayers(this.polygons);
    this.villages = [];
    this.polygons = [];
  }
  createPolygon(valigeInfo, options = {}) {
    let path;
    try {
      path = JSON.parse(valigeInfo.rangeCoordinates);
    } catch (e) {
      console.warn('格式化小区边界出错', valigeInfo.rangeCoordinates);
    }
    if (!path) {
      return false;
    }
    let polygon = new AMap.Polygon({
      zIndex: options.zIndex || 100,
      strokeWeight: options.strokeWeight || 2,
      path,
      fillOpacity: options.fillOpacity || 0.1,
      fillColor: options.fillColor || '#44AAFF',
      strokeColor: options.strokeColor || '#2299FF',
      strokeStyle:options.strokeStyle || 'dashed'
    });
    polygon.setExtData({
      id: valigeInfo.id,
      center: this.getCenterPoint(path)
    });
    polygon.on('mouseover', () => {
      polygon.setOptions({
        fillOpacity: 0.3
      });
    });

    polygon.on('click', event => {
      options.click && options.click(event, polygon);
    });

    polygon.on('mouseout', () => {
      polygon.setOptions({
        fillOpacity: 0.1
      });
    });
    return polygon;
  }

  jumpCommunity(id) {
    const { mapMethods } = this.context;
    let polygon = this.polygons.filter(v => {
      let info = v ? v.getExtData() : {};
      return info.id === id;
    })[0];
    if (polygon) {
      const data = polygon.getExtData();
      mapMethods.setZoomAndCenter(17, data.center);
    }
  }

  createPolygons(villages, options) {
    let polygons = villages
      .map(item => this.createPolygon(item, options))
      .filter(v => !!v);
    this.villages = villages;
    this.polygons = polygons;
  }

  // 计算polygon的质心
  getCenterPoint(points) {
    let sum_x = 0;
    let sum_y = 0;
    let sum_area = 0;
    let p1 = points[1];
    for (let i = 2; i < points.length; i++) {
      let p2 = points[i];
      let area = this._getThreePointArea(points[0], p1, p2);
      sum_area += area;
      sum_x += (points[0].lng + p1.lng + p2.lng) * area;
      sum_y += (points[0].lat + p1.lat + p2.lat) * area;
      p1 = p2;
    }
    let xx = sum_x / sum_area / 3;
    let yy = sum_y / sum_area / 3;
    return new AMap.LngLat(xx, yy);
  }

  _getThreePointArea(p0, p1, p2) {
    let area = 0.0;
    area =
      p0.lng * p1.lat +
      p1.lng * p2.lat +
      p2.lng * p0.lat -
      p1.lng * p0.lat -
      p2.lng * p1.lat -
      p0.lng * p2.lat;
    return area / 2;
  }
  render() {
    return null;
  }
}
