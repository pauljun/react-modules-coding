import React from 'react';
import { Modal } from 'antd';
import MapComponent from 'src/components/Map/MapComponent/index.js';
import ClusterMarker from 'src/components/Map/MapComponent/component/ClusterMarker';
import InfoWindow from 'src/components/Map/MapComponent/component/InfoWindow';
import SearchInput from 'src/components/SearchInput'
import { inject, observer } from 'mobx-react';
// const Search = Input.Search

@inject('DeviceStore')
@observer
class AMapView extends React.Component {
	constructor(props) {
		super(props);
		this.map = null;
	}
	state = {
		key: `map-${Math.random()}`,
	};
	/**地图初始化 */
	initMap(map) {
		// console.log(map,33)
		this.map = map;
		// this.initClusterMarkers();
		const {
			centerPoint,
			zoomLevelCenter
		} = this.props
		map.map.plugin('AMap.Autocomplete', () => {
			var autoOptions = {
				input: this.state.key
			};
			var auto = new window.AMap.Autocomplete(autoOptions);
			function select(e) {
				map.map.setCity(e.poi.adcode);
				map.map.setCenter(e.poi.location);
			}
			window.AMap.event.addListener(auto, 'select', select);
		});
		if (centerPoint && zoomLevelCenter) {
			map.map.setZoomAndCenter(zoomLevelCenter, centerPoint.split(','));
			// this.map.setZoomAndCenter('14', [121.138398, 121.728226])
		}
	}

	/**确定 */
	onOk() {
		let center = this.map.getCenter()
		this.props.onOk(`${center.lng}, ${center.lat}`, this.map.getZoom());
	}

	/**search */
	search(value) {
		console.log(value);
	}

	markerClick(data) {
		this.setState({
			info: data,
			center: [data.longitude, data.latitude],
			visible: true
		});
	}
	render() {
		let { visible, DeviceStore, type, className } = this.props;
		const map =
			<div>
				<div
					className={className}
					style={{
						height: '600px',
						position: 'relative'
					}}
				>
					{/* <Search 
					id='map-search'
					placeholder='请输入搜索内容'
					onSearch={this.search.bind(this)}
					enterButton
					style={{ width: 300 }}
				/> */}
					<SearchInput className="user-map-int" id={this.state.key}></SearchInput>
					<MapComponent
						initMap={this.initMap.bind(this)}
					>
						<ClusterMarker
							options={{
								click: this.markerClick.bind(this)
							}}
							points={DeviceStore.deviceArray}
							init={this.initClusterMarker}
						/>
						{/* <InfoWindow
				visible={visible}
				// center={center}
				// init={this.initInfoWindow}
			>
				{visible && (
					<VideoView
						key={info.id}
						DeviceStore={DeviceStore}
						// info={info}
						// closeVideo={() => this.closeVideo()}
					/>
				)}
			</InfoWindow> */}
						{/* {React.Children.map(children, child =>
				React.cloneElement(child, { clusterMarker: this.clusterMarker })
			)} */}
					</MapComponent>
				</div>
			</div>

		return (
			type !== 'view' ? (
				<Modal visible={visible} width={1000} title="地图中心点位设置" onOk={this.onOk.bind(this)} onCancel={this.props.cancel}>
					<div className="user-modal-title">可设置用户使用云眼地图功能时，地图默认展示的中心点和放大级别！</div>
					{map}
				</Modal>
			) : (
					<div>	{map}</div>
				)
		);
	}
}

export default AMapView;
