import React from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Pagination from 'src/components/Pagination';
import Table from '../../../components/Table';
import moment from 'moment';

@withRouter
@inject('TabStore')
class LoggerTableView extends React.Component {
	goPage(moduleName, childModuleName, data) {
		this.props.TabStore.goPage({
			moduleName,
			childModuleName,
			history: this.props.history,
			data,
			isUpdate: true
		});
  }
  
  getLogLabel = (code) => {
    const { logInfoDict } = this.props;
    const logItem = logInfoDict.find(x => x.code+'' === code+'') || {}
    return logItem.text
  }

	render() {
    let { dataSource, loading, total, searchData, onChange, ...props } = this.props;
		let data = dataSource
		const columns = [
			{
				title: '序号',
				dataIndex: 'id',
				width: '6%',
				className:'log-column-index',
				render(text, item, index) {
					return index + 1;
				}
			},
			{
				title: '操作人',
				dataIndex: 'username',
				width:'12%',
			},
			{
				title: '记录时间',
				width: '15%',
				dataIndex: 'time',
				render(text, item, index) {
					return moment(+text).format('YYYY-MM-DD HH:mm:ss');
				}
			},
			{
				title: 'IP地址',
				width: '11%',
				dataIndex: 'ip'
			},
			{
				title: '操作模块',
				width: '12%',
				dataIndex: 'module',
				render:(text, item, index) => {
					return this.getLogLabel(text)
				}
			},
			{
				title: '操作功能',
				width: '20%',
				dataIndex: 'function',
				render : (text, item, index) => {
					return this.getLogLabel(text)
				}
			},
			{
				title: '描述',
        width: '24%',
        className: 'log-description',
				dataIndex: 'description',
				render: text => text || ''
			}
		];
		return (
			<div className="logger-soldier-container">
        <Table 
          className="logger-table" 
          pagination={false} 
          columns={columns} 
          dataSource={data} 
          loading={loading} 
          {...props}
        />
				<Pagination total={total} pageSize={searchData.pageSize} current={searchData.pageNum} onChange={onChange} simpleMode={false}/>
			</div>
		);
	}
}

export default LoggerTableView;
