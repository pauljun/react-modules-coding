import React from 'react';
import PropTypes from 'prop-types';
import { errorBoundary } from '../../../../utils/Decorator';

@errorBoundary
export default class MapSearch extends React.Component {
  static contextTypes = {
    map: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.placeSearch = null;
    this.geocoder = null;
    this.initMapSearch();
  }
  componentWillUnmount() {
    this.placeSearch.clear();
    this.placeSearch = null;
    this.geocoder = null;
  }

  initMapSearch() {
    Promise.all([this.initPlaceSearch(), this.initGeocoder()]).then(res => {
      this.placeSearch = res[0];
      this.geocoder = res[1];
      this.props.init && this.props.init(this);
    });
  }
  initPlaceSearch() {
    return new Promise(resolve => {
      AMap.service('AMap.PlaceSearch', () => {
        let placeSearch = new AMap.PlaceSearch({
          pageSize: 100
        });
        resolve(placeSearch);
      });
    });
  }
  initGeocoder() {
    return new Promise(resolve => {
      AMap.service('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder({ city: '全国' });
        resolve(geocoder);
      });
    });
  }

  /**
   *根据地址搜索兴趣点
   * @param {string} address
   */
  searchPoisForAddress(address) {
    return new Promise((resolve, reject) => {
      this.placeSearch.search(address, (status, result) => {
        if (status === 'complete') {
          resolve(
            result.poiList &&
            result.poiList.hasOwnProperty('pois') &&
            Array.isArray(result.poiList.pois)
              ? result.poiList.pois
              : []
          );
        } else {
          reject({ status, result });
        }
      });
    });
  }
  /**
   * 根据经纬度查询详细位置
   * @param {Array<Number>} position
   */
  searchAddressForPosition(position) {
    return new Promise((resolve, reject) => {
      this.geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const { formattedAddress, addressComponent } = result.regeocode;
          const {
            province = '',
            city = '',
            district = '',
            township = '',
            street = '',
            streetNumber = ''
          } = addressComponent;
          const address =
            province + city + district + township + street + streetNumber;
          resolve({
            address,
            name: formattedAddress,
            result
          });
        } else {
          reject({ status, result });
        }
      });
    });
  }
  render() {
    return null;
  }
}
