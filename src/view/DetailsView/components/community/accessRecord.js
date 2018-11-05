import React from 'react';
import IconFont from 'src/components/IconFont';
import AccessCard from './accessCard';
import NoDataComp from '../../../PersonnelControl/Components/components/noDataComp';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import './accessRecord.scss';

@BusinessProvider('CommunityDetailStore')
class AccessRecord extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			accessList: [],
			total: 0,
			option: {
				page: 1,
				pageSize: 5,
				peopleId: []
			}
		};
		this.getAccessList(this.state.option);
	}
	handleChange = (type) => {
		let { option } = this.state;
		if (type) {
			option.page += 1;
		} else {
			option.page -= 1;
		}
		this.setState({
			option
		}, () => {
			this.getAccessList(option);
		})
	};

	getAccessList = (option) => {
		let { CommunityDetailStore, data } = this.props;
		option.peopleId = [ data.id ];
		CommunityDetailStore.getAccessList(option).then((res) => {
			this.setState({
				accessList: res.list,
				option,
				total: res.total
			});
		});
	};
	render() {
		let { accessList = [], option, total } = this.state;
		accessList = accessList || [];
		return (
			<div className="access_record">
				<div className="record_header">门禁记录：</div>
				{accessList.length > 0 && (
					<div className="record_content">
						{option.page > 1 ? (
							<div className="record_btn">
								<IconFont
									type={'icon-Arrow_Big_Left_Main'}
									theme="outlined"
									onClick={this.handleChange.bind(this, 0)}
								/>
							</div>
						) : (
							<div className="record_btn_null" />
						)}
						<div className="record_center">
							{accessList.length > 0 ? (
								accessList.map((item, index) => {
									return <AccessCard key={index} data={item} />;
								})
							) : (
								<NoDataComp title="相关数据" />
							)}
						</div>
						{total / 5 > option.page ? (
							<div className="record_btn">
								<IconFont
									type={'icon-Arrow_Big_Right_Main'}
									theme="outlined"
									onClick={this.handleChange.bind(this, 1)}
								/>
							</div>
						) : (
							<div className="record_btn_null" />
						)}
					</div>
				)}
			</div>
		);
	}
}

export default AccessRecord;
