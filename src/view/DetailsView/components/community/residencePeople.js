import React from 'react';
import NoDataComp from '../../../PersonnelControl/Components/components/noDataComp';
import WaterMark from 'src/components/WaterMarkView';

import './residencePeople.scss';

class ResidencePeople extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { data = {}, realName } = this.props;
		let roommateList = data.roommateList || [];
		let householder = [],
			agentList = [],
			household = [],
			Tenant = [],
			guest = []; // 户主 代理人 住户  租户 临时客人
		roommateList.map((v) => {
			if (v.identifyType == 114501) {
				householder.push(v);
			}
			if (v.identifyType == 114502) {
				agentList.push(v);
			}
			if (v.identifyType == 114503) {
				household.push(v);
			}
			if (v.identifyType == 114504) {
				Tenant.push(v);
			}
			if (v.identifyType == 114505) {
				guest.push(v);
			}
		});
		if (householder.length > 1) {
			householder.length = 1;
		}
		if (agentList.length > 3) {
			agentList.length = 3;
		}
		if (household.length > 3) {
			household.length = 3;
		}
		if (Tenant.length > 3) {
			Tenant.length = 3;
		}
		if (guest.length > 3) {
			guest.length = 3;
		}
		return (
			<div className="residence_people">
				<div className="people_title">人员关系：</div>
				{roommateList.length > 0 && (
					<div className="people_content">
						{roommateList.length > 0 ? (
							<React.Fragment>
								<div className="content_box">
									<div className="content_right">
										{household.map((v) => {
											return (
												<div className="right_boom">
													<div className="right_box">
														<WaterMark src={v.portraitPicUrl} type="face" />
													</div>
													<div className="center_text">
														<p className="text_name">{v.name}</p>
														<p className="text_type">住户</p>
													</div>
												</div>
											);
										})}
										{agentList.map((v) => {
											return (
												<div className="right_boom">
													<div className="right_box">
													<WaterMark src={v.portraitPicUrl} type="face" />
													</div>
													<div className="center_text">
														<p className="text_name">{v.name}</p>
														<p className="text_type">代理人</p>
													</div>
												</div>
											);
										})}
									</div>
									{householder.length > 0 && (
										<div className="content_center">
											{householder.map((v) => {
												return (
													<React.Fragment>
														<div className="center_box">
														<WaterMark src={v.portraitPicUrl} type="face" />
														</div>
														<div className="center_text">
															<p className="text_name">{v.name}</p>
															<p className="text_type">户主</p>
														</div>
													</React.Fragment>
												);
											})}
										</div>
									)}
									<div className="content_right left">
										{Tenant.map((v, index) => {
											return (
												<div className="right_boom" key={index}>
													<div className="right_box">
													<WaterMark src={v.portraitPicUrl} type="face" />
													</div>
													<div className="center_text">
														<p className="text_name">{v.name}</p>
														<p className="text_type">租户</p>
													</div>
												</div>
											);
										})}
										{guest.map((v, index) => {
											return (
												<div className="right_boom" key={index}>
													<div className="right_box">
													<WaterMark src={v.portraitPicUrl} type="face" />
													</div>
													<div className="center_text">
														<p className="text_name">{v.name}</p>
														<p className="text_type">临时客人</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
								<div className="content_circle">
									<div className="circle" />
								</div>
							</React.Fragment>
						) : (
							<NoDataComp title="相关数据" />
						)}
					</div>
				)}
			</div>
		);
	}
}

export default ResidencePeople;
