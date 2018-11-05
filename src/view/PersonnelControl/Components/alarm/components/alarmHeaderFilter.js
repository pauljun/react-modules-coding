import React from 'react';
import { Select, Radio, Popover, Button } from 'antd';
import RangePicker from '../../../../../components/RangePicker';
import moment from 'moment';
import { geoAddress } from 'src/libs/Dictionary';
import IconFont from 'src/components/IconFont';

import './alarmHeaderFilter.scss';

const Option = Select.Option;

class AlarmHeaderFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dateBegin: moment(moment(new Date()).format('YYYY-MM-DD')).valueOf(),
			dateEnd: moment(new Date()).valueOf(),
			maxDate: undefined,
			minDate: undefined,
			showDate: false,
			popHoverType: false,
			popShow: false,
			option: {}
		};
	}

	// 时间筛选
	handleTimeSort = (value) => {
		this.props.onTypeChange({ sortType: parseInt(value, 10) });
	};

	// 类别筛选
	handleTypeChange = (value) => {
		if (value === 'null') {
			value = null;
		}
		this.props.onTypeChange({ page: 1, alarmOperationType: value });
	};
	//场所筛选
	handleHomeChange = (value) => {
		this.props.onTypeChange({ page: 1, installationSites: value });
	}
	chooseTime = (e) => {
		let { onTypeChange } = this.props;
		let value = e.target.value;
		if (value == 'null') {
			value = null;
		}
		let option = {};
		if (value != 2) {
			this.setState({
				showDate: false,
				dateBegin: null,
				dateEnd: null
			});
			option.page = 1;
			option.timeType = value;
			onTypeChange(option);
			this.setState({
				popHoverType: false
			});
		} else {
			this.props.setStoreSeacrhData({ timeType: 2 });
			this.setState({
				popHoverType: true
			});
		}
	};
	timeChange = (type, value) => {
		let { searchData } = this.props;
		let { dateBegin } = this.state;
		let startTime = dateBegin,
			endTime = undefined,
			maxDate = undefined,
			minDate = undefined;
		if (type === 'startTime') {
			startTime = value;
			maxDate = value + 2592000000;
			this.setState({ dateBegin: startTime, maxDate });
		} else {
			endTime = value;
			minDate = value - 2592000000;
			this.setState({ dateEnd: endTime, minDate });
		}
		if (type === 'startTime' && endTime === undefined) {
			endTime = moment(new Date()).valueOf();
		}
		let option = searchData;
		option.endTime = endTime;
		option.startTime = startTime;
		this.setState({
			option
		});
	};
	popSubmit = () => {
		let { searchData } = this.props;
		let { dateBegin, dateEnd } = this.state;
		let option = searchData;
		option.endTime = dateEnd;
		option.startTime = dateBegin;
		this.props.onTypeChange(option);
		this.setState({
			popShow: false
		});
	};
	popCancel = () => {
		this.setState({
			popShow: false
		});
	};
	popChange = () => {
		this.setState({
			popShow: true
		});
	};
	render() {
		let { dateBegin, dateEnd, popHoverType, popShow, maxDate, minDate } = this.state;
		let { searchData, libType } = this.props;
		return (
			<div className="alarm_header_filter">
				{libType !== 2 &&
				libType !== 3 && (
					<Select
						dropdownClassName="header_filter_select_time_downwrap"
						className="header_filter_time_select"
						style={{ width: 134 }}
						value={searchData.sortType}
						onChange={this.handleTimeSort}
						defaultValue={1}
					>
						<Option value={1}>
							{/* <IconFont type={'icon-Clock_Light'} theme="outlined" />按时间排序 */}
							按时间排序
						</Option>
						<Option value={2}>
							{/* <IconFont type={'icon-_Main'} theme="outlined" />按相似度排序 */}
							按相似度排序
						</Option>
					</Select>
				)}
				{libType !== 4 && (
					<Select
						dropdownClassName="header_filter_select_type_downwrap"
						className="header_filter_type_select"
						style={{ width: 110 }}
						value={
							searchData.alarmOperationType === null ? (
								'null'
							) : searchData.alarmOperationType == 1 ? (
								'1'
							) : searchData.alarmOperationType == 2 ? (
								'2'
							) : searchData.alarmOperationType == 3 ? (
								'3'
							) : (
								'4'
							)
						}
						onChange={this.handleTypeChange}
						defaultValue={'null'}
					>
						<Option value={'null'}>
							{/* <IconFont type={'icon-Task_Main'} theme="outlined" />不限 */}
							全部状态
						</Option>
						<Option value="1">
							{/* <IconFont type={'icon-Version_Main'} theme="outlined" />已处理 */}
							已处理
						</Option>
						<Option value="2">
							{/* <IconFont type={'icon-Select_Choosed_Main'} theme="outlined" />未处理 */}
							未处理
						</Option>
						<Option value="3">
							{/* <IconFont type={'icon-YesNo_Yes_Main'} theme="outlined" />有效 */}
							有效
						</Option>
						<Option value="4">
							{/* <IconFont type={'icon-YesNo_No_Main'} theme="outlined" />无效 */}
							无效
						</Option>
					</Select>
				)}
				<Select
					dropdownClassName="header_filter_select_type_downwrap"
					className="header_filter_home_select"
					style={{ width: 120 }}
					onChange={this.handleHomeChange}
					// defaultValue={null}
					placeholder="场所筛选"
					mode="multiple"
				>
					{/* <Option value={null}>全部场所</Option> */}
					<Option value={102401}>社区</Option>
					<Option value={102402}>网吧</Option>
					<Option value={102403}>酒店</Option>
					<Option value={102404}>餐厅</Option>
					<Option value={102405}>商场</Option> 
					<Option value={102406}>重点区域</Option>
					<Option value={102407}>重点商铺</Option>
					<Option value={102408}>停车棚</Option>
					<Option value={102409}>其他</Option>
				</Select>
				<Radio.Group
					className="header_filter_radio"
					defaultValue={'null'}
					value={searchData.timeType === null ? 'null' : searchData.timeType}
					buttonStyle="solid"
					onChange={this.chooseTime}
				>
					<Radio value={'null'}>不限</Radio>
					<Radio value={1}>24小时</Radio>
					<Radio value={3}>3天</Radio>
					<Radio value={7}>7天</Radio>
					{popHoverType ? (
						<Popover
							overlayClassName={'radio_poppver'}
							defaultVisible={true}
							content={
								<div>
									<RangePicker
										onChange={this.timeChange}
										startTime={dateBegin}
										endTime={dateEnd}
										maxDate={maxDate}
										minDate={minDate}
									/>
									<div className="pop_btn">
										<Button onClick={this.popCancel}>取消</Button>
										<Button onClick={this.popSubmit} type="primary">
											确定
										</Button>
									</div>
								</div>
							}
							// trigger="hover"
							placement="bottom"
							visible={popShow}
						>
							<span onClick={this.popChange}>
								<Radio value={2}>自定义</Radio>
							</span>
						</Popover>
					) : (
						<span onClick={this.popChange}>
							<Radio value={2}>自定义</Radio>
						</span>
					)}
				</Radio.Group>
			</div>
		);
	}
}

export default AlarmHeaderFilter;
