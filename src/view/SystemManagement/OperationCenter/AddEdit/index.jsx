import React from 'react';
import { Button, Input, Checkbox, Form, message } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import FormUpload from 'src/components/FormUpload';
import Title from '../../components/Title';
import RowCol from '../components/RowCol';
import Socket from '../../../../libs/Socket';
// import MapCenter from 'src/view/BusinessComponent/AMapCenter';
import MapCenter from '../../../Technology/view/mapZoomAndLevel'
import './index.scss';
const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {
		span: 3
	},
	wrapperCol: {
		span: 8
	}
};

@BusinessProvider('OperationCenterStore', 'TabStore')
@Form.create()
class view extends React.Component {
	/**提交 */
	submit() {
		const { form, OperationCenterStore, TabStore } = this.props;
		form.validateFields((err, values) => {
			if (err) {
				return false;
			}
			values.isCheckPhoneNumber = values.isCheckPhoneNumber ? 1 : 0;
			values.userInfo = {
				loginName: values.loginName,
				phoneNum: values.phoneNum
			};
			values.zoomLevelCenter = this.zoom
			values.centerPoint = this.centerPoint
			if (this.ocId) {
				values.id = this.ocId;
				OperationCenterStore.update(values).then(() => {
					message.success('操作成功！');
					Socket.emit('OperationCenterChange');
					TabStore.closeCurrentTab({ history: window.ReactHistory });
				});
			} else {
				OperationCenterStore.add(values).then(() => {
					message.success('操作成功！');
					Socket.emit('OperationCenterChange');
					TabStore.closeCurrentTab({ history: window.ReactHistory });
				});
			}
		});
	}
	onOk(info) {
		this.zoom = info.zoom
		this.centerPoint = `${info.center.lng},${info.center.lat}`
	}

	Pointparse = (point) => {
    let arr = point.split(',');
    return [arr[0]*1, arr[1]*1]
  }

	componentDidMount() {
		const { history, OperationCenterStore, form } = this.props;
		if (history.location.search) {
			this.ocId = history.location.search.split('=')[1];
			OperationCenterStore.getDetail(this.ocId).then((res) => {
				this.zoom = res.zoomLevelCenter;
				this.centerPoint = res.centerPoint;
				form.setFieldsValue({
					centerName: res.centerName,
					contactPerson: res.contactPerson,
					contactPhone: res.contactPhone || '',
					loginName: res.userInfo && res.userInfo.loginName,
					systemName: res.systemName,
					systemLogo: res.systemLogo,
					isCheckPhoneNumber: res.isCheckPhoneNumber ? true : false,
					phoneNum: res.userInfo && res.userInfo.phoneNum,
				});
			});
		}
	}

	/**图片上传 */
	Upload(url) {
		console.log(url);
	}

	/**取消 */
	cancelBack = () => {
		this.props.TabStore.closeCurrentTab({ history: window.ReactHistory });
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const zoomLevelCenter = {
			zoom: this.zoom,
			center: this.centerPoint ? this.Pointparse(this.centerPoint) : null
		}
		return (
			<React.Fragment>
				<div className="noTreeTitle">{!this.ocId ? '新建运营中心' : '编辑运营中心'}</div>
				<div className="optCenter-add-contianer">
					<div className="optCenter-wrapper">
						<Title className="optCenter-title" key="title" name={''}>
							{this.ocId && (
								<Button type="primary" className="orange-btn">
									重置密码
								</Button>
							)}
						</Title>
						<div className="setting-operation-center-eidt">
							<Form>
								<h3>基本信息</h3>
								<FormItem label="运营中心名称 :" {...formItemLayout}>
									{getFieldDecorator('centerName', {
										rules: [{ required: true, message: '运营中心名称必须填写' }]
									})(<Input maxLength="30" placeholder="请填写运营中心名称" />)}
								</FormItem>
								<FormItem label="联系人姓名 :" {...formItemLayout}>
									{getFieldDecorator('contactPerson')(
										<Input autoComplete="off" maxLength="50" type="text" placeholder="请输入联系人姓名" />
									)}
								</FormItem>
								<FormItem label="联系人电话 :" {...formItemLayout}>
									{getFieldDecorator('contactPhone', {
										rules: [
											{
												validator(rule, value, callback, source, options) {
													var errors = [];
													if (!/^(1)\d{10}$/.test(value) && value) {
														errors[0] = '请输入正确的手机号码';
													}
													callback(errors);
												}
											}
										]
									})(<Input type="text" autoComplete="off" placeholder="请输入联系人电话" />)}
								</FormItem>
								<h3>登录信息</h3>
								<FormItem label="系统logo" {...formItemLayout}>
									{getFieldDecorator('systemLogo', {
										rules: [{ required: true, message: '请上传系统logo' }]
									})(<FormUpload name="systemLogo" />)}
								</FormItem>
								<FormItem label="登录账号 :" {...formItemLayout}>
									{getFieldDecorator('loginName', {
										rules: [
											{
												required: true,
												message: '请输入运营中心超级管理员登录账号'
											}
										]
									})(<Input type="text" placeholder="请填写登录账号" />)}
								</FormItem>
								<FormItem label="系统名称 :" {...formItemLayout}>
									{getFieldDecorator('systemName', {
										rules: [{ required: true, message: '请输入运营中心系统名称' }]
									})(<Input maxLength="15" placeholder="请填写系统名称" />)}
								</FormItem>
								<FormItem label="登录手机号 :" {...formItemLayout} type="phone">
									{getFieldDecorator('phoneNum', {
										rules: [
											{ required: true, message: '请输入手机号码' },
											{
												validator(rule, value, callback, source, options) {
													var errors = [];
													if (!/^(1)\d{10}$/.test(value) && value) {
														errors[0] = '请输入正确的手机号码';
													}
													callback(errors);
												}
											}
										]
									})(<Input maxLength="11" placeholder="请输入手机号码" />)}
								</FormItem>
								<FormItem label="开启手机验证 :" {...formItemLayout}>
									{getFieldDecorator('isCheckPhoneNumber', {
										valuePropName: 'checked',
										initialValue: false
									})(<Checkbox />)}
								</FormItem>
								<h3>地图设置</h3>
								<div className='opt-map'>
									<MapCenter
										mapChange={this.onOk.bind(this)}
										zoomLevelCenter={zoomLevelCenter}
									/>
								</div>
							</Form>
						</div>
					</div>
				</div>
				<div className="setting-edit-btns">
					<Button className="opt-action-btn" onClick={this.cancelBack}>
						取消
					</Button>
					<Button type="primary" className="orange-btn opt-action-btn" onClick={this.submit.bind(this)}>
						保存
					</Button>
				</div>
			</React.Fragment>
		);
	}
}

export default view;
