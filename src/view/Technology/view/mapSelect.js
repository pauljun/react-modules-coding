import React from 'react';
import MapSelect from '../../BusinessComponent/MapSelect/ModalMapSelect';
import OrgSelectModal from '../../BusinessComponent/OrgSelectDevice/OrgSelectModal';
import { Button, Slider } from 'antd';
import CustomSlider from 'src/components/Player/component/CustomSlider';

import '../style/map.scss';

export default class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setSpeed = (value) => {
    console.log(value)
  }
  render() {
    return (
      <React.Fragment>
        <div className="Map-view">
          <Button onClick={() => this.setState({ mapVisible: true })}>设备选择-地图</Button>
          <Button onClick={() => this.setState({ orgVisible: true })}>设备选择-组织</Button>
          <MapSelect
            title={'抓拍点位'}
            onOk={list => console.log(list)}
            onCancel={() => this.setState({ mapVisible: false })}
            visible={this.state.mapVisible}
          />
          <OrgSelectModal 
            title='抓拍点位'
            visible={this.state.orgVisible}
            onOk={list => console.log(list)}
            onCancel={() => this.setState({ orgVisible: false })} 
            defauleSelectList={[]} 
          />
        </div>
      </React.Fragment>
    );
  }
}
