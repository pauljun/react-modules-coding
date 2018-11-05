import React, { Component } from 'react';
import { observer } from 'mobx-react';
import CircleProgressAnimaten from '../../../../BusinessComponent/CircleType';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import util from '../middle/util/util';
import { Popover } from 'antd';
import { errorBoundary } from 'src/utils/Decorator';

const Circle = CircleProgressAnimaten;
@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class CameraStatus extends Component {
	state = {
		cameraList: []
	};

	componentDidMount() {
		this.props.JurisdictionOverviewStore.getDeviceCount({ deviceTypes: [] }).then((res) => {
			this.setState({ cameraList: res.result || [] });
		});
	}
	getValue = (data, attr) => {
		let count = 0;
		data.map((v) => {
			count += v[attr];
		});
		return count;
	};
	render() {
		let { cameraList } = this.state;
		let { spacings } = this.props;
		let online = this.getValue(cameraList, 'onlineCount');
		let total = this.getValue(cameraList, 'totalCount');
		let percent = (online / total).toFixed(2) * 100;
		const content = (
			<React.Fragment>
				<div>接入设备统计</div>
				<div>
					在线：{util.splitNum(online)}&nbsp;({isNaN(percent)?0:percent}%)
				</div>
				<div>
					离线：{util.splitNum(total - online)}&nbsp;({isNaN(percent)?0:(100 - percent)}%)
				</div>
			</React.Fragment>
		);
		return (
			<div className="alarm-antd-pr " id="circle">
				<Popover
					placement="right"
					getPopupContainer={() => document.getElementById('circle')}
					trigger="hover"
					content={content}
				>
					<span style={{ height: '200px', width: '200px', display: 'block', margin: '0 auto' }}>
						<Circle
							hasText={true}
							lineWidth={15}
							width={200}
							height={200}
							value={online}
							tatol={total}
							percent={percent} //比例
							startRGB={'255,136,0'}
							endRGB={'255,170,0'}
							textTop={'接入设备数量'}
							textBottom={'在线设备数量'}
						/>
					</span>
				</Popover>
				<style jsx="true">{`
					#circle .ant-popover-arrow {
						background: transparent !important;
					}
					#circle .ant-popover.ant-popover-placement-right {
						top: ${spacings === 10 ? 100 : 100}px!important;
						left: ${spacings === 10 ? 270 : 270}px!important;
					}
					#circle .ant-popover-inner {
						width: 160px;
						background: rgba(0, 0, 0, .6) !important;
						padding: 15px;
					}
					#circle .ant-popover-inner-content {
						color: #fff !important;
					}
					#circle .ant-popover-placement-right {
						padding-left: 0 !important;
						margin-left: -10px;
					}
				`}</style>
			</div>
		);
	}
}
export default CameraStatus;
