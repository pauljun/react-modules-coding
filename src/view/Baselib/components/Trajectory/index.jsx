import React from 'react';
import moment from 'moment';
import MapComponent from '../../../../components/Map/MapComponent';
import PathSimplifier from '../../../../components/Map/MapComponent/component/PathSimplifier';
import ListView from './ListView';
import './index.scss';

class view extends React.Component {
  constructor() {
    super();
    this.list = [];
    this.mapPath = null;
    this.state = {
      idx: 0
    };
  }

  changeIdx = idx => {
    this.setState({ idx });
  };
  initPath = path => {
    this.mapPath = path;
    this.mapPath.setData(this.list);
  };
  changePointIndex = index => {
    this.setState({ idx: index });
    this.mapPath.changeIndex(index);
  };
  componentWillMount() {
    this.list = this.props.list;
    this.list = this.list.sort((a, b) => a.captureTime - b.captureTime);
  }

  render() {
    let list = this.list;
    const { idx } = this.state;
    const data = this.list[idx];
    return (
      <div className="trajectory-map">
        <MapComponent initMap={this.init} className="trajectory-map-box">
          <PathSimplifier
            init={this.initPath}
            changePointIndex={this.changeIdx}
            content={
              <div className="trajectory-list-li">
                <img src={data[`${this.props.type}Path`]} />
                <div>{data.cameraName}</div>
                <div className="time">
                  {moment(parseFloat(data.captureTime)).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </div>
              </div>
            }
          />
        </MapComponent>
        <ListView
          idx={idx}
          list={list}
          changeIdx={this.changePointIndex}
          type={this.props.type}
        />
      </div>
    );
  }
}

export default view;
