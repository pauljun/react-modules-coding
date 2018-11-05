import React, { Component } from 'react';
import IconFont from 'src/components/IconFont';

import './communityDetail.scss';
class CommunityDetail extends Component {
	constructor(props) {
		super(props);
	}

	thousand(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
 }
	render() {
		let { data = {} } = this.props;
		return (
			<div className="community_suspension">
				<div className="suspension_box">
					<IconFont type={'icon-Dataicon__Dark1'} theme="outlined" />
					<div className="box_type">
						<p className="box_type_p">小区数量</p>
						<span className="box_type_span font-resource-normal">{data.villageCount? this.thousand(data.villageCount) : 0}</span>
					</div>
				</div>
				<div className="suspension_box">
					<IconFont type={'icon-Dataicon__Dark2'} theme="outlined" />
					<div className="box_type">
						<p className="box_type_p">登记人口</p>
						<span className="box_type_span font-resource-normal">{data.residentPeople ? this.thousand(data.residentPeople) : 0}</span>
					</div>
				</div>
				<div className="suspension_box">
					<IconFont type={'icon-Dataicon__Dark3'} theme="outlined" />
					<div className="box_type">
						<p className="box_type_p">流动人口</p>
						<span className="box_type_span font-resource-normal">{data.floatingPeople? this.thousand(data.floatingPeople) : 0}</span>
					</div>
				</div>
				<div className="suspension_box">
					<IconFont type={'icon-Dataicon__Dark4'} theme="outlined" />
					<div className="box_type">
						<p className="box_type_p">房屋数量</p>
						<span className="box_type_span font-resource-normal">{data.houseCount? this.thousand(data.houseCount) : 0}</span>
					</div>
				</div>
				<div className="suspension_box">
					<IconFont type={'icon-_Camera__Main2'} theme="outlined" />
					<div className="box_type">
						<p className="box_type_p">摄像机数量</p>
						<span className="box_type_span font-resource-normal">{data.cameraCount ? this.thousand(data.cameraCount) : 0}</span>
					</div>
				</div>
				<div className="suspension_box">
					<IconFont type={'icon-Dataicon__Dark'} theme="outlined" />
					<div className="box_type">
						<p className="box_type_p">道闸数量</p>
						<span className="box_type_span font-resource-normal">{data.tollgateCount? this.thousand(data.tollgateCount) : 0}</span>
					</div>
				</div>
				<div className="suspension_box">
					<IconFont type={'icon-Entrance_Guard'} theme="outlined" />
					<div className="box_type">
						<p className="box_type_p">门禁数量</p>
						<span className="box_type_span font-resource-normal">{data.doorCount? this.thousand(data.doorCount) : 0}</span>
					</div>
				</div>
			</div>
		);
	}
}

export default CommunityDetail;
