import React from 'react';
import { observer } from 'mobx-react';
import Title from '../../components/Title';
import Search from './components/Search';
import Table from './components/Table';
import { Modal, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { searchFormat } from '../../../../utils';
import './index.scss';

@withRouter
@BusinessProvider('OperationCenterDeviceListStore', 'TabStore')
@observer
export default class RoleView extends React.Component {
	state = {
		list: [],
		total: 10,
		loading: false
	};

	componentWillMount() {
		const { location } = this.props;
		let params = searchFormat(location.search);
		this.ocId = params.id;
		this.search();
	}

	/**跳转 */
	goPage(moduleName, childModuleName) {
		const { TabStore, history } = this.props;
		TabStore.goPage({
			moduleName,
			childModuleName,
			history,
			data: {
				id: this.ocId
			}
		});
	}

	/**搜索 */
	search = () => {
		const { OperationCenterDeviceListStore } = this.props;
		this.setState({
			loading: true
		});
		OperationCenterDeviceListStore.getList(this.ocId).then((res) => {
			this.setState({
				total: res.result.resultSize,
				loading: false,
				list: res.result.resultList
			});
		});
	};

	/**修改查询条件 */
	editSearchData = (options) => {
		const { OperationCenterDeviceListStore } = this.props;
		OperationCenterDeviceListStore.mergeSearchData(options);
		this.search();
	};
	/**分页切换查询 */
	onChange = (page, pageSize) => {
		this.editSearchData({ page, pageSize });
	};

	updateDeviceOcId = (id) => {
		let self = this;
		Modal.confirm({
			title: '确定取消分配当前设备？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				const { OperationCenterDeviceListStore } = self.props;
				OperationCenterDeviceListStore.updateDeviceOcId({
					deviceIds: [id],
					fromOcId: self.ocId
				}).then(() => {
					self.search();
					message.success('操作成功！');
				});
			}
		});
	};

	render() {
		const { menuInfo, OperationCenterDeviceListStore } = this.props;

		const { searchData } = OperationCenterDeviceListStore;

		const { list, total, loading } = this.state;
		return <React.Fragment>
			<div className="noTreeTitle">已分配设备</div>
			<div className="optCenter-add-contianer">
				<div className="optCenter-wrapper">
					<Title key="title" name={''} className="optCenter-title">
						<Search searchData={searchData} onChange={this.editSearchData} goPage={this.goPage.bind(this)} />
					</Title>
					<Table
						key="has-device-list"
						total={total}
						goPage={this.goPage.bind(this)}
						searchData={searchData}
						dataSource={list}
						loading={loading}
						onChange={this.onChange}
						updateDeviceOcId={this.updateDeviceOcId}
						scroll={{ y: '100%' }}
					/>
				</div>
			</div>
		</React.Fragment>
	}
}
