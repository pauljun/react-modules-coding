import React from 'react';
import { Progress } from 'antd';
import moment from 'moment';

import './detailed.scss';
class Detailed extends React.Component {
	render() {
		let { data, libType, libList = {}, goLibDetail } = this.props;
		return (
			<section className={`detail_detailed ${libType == 3 && 'detail_detailed_meiying'}`}>
				{libType !== 3 && (
					<div className="detail_detailed_left">
						{libType == 1 && (
							<div className="detailed_Cloth">
								<div className="cloth_img_box">
									<img className="cloth_img" src={data && data.imageUrl} alt="" />
								</div>
								<p className="cloth_p">布控人脸</p>
							</div>
						)}
						<div className="detailed_Cloth">
							<div className="cloth_img_box">
								<img className="cloth_img" src={data && data.facePath} alt="" />
							</div>
							<p className="cloth_p">抓拍人脸</p>
						</div>
						{data &&
						data.isHandle == 1 && (
							<div className={`detailed_rotate ${data && data.isEffective == 0 ? 'rotate_no' : 'rotate_yes'} `} />
						)}
					</div>
				)}
				<div className="detail_detailed_right">
					<div className="detailed_right_header">
						{data &&
						libType == 1 && (
							<React.Fragment>
								<p className="header_name">{data && data.objectMainJson && data.objectMainJson.name}</p>
								<div className="header_progress">
									<span className="progress_span">相似度</span>
									<Progress percent={data && Math.floor(data.similarity)} status="active" strokeWidth={6} />
								</div>
							</React.Fragment>
						)}
						{data &&
						libType == 2 && <p className="header_name header_name_illegal">所在布控任务：{data && data.libName}</p>}
						{data &&
						libType == 4 && (
							<p className="header_name header_name_illegal">
								互联网别名：{data && data.objectMainJson && data.objectMainJson.name}
							</p>
						)}
						{data &&
						libType == 3 && <p className="header_name header_name_illegal">所在布控任务：{data && data.libName}</p>}
					</div>
					{libType == 1 && (
						<div className="detailed_right_center">
							<p className="right_center_p">
								<span className="right_center_span">性别：</span>男
							</p>
							<p className="right_center_p">
								<span className="right_center_span"> 所在布控库：</span>武汉测试布控库
							</p>
							<p className="right_center_p">
								<span className="right_center_span">民族：</span>汉族
							</p>
							<p className="right_center_p">
								<span className="right_center_span">告警类型：</span>重点人员告警
							</p>
							<p className="right_center_p">
								<span className="right_center_span">身份证号码：</span>440582198905232946
							</p>
							<p className="right_center_p">
								<span className="right_center_span">告警设备：</span>
								{data && data.cameraName}
							</p>
							<p className="right_center_p">
								<span className="right_center_span">出生年月：</span>1989年05月23日
							</p>
							<p className="right_center_p">
								<span className="right_center_span">告警时间：</span>
								{data && moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}
							</p>
						</div>
					)}
					{libType == 2 && (
						<div className="detailed_right_center">
							<div className="detailed_right_center_left">
								<p className="right_center_p">
									<span className="right_center_span">告警设备：</span>
									{data && data.cameraName}
								</p>
								<p className="right_center_p">
									<span className="right_center_span">告警时间：</span>
									{data && moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}
								</p>
							</div>
							<div className="detailed_right_center_right">
								<span className="right_center_span">合规人员库：</span>
								<div className="right_btn_box">
									{libList &&
										libList.length > 0 &&
										libList.map((v) => {
											return (
												<div className="btn_box" key={v.id}>
													<span className="btn_box_span" onClick={() => goLibDetail(v) }>
														{v.name}
													</span>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					)}
					{libType == 4 && (
						<div className="detailed_right_center detailed_right_center_zhuanwang">
							<p className="right_center_p">
								<span className="right_center_span">告警设备：</span>
								{data && data.cameraName}
							</p>
							<p className="right_center_p">
								<span className="right_center_span">所在布控库：</span>
								{data && data.libName}
							</p>
							<p className="right_center_p">
								<span className="right_center_span">告警时间：</span>
								{data && moment(+data.captureTime).format('YYYY-MM-DD HH:mm:ss')}
							</p>
						</div>
					)}
					{libType == 3 && (
						<div className="detailed_right_center detailed_right_center_meiying">
							<p className="right_meiying_p">
								<span className="right_center_span">告警设备：</span>
								{data && data.cameraName}
							</p>
							<p className="right_meiying_p">
								<span className="right_center_span">告警时间：</span>
								{data && moment(+data.captureTime).format('YYYY-MM-DD HH:mm:ss')}
							</p>
						</div>
					)}
				</div>
			</section>
		);
	}
}

export default Detailed;
