import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import MakerPoints from '../../../components/Map/MapComponent/component/MakerPoints';
import { uuid } from '../../../utils';
import PropTypes from 'prop-types';
import centerImage from '../../../assets/img/MapCenter.svg';
import './index.scss';

const id = uuid();

@providerMap('map-zoom-center-layout')
export default class MapPointLabelView extends React.Component {
  static contextTypes = {
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.markerLayout = React.createRef();
  }
  componentDidMount() {
    this.props.init && this.props.init(this);
    setTimeout(() => {
      const { mapMethods } = this.context;
      this.mapChange();
      mapMethods.on('zoomchange', this.mapChange);
      mapMethods.on('moveend', this.mapChange);
    }, 100);
  }
  componentWillUnmount() {
    const { mapMethods } = this.context;
    this.markerLayout = null;
    mapMethods.off('zoomchange', this.mapChange);
    mapMethods.off('moveend', this.mapChange);
  }
  mapChange = () => {
    const { mapMethods } = this.context;
    const info = mapMethods.getZoomAndCenter();
    this.markerLayout.current.createMarker(
      {
        id,
        longitude: info.center.lng,
        latitude: info.center.lat,
        deviceName: '当前中心点'
      },
      {
        w: 28,
        h: 40,
        offset: [-14, -20],
        draggable: true,
        dragend: (point, event, position) => {
          mapMethods.setCenter(position);
        }
      },
      false,
      centerImage
    );
    this.props.mapChange && this.props.mapChange(info);
  };
  setMapZoomCenter = info => {
    const { mapMethods } = this.context;
    mapMethods.setZoomAndCenter(info.zoom, info.center);
  };
  render() {
    return <MakerPoints ref={this.markerLayout} />;
  }
}
