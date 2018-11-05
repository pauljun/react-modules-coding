import React from 'react';
import ResidenceTime from './residenceTime';
import MapComponent from 'src/components/Map/MapComponent';
import PathSimplifier from 'src/components/Map/MapComponent/component/PathSimplifier';
import { BusinessProvider } from '../../../../utils/Decorator/BusinessProvider';
import moment from 'moment';

import './residenceTimeMap.scss';

@BusinessProvider('CommunityEntryStore')
class ResidenceTimeMap extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      PathCurrent: {}
    };
    this.Map = null;
    this.walking = null;
    this.pathing = null;
  }
  getTrajectory = (faceList = []) => {
    // let points = [];
    // faceList.map((v) => {
    //   if(v.longitude && v.latitide) {
    //     points.unshift([+v.longitude, +v.latitide]);
    //   }
    // })
    if(faceList.length < 1) {
      return 
    }
    // this.walking.computedPointsPaths(faceList).then((res) => {
      this.pathing.setData(faceList);
    // });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.faceList !== this.props.faceList) {
      this.getTrajectory(nextProps.faceList);
    }
  }
  initMap = (Map) => {
    this.Map = Map;
	};
	walkInit = (walking) => {
		this.walking = walking;
	};
	PathInit = (pathing) => {
		this.pathing = pathing;
  };
  changePointIndex = (index, current) => {
		this.setState({
			PathCurrent: current
		})
	}

  render() {
    let { faceList } = this.props;
    let { PathCurrent } = this.state;
    let content = <div className="content_card">
    <div className="card_img_box">
      <img className="content_img" src={PathCurrent.facePath} alt=""/>
    </div>
    <p className="card_value">{PathCurrent.cameraName}</p>
    <p className="card_value">{PathCurrent.captureTime && moment(+PathCurrent.captureTime).format('YYYY.MM.DD HH:mm:ss')}</p>
</div>
    return (
      <div className="residence_time_map">
        <ResidenceTime faceList={faceList}/>
        <div className="residence_map">
        <MapComponent initMap={this.initMap}>
					<PathSimplifier init={this.PathInit} changePointIndex={this.changePointIndex} content={content} />
				</MapComponent>
        </div>
      </div>
    )
  }
}

export default ResidenceTimeMap;
