import { AMapConfig } from './config';

export default class Map {
  constructor(id, mapConfig) {
    this.init(id, mapConfig);
  }

  /**
   * 初始化地图
   * @param {string} id
   * @param {object} mapConfig
   */
  init(id, mapConfig) {
    const config = mapConfig || {};
    this.config = {
      ...AMapConfig,
      ...config
    };
    this.map = new window.AMap.Map(id, this.config);
  }

  /**
   * 地图皮肤
   * @param {string} name
   */
  setMapStyle(name) {
    this.map.setMapStyle(name);
  }

  /**
   * 计算当前坐标是否在可视区
   * @param {*} position
   */
  computedPointInWindow(position) {
    let info = this.getBounds();
    return (
      position.latitude >= info.minLat &&
      position.latitude <= info.maxLat &&
      position.longitude >= info.minLng &&
      position.longitude <= info.maxLng
    );
  }

  /**
   * 删除地图覆盖物数组，数组为一个或多个覆盖物
   * @param {*} overlayers
   */
  removerOverlayers(overlayers) {
    this.map.remove(overlayers);
  }

  /**
   * 添加地图覆盖物数组，数组为一个或多个覆盖物。
   * @param {*} overlayers
   */
  addOverlayers(overlayers) {
    this.map.add(overlayers);
  }

  /**
   * 绑定事件
   * @param {string} eventName
   * @param {function} callBack
   */
  on(eventName, callBack, context) {
    this.map.on(eventName, callBack, context);
  }

  /**
   * 解绑事件
   * @param {string} eventName
   * @param {function} callBack
   */
  off(eventName, callBack, context) {
    this.map.off(eventName, callBack, context);
  }

  /**
   * 获取地图缩放级别
   */
  getZoom() {
    return this.map.getZoom();
  }

  /**
   * 设置地图缩放级别
   */
  setZoom(level) {
    this.map.setZoom(level);
  }

  /**
   * 获取中心点
   */
  setCenter(lnglat) {
    this.map.setCenter(lnglat);
  }

  getCenter() {
    return this.map.getCenter();
  }

  /**
   * 获取中心点和缩放级别
   */
  getZoomAndCenter() {
    return { zoom: this.map.getZoom(), center: this.map.getCenter() };
  }

  /**
   * 缩放地图同时设置中心点
   * @param {Number} zoom
   * @param {Array<Number>} lnglat
   */
  setZoomAndCenter(zoom, lnglat) {
    this.map.setZoomAndCenter(zoom, lnglat);
  }

  /**
   * 设置地图手势
   * @param {string} cursor
   */
  setDefaultCursor(cursor) {
    this.map.setDefaultCursor(cursor);
  }

  /**
   * 显示地图手势
   */
  getDefaultCursor(flag) {
    if (flag) {
      return this.map.getDefaultCursor();
    }
    return 'url(http://webapi.amap.com/theme/v1.3/openhand.cur),default';
  }

  /**
   * 设置地图自适应
   */
  setFitView() {
    this.map.setFitView();
  }

  /**
   * 计算区域的点位
   */
  computedPointsInArea(list, area) {
    return list.filter(v => {
      return AMap.GeometryUtil.isPointInRing([v.longitude, v.latitude], area);
    });
  }

  /**
   * 计算元是否在区域类
   */
  computedPointsInCircle(list, center, radius) {
    let circle = new AMap.Circle({ center, radius });
    return list.filter(v => {
      return circle.contains([v.longitude, v.latitude]);
    });
  }

  /**
   * 平面地图像素坐标转换为地图经纬度坐标
   * @param {*} pixel
   * @param {*} level
   */
  pixelToLngLat(pixel, level) {
    return this.map.pixelToLngLat(pixel, level);
  }

  /**
   * 地图经纬度坐标转换为平面地图像素坐标
   */
  lnglatToPixel(lngLat, level) {
    return this.map.lnglatToPixel(lngLat, level);
  }

  /**
   * 地图容器像素坐标转为地图经纬度坐标
   * @param {*} pixel
   */
  containerToLngLat(pixel) {
    return this.map.containerToLngLat(pixel);
  }

  /**
   * 地图经纬度坐标转为地图容器像素坐标
   */
  lngLatToContainer(lngLat) {
    return this.map.lngLatToContainer(lngLat);
  }

  /**
   * 获取当前地图视图范围，获取当前可视区域
   */
  getBounds() {
    return this.map.getBounds();
  }

  /**
   * 销毁地图
   */
  destroy() {
    this.map.clearMap();
    this.map.destroy();
  }
}
