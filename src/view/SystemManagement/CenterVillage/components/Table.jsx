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
      changeCenter,
      resetVillage,
      changeDevice,
      ...props
    } = this.props;
    const columns = [
      {
        width: '15%',
        title: '小区名称',
        dataIndex: 'villageName'
      },
      {
        width: '25%',
        title: '小区地址',
        dataIndex: 'address'
      },
      {
        width: '15%',
        title: '创建时间',
        dataIndex: 'createTime',
        render: text => {
          return moment(text * 1).format('YYYY-MM-DD HH:mm:ss');
        }
      },
      {
        width: '35%',
        title: '管理运营中心',
        dataIndex: 'associateCenter',
        render: text => {
          if (!text) {
            return null;
          } else {
            let str = text.map(v => v.centerName).join(',');
            return (
              <span title={str} className="center-tr">
                {str}
              </span>
            );
          }
        }
      },
      {
        width: '10%',
        title: '操作',
        dataIndex: 'tools',
        render: (text, item) => (
          <div className="table-tools">
            <IconFont
              type="icon-_Judgment"
              style={{ cursor: 'pointer' }}
              title="重置"
              onClick={() => resetVillage(item)}
            />

            <IconFont
              type="icon-Pin_Main"
              style={{ cursor: 'pointer' }}
              title="分配小区到运营中心"
              onClick={() => changeCenter(item)}
            />

            <IconFont
              type="icon-Export_Main"
              style={{ cursor: 'pointer' }}
              title="分配设备到小区"
              onClick={() => changeDevice(item)}
            />
          </div>
        )
      }
    ];
    return (
      <div className="centerVillage-container">
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
