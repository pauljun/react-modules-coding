import React from 'react';
import PropTypes from 'prop-types';
import IconFont from '../../../IconFont';
import { Popover } from 'antd';
import { errorBoundary } from '../../../../utils/Decorator';
import '../style/map-reset.scss';

@errorBoundary
export default class MapResetTools extends React.Component {
  static contextTypes = {
    mapMethods: PropTypes.object
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.init && this.props.init(this);
  }
  resetMap = () => {
    const { mapMethods } = this.context;
    mapMethods.resetMap();
  };
  mapZoom = zoom => {
    const { mapMethods } = this.context;
    mapMethods.setZoom(mapMethods.getZoom() + zoom);
  };
  render() {
    return (
      <div className="map-reset-tool">
        <Popover
          placement="left"
          content="复位"
          overlayClassName="map-rest-tools-popup"
        >
          <div className="map-reset map-tool-icon" onClick={this.resetMap}>
            <IconFont type="icon-Reduction_Dark" />
          </div>
        </Popover>
        <div className="map-zoom">
          <Popover
            placement="left"
            content="放大"
            overlayClassName="map-rest-tools-popup"
          >
            <div className="map-tool-icon" onClick={() => this.mapZoom(2)}>
              <IconFont type="icon-Zoom__Light" />
            </div>
          </Popover>
          <Popover
            placement="left"
            content="缩小"
            onClick={() => this.mapZoom(-2)}
            overlayClassName="map-rest-tools-popup"
          >
            <div className="map-tool-icon">
              <IconFont type="icon-Zoom_-_Light" />
            </div>
          </Popover>
        </div>
      </div>
    );
  }
}
