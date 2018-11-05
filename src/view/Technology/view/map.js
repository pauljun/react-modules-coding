import React from 'react';
// import MapMarkerVideo from '../../BusinessComponent/MapMarkerVideo';
import CommunityMap from '../../BusinessComponent/CommunityMap';
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
import '../style/map.scss';

@BusinessProvider('CommunityEntryStore')
export default class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      villages: [],
      points: []
    };
  }
  componentDidMount() {
    const { CommunityEntryStore } = this.props;
    Promise.all([
      CommunityEntryStore.searchCommunityList({ page: 1, pageSize: 10000 }),
      CommunityEntryStore.selectCommunityDeviceByUserId()
    ]).then(res => {
      this.setState({
        villages: res[0].list,
        points: res[1] || []
      });
    });
  }
  render() {
    const { villages ,points} = this.state;
    return (
      <React.Fragment>
        <div className="Map-view">
          <CommunityMap points={points} villages={villages} />
        </div>
      </React.Fragment>
    );
  }
}
