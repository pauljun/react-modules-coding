import React from 'react';
import ResourceTopView from './components/ResourceTopView';
import ResourceSearch from './components/ResourceSearch';
import PropTypes from 'prop-types';
import './style/index.scss';

export default class ResourceTreeView extends React.Component {
  static contextTypes = {
    //deviceList: PropTypes.array
  };
  constructor(props) {
    super(props);
  }
  render() {
    const { deviceList, collectionList, orgList } = this.props;
    const count = deviceList.length;
    const onlineCount = deviceList.filter(v => v.deviceData * 1 === 1)
      .length;
    return (
      <div className="resource-tree-layout">
        <ResourceTopView count={count} onlineCount={onlineCount} />
        <ResourceSearch
          deviceList={deviceList}
          collectionList={collectionList}
          orgList={orgList}
        />
      </div>
    );
  }
}
