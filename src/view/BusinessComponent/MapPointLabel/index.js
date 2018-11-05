import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import { Input, Icon, message } from 'antd';
import IconFont from '../../../components/IconFont';
import MakerPoints from '../../../components/Map/MapComponent/component/MakerPoints';
import MapSearch from '../../../components/Map/MapComponent/component/MapSearch';
import PropTypes from 'prop-types';
import './index.scss';

const Search = Input.Search;

@providerMap('map-point-label-layout')
export default class MapMarkerVideo extends React.Component {
  static contextTypes = {
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.init = false;
    this.markerPoint = null;
    this.mapSearch = null;
    this.canClickSet = false;
    this.state = {
      address: null,
      resultList: [],
      selectPoi: null,
      position: [],
      name: null
    };
  }

  componentDidUpdate() {
    if (!this.init) {
      this.init = true;
      const { mapMethods } = this.context;
      mapMethods.on('click', this.clickMap);
    }
  }

  clickMap = event => {
    if (this.canClickSet) {
      this.markerDrage(null, event, [event.lnglat.lng, event.lnglat.lat]);
    }
  };

  setClickPopint = () => {
    this.canClickSet = !this.canClickSet;
    this.forceUpdate();
  };
  /**点位搜索 */
  searchPois = address => {
    this.mapSearch
      .searchPoisForAddress(address)
      .then(resultList => {
        let { point } = this.props;
        let position = [resultList[0].location.lng, resultList[0].location.lat];
        point.longitude = position[0];
        point.latitude = position[1];
        this.createMarker(point);
        this.mapSearch.searchAddressForPosition(position).then(address => {
          this.setState({
            resultList,
            selectPoi: resultList[0],
            position,
            ...address
          });
          this.props.onChangePoint &&
            this.props.onChangePoint({ position, point, address });
        });
      })
      .catch(this.catchSearch);
  };

  selectPoiAction(item) {
    const { point } = this.props;
    let position = [item.location.lng, item.location.lat];
    point.longitude = position[0];
    point.latitude = position[1];
    this.createMarker(point);
    this.mapSearch.searchAddressForPosition(position).then(address => {
      this.setState({ address, selectPoi: item, position });
      this.props.onChangePoint &&
        this.props.onChangePoint({ position, point, ...address });
    });
  }
  /**点位拖拽 */
  markerDrage(data, event, position) {
    const { point } = this.props;
    point.longitude = position[0];
    point.latitude = position[1];
    this.createMarker(point);
    this.mapSearch
      .searchAddressForPosition(position)
      .then(address => {
        this.mapSearch.searchPoisForAddress(address.name).then(resultList => {
          this.setState({ resultList, position, address });
          this.props.onChangePoint &&
            this.props.onChangePoint({ position, point, ...address });
        });
      })
      .catch(this.catchSearch);
  }
  catchSearch = error => {
    console.log(error);
    message.warn('未知的位置！');
  };
  changeSearch = address => {
    this.searchPois(address, false);
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.point !== this.props.point) {
      this.setState({
        address: null,
        resultList: [],
        selectPoi: null,
        position: []
      });
      this.markerPoint.removeAllMarker();
      this.createMarker(nextProps.point);
    }
  }
  componentWillUnmount() {
    this.markerPoint = null;
  }
  createMarker = point => {
    if (!point || !point.latitude || !point.longitude) {
      return false;
    }
    setTimeout(() => {
      this.markerPoint.createMarker(point, {
        draggable: true,
        dragend: this.markerDrage.bind(this)
      });
      this.context.mapMethods.setFitView();
    }, 10);
  };
  initMarkerPoint = markerPoint => {
    const { point } = this.props;
    this.markerPoint = markerPoint;
    this.createMarker(point);
  };
  initMapSearch = mapSearch => {
    this.mapSearch = mapSearch;
  };

  render() {
    let { resultList, selectPoi } = this.state;
    return (
      <React.Fragment>
        <MakerPoints init={this.initMarkerPoint} />
        <MapSearch init={this.initMapSearch} />
        <span
          className={`set-point ${this.canClickSet ? 'open' : 'close'}`}
          title={`${this.canClickSet ? '关闭' : '开启'}点击获取点位`}
          onClick={this.setClickPopint}
        >
          <IconFont type="icon-Add_Light" />
        </span>
        <div className="searchLayer">
          <Search
            enterButton={true}
            placeholder="请输入位置"
            onSearch={this.changeSearch}
          />
          <div className="poisList">
            {resultList.length > 0 &&
              resultList.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    this.selectPoiAction(item);
                  }}
                  className="poiItem"
                >
                  <Icon style={{ fontSize: 12 }} type="environment-o" />
                  <span title={item.name} className="name">
                    {item.name}
                  </span>
                  {selectPoi && selectPoi.id === item.id ? (
                    <Icon
                      style={{ fontSize: 12, color: '#52c41a' }}
                      type="check-circle"
                      className="selectPoi"
                    />
                  ) : null}
                </div>
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
