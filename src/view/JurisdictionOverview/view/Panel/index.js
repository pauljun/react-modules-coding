import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import LogsComponent from 'src/components/LogsComponent';
import MapComponent from 'src/components/Map/MapComponent/index.js';
import ClusterMarker from 'src/components/Map/MapComponent/component/ClusterMarker';
import ChartCard from '../../components/ChartCard/ChartCard.jsx';
import { ScreenListen } from '../../components/ScreenListener';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import enquire from 'enquire.js/dist/enquire';
import Socket from '../../../../libs/Socket';
import * as _ from 'lodash';

import Title from './components/Title';
import ToolsView from './components/Tools';
import ResourceModule from '../../ResourceModule';
import KvServer from 'src/service/KVService';

import ResourceStatic from './middle/ResourceStatic';
import './index.scss';

@LogsComponent()
@withRouter
@BusinessProvider('JurisdictionOverviewStore', 'TabStore', 'DeviceStore', 'UserStore')
@ScreenListen
@observer
class Panel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 300,
			spacing: 20,
			ids: []
		};
		// 监听面板编辑完成
		Socket.on('panelEdit', this.checkcards);
	}
	AMap = null;
	markerShowInit = false;
	showTypeData = null;
	clusterMarker = null;
	initClusterMarker = (clusterMarker) => {
		this.clusterMarker = clusterMarker;
	};
	componentWillUnmount() {
		Socket.off('panelEdit', this.checkcards);
		this.clusterMarker = null;
		this.AMap = null;
		this.fontSizeInit=null;
	}

	componentDidMount() {
		this.fontSizeInit();
		window.addEventListener('resize',this.fontSizeInit)
		this.initCardPositioin();
		this.initData()

		
	}
	//初始化数据
	initData=() => {
		let {JurisdictionOverviewStore,UserStore}=this.props
		Promise.all([
			JurisdictionOverviewStore.getDeviceCount({deviceTypes:[]}),
			KvServer.getKVStore(UserStore.userInfo.id, 'PANELSETTING'),
		]).then(resArr => {
			let deviceCount=0
			resArr[0].result && resArr[0].result.map(v => {
				deviceCount += v.totalCount
			})
			this.setState({
				deviceCount,
				ids: resArr[1] ? resArr[1] : [7, 5, 3, 8, 10, 6 ]
			});

		})

	}
	
	//兼容分辨率
	fontSizeInit = () => {
		enquire
			.register('screen and (max-width:1920px)', () => {
				this.setState({ spacing: 20 });
			})
			.register('screen and (max-width:1600px)', () => {
				this.setState({ spacing: 15 });
			})
			.register('screen and (max-width:1366px)', () => {
				this.setState({ spacing: 10 });
			})
			.register('screen and (max-width:1024px)', () => {
				this.setState({ spacing: 6 });
			})
			.register('screen and (max-width:768px)', () => {
				this.setState({ spacing: 3 });
			});
	};
	//初始化卡片位置
	initCardPositioin =() => {
		const { UserStore } = this.props;
		/**自定义面板数据 */
		KvServer.getKVStore(UserStore.userInfo.id, 'PANELSETTING').then((res) => {
			this.setState({
				ids: res ? res : this.state.ids
			});
		});}
		//卡片换位
		checkcards=(ids) => {
			this.setState({ids:ids})
		}
	//初始化地图
	initMap = (AMap) => {
		this.AMap = AMap;
	};
	resetMap=() => {
		let { systemConfig } = this.props.UserStore;
		let { centerPoint, zoomLevelCenter } = systemConfig;
		this.AMap.setZoomAndCenter(zoomLevelCenter || 5,centerPoint && centerPoint.split(','));
		// this.forceUpdate();
	}
	//初始化地图图标
	initMarkersCluster = (cameraList) => {
		let cameraLists = cameraList.map((v) => v);
		if (!this.markerShowInit && cameraLists.length && this.AMap) {
			let data = [].concat(cameraLists);
			this.markerShowInit = true;
			this.AMap.createMarkerCluster(data);
		}
	};

	//渲染card
	renderCards = (t) => {
		const { ids,spacing } = this.state;
		if (!ids.length) {
			return;
		}
		let left = ids.slice(0, 3);
		let right = ids.slice(3, 6);
		return (t === 'left' ? left : right).map((v, i) => {
			const Module = ResourceModule.filter((m) => m.id === v)[0];
			return (Module?
				<ChartCard title={Module.title} type={'charts'} key={`${t}${i}p`} name={`${t}${i}`}>
					{Module.component && <Module.component spacings={spacing} />}
				</ChartCard>
				:
				<ChartCard title={''} type={'charts'} key={`${t}${i}p`} name={`${t}${i}`}>
					{<div style={{margin:'20px auto',textAlign:'center'}}>此模块暂时移除，请重新编辑面板</div>}
				</ChartCard>
			);
		});
	};
	//渲染Cards模块
	renderCardsDom = () => {
		let { fullScreenState, fullScreen } = this.props;
		return (
			<React.Fragment>
				<div className="home-left">{this.renderCards('left')}</div>
				<div className="home-right">
					<ToolsView
						spacing={this.state.spacing}
						resetMap={this.resetMap}
						ids={this.state.ids}
						clusterMarker={this.clusterMarker}
						fullStatus={fullScreenState}
						fullEvent={() => fullScreen(this.Panel)}
					/>
					{this.renderCards('right')}
				</div>
			</React.Fragment>
		);
	};
	
	render() {
		let { spacing,deviceCount } = this.state;
		let { DeviceStore, UserStore } = this.props;
		const dayResouecesStatis = [];
		const deviceStateStatis = [];
		let cameraList = DeviceStore.deviceArray;
		return (
			<React.Fragment>
				<div className="home-main" ref={(Panel) => (this.Panel = Panel)}>
					<Title 
						total={deviceCount}
						title={UserStore.centerInfo.systemName}
					/>
					<div className="home-bg">
						<MapComponent initMap={this.initMap} centerIsCity={true}>
							<ClusterMarker points={cameraList} init={this.initClusterMarker} />
						</MapComponent>
					</div>
					{this.renderCardsDom()}
					<div className="home-bottom">
						<ResourceStatic dayResouecesStatis={dayResouecesStatis} deviceStateStatis={deviceStateStatis} />
					</div>
				</div>
				<style jsx="true">{`
						.home-left,
						.home-right {
							transform: scale(${spacing === 20 ? '1,1' : spacing === 10 ? '.7,.7' : (spacing === 15 ? '.8,.8' : '.6,.6')});
						}
						.home-left{
							// top:${spacing >= 20 ? 50 : spacing >= 10 ? 40 : 50}px!important;
							height:calc(${spacing === 20 ? '100% - 44px': spacing === 10 ? '100% + 196px' : ( spacing === 15 ? '100% + 96px' : '100% + 196px')})!important;
							left:${spacing === 20 ? '0' : spacing === 10 ? '-40' : (spacing === 15 ? '-28' : '-60')}px;
						}
						.home-right{
							// top:${spacing >= 20 ? 0 : spacing >= 10 ? 0 : 50}px!important;
							height:calc(${spacing === 20 ? '100% + 10px' : spacing === 10 ? '100% + 270px' : ( spacing === 15 ? '100% + 146px' : '100% + 246px')})!important;
							right:${spacing === 20 ? '0' : spacing === 10 ? '-40' : (spacing === 15 ? '-28' : '-60')}px!important;
						}
						.home-bottom{
							transform:scale(${spacing >= 20 ? '1,1' : spacing >= 10 ? '.7,.7' : '.60,.60'});
							width:calc(${spacing >= 20 ? '100% - 600px' : spacing >= 10 ? '100% - 40px' : '100% + 20px'})!important;
							left:${spacing >= 20 ? 300 : spacing >= 10 ? 20 : -10}px!important;
							height:${spacing === 20 ? 230 : spacing === 10 ? 200 : (spacing === 15 ? 220 : 200)}px!important;
						}
						.submit-container{
							bottom:${spacing >= 20 ? 255 : spacing >= 10 ? 155 : 200}px!important;
						}
				`}</style>
			</React.Fragment>
		);
	}
}
export default Panel;
