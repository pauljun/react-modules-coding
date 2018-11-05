import React from 'react';
import moment from 'moment';
import {openType,getKeyValue} from 'src/libs/Dictionary';
import WaterMark from 'src/components/WaterMarkView';

import './accessCard.scss';

class AccessCard extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { data = {} } = this.props;
		return (
			<div className="access_card">
				{/* <img className="card_img" src={data.peopleVo && data.peopleVo.portraitPicUrl} alt="" /> */}
				<WaterMark 	className={'card_img'}
							background={true}
							type='face'
							src={data.peopleVo && data.peopleVo.portraitPicUrl}/>
				<div className="card_content">
					<p className="content_name">{data.cardOwner}</p>
					<div className="content_info">
						<p className="info_label"> 门禁卡类型：</p>
						<span className="info_value">{data.accessType && getKeyValue(openType, +data.accessType)}</span>
					</div>
					<div className="content_info">
						<p className="info_label">门禁卡号：</p>
						<span className="info_value" title={data.cardNo}>{data.cardNo}</span>
					</div>
					<div className="content_info">
						<p className="info_label">设备名称：</p>
						<span className="info_value" title={data.address}>{data.address}</span>
					</div>
					<div className="content_info">
						<p className="info_label">抓拍时间：</p>
						<span className="info_value">{data.captureTime && moment(moment(+data.captureTime)).format('YYYY.MM.DD HH:mm:ss')}</span>
					</div>
				</div>
			</div>
		);
	}
}

export default AccessCard;
