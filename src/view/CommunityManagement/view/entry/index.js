import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import CommunityMap from '../../../BusinessComponent/CommunityMap';
import CommunityList from '../../components/entry/communityList';
import CommunityDetail from '../../components/entry/communityDetail';
import LogsComponent from 'src/components/LogsComponent';

import './index.scss';

@LogsComponent()
@withRouter
@BusinessProvider('TabStore', 'CommunityEntryStore', 'UserStore')
@observer
class EntryView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			villageList: [],
			solidCount: {},
			points: [],
			choseId: ''
		};
		this.communityRef = React.createRef()
		this.getVillageList();
		this.getVillSolidData();
		this.getDeviceList()
	}

	// 获取小区总览列表
	getVillageList = (keyWord = '') => {
		let { CommunityEntryStore } = this.props;
		let option = {
			keyWord: keyWord,
			page: 1,
			pageSize: 10000
		};
		CommunityEntryStore.searchCommunityList(option).then((res) => {
			this.setState({
				villageList: res.list
			});
		});
	};

	getVillSolidData = () => {
		let { CommunityEntryStore ,UserStore} = this.props;
		let userId = UserStore.userInfo.id;
		CommunityEntryStore.getCountVillageSolidData({userId}).then((res) => {
			this.setState({
				solidCount: res
			});
		});
	};

	clickCommunity = (item) => {
		this.communityRef.current.jumpCommunity(item.id);
		this.setState({
			choseId: item.id
		})
	}

	getDeviceList() {
		const { CommunityEntryStore } = this.props;
		CommunityEntryStore.selectCommunityDeviceByUserId().then(res => {
			this.setState({
				points: res
			});
		});
	}
	render() {
		let { villageList, solidCount, points,choseId } = this.state;
		return (
			<div className="community_entry">
				<CommunityMap points={points} villages={villageList} ref={this.communityRef}/>s
				<CommunityList choseId={choseId} getVillageList={this.getVillageList.bind(this)} data={villageList} clickCommunity={this.clickCommunity}/>
				<CommunityDetail data={solidCount} />
			</div>
		);
	}
}

export default EntryView;
