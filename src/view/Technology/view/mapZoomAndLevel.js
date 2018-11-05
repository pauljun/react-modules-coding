import React from 'react';
import MapLevelZoom from '../../BusinessComponent/MapLevelZoom';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

import '../style/map.scss';
@withRouter
@BusinessProvider('UserStore')
export default class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.init = false
    this.state = {
      zoom: 0,
      center: []
    };
  }
  initMap = (map) => {
    this.mapRef = map
  }
  mapChange = ({zoom, center}) => {
    this.setState({ zoom, center });
    this.props.mapChange && this.props.mapChange({zoom, center})
  };

  setMap = (info) => {
    if(!this.init && this.mapRef){
      this.init = true;
      this.mapRef.setMapZoomCenter(info)
    }
  }

  render() {
    const {zoomLevelCenter}=this.props
    if(zoomLevelCenter && zoomLevelCenter.zoom && zoomLevelCenter.center){
      this.setMap(zoomLevelCenter)
    }
    return (
      <React.Fragment>
        <div className="Map-view">
          <div className='map-info'>
            <span>
              放大级别：{this.state.zoom} &nbsp;&nbsp;&nbsp;
            </span>
            <span>
              {/* 地图中心点：{pageType&&pageType==='isAdd'? '请选择地图中心点':`[${this.state.center.lng},${this.state.center.lat}]`} */}
              地图中心点：{`[${this.state.center.lng},${this.state.center.lat}]`}
            </span>
          </div>
          <MapLevelZoom
            init={(map) => this.initMap(map)}
            zoomLevelCenter={zoomLevelCenter}
            mapChange={this.mapChange}
          />
        </div>
      </React.Fragment>
    );
  }
}
