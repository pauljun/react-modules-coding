import React from 'react';
import Table from '../../components/Table';
import Pagination from 'src/components/Pagination';
import { withRouter } from 'react-router-dom';
import IconFont from '../../../../components/IconFont';
import moment from 'moment';
import { inject } from 'mobx-react';

@withRouter
@inject('TabStore')
class view extends React.Component {
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      goPage,
      changeUser,
      ...props
    } = this.props;
    const columns = [
      {
        width: '25%',
        title: '小区名称',
        dataIndex: 'villageName'
      },
      {
        width: '25%',
        title: '小区地址',
        dataIndex: 'address'
      },
      {
        width: '35%',
        title: '关联用户',
        dataIndex: 'associateUser',
        render: text => {
          let str = text.map(v => v.userName).join(',')
          return <span title={str} className="user-tr">{str}</span>;
        }
      },
      {
        width: '15%',
        title: '操作',
        dataIndex: 'tools',
        render: (text, item) => (
          <div className="table-tools">
            <IconFont
              type="icon-Export_Main"
              style={{ cursor: 'pointer' }}
              title="分配"
              onClick={() => changeUser(item)}
            />
          </div>
        )
      }
    ];
    return (
      <div className="village-container">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.page}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default view;
