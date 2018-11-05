import React from 'react';
import { Select } from 'antd';
import moment from 'moment';
import NoDataComp from '../../../PersonnelControl/Components/components/noDataComp';
import ResidenceBox from './residenceBox';

import './residenceTime.scss';

const Option = Select.Option;

class ResidenceTime extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeType: 0
		};
	}
	handleChange = (value) => {
		this.setState({
			timeType: value
		});
	};

	handleTwoArrray = (arr = []) => {
		let list = {};
		arr.map((item) => {
			let timeKey = moment(+item.captureTime).format('YYYY-MM-DD-HH');
			if (list[timeKey]) {
				list[timeKey].value.push(item);
			} else {
				list[timeKey] = { key: moment(+item.captureTime).format('YYYY-MM-DD HH:00'), value: [ item ] };
			}
		});
		return Object.keys(list).map((k) => list[k]);
	};
	render() {
		let { timeType } = this.state;
		let { faceList } = this.props;
		let total = faceList.length;
		if (timeType == 0) {
			faceList = this.handleTwoArrray(faceList) || [];
		} else {
			faceList = faceList || [];
		}
		return (
			<div className="residence_time">
				<div className="time_header">
					<Select defaultValue={0} value={timeType} style={{ width: 120 }} onChange={this.handleChange}>
						<Option value={0}>时间轴展示</Option>
						<Option value={1}>列表展示</Option>
					</Select>
					<p className="time_header_text">
						共<span className="header_text_value">{total}</span>条抓拍信息
					</p>
				</div>
				<div className="time_content">
					{faceList.length > 0 ? timeType == 0 ? (
						faceList.map((v, index) => <ResidenceBox data={v} key={index} />)
					) : (
						<div className="time_content_two">
							{faceList.map((v, index) => (
								<div className="box_img_box" key={index}>
									<div className="box_item">
										<img className="box_img" src={v.facePath} alt="" />
									</div>
									<div className="box_message">
										<p className="message_name">{v.cameraName}</p>
										<p className="meaage_time">2018-08-22 14:55:18</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<NoDataComp title="相关数据" />
					)}
				</div>
			</div>
		);
	}
}

export default ResidenceTime;
