import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import MakerPoints from '../../../components/Map/MapComponent/component/MakerPoints';
import PropTypes from 'prop-types';
import './index.scss';

@providerMap('map-point-label-layout')
export default class MapPointLabelView extends React.Component {
  static contextTypes = {
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.markerPoint = null;
  }
  componentDidUpdate() {
    this.markerPoint.removeAllMarker();
    this.createMarker(this.props.point);
  }
  componentWillUnmount() {
    this.markerPoint = null;
  }
  createMarker = point => {
    if (!point || !point.latitude || !point.longitude) {
      return false;
    }
    setTimeout(() => {
      this.markerPoint && this.markerPoint.createMarker(point);
      this.context.mapMethods.setFitView();
    }, 10);
  };
  initMarkerPoint = markerPoint => {
    const { point } = this.props;
    this.markerPoint = markerPoint;
    this.createMarker(point);
  };

  render() {
    return (
      <React.Fragment>
        <MakerPoints init={this.initMarkerPoint} />
      </React.Fragment>
    );
  }
}
