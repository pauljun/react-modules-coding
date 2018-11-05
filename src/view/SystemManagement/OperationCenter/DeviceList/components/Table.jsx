import React from 'react';
import Table from '../../../components/Table';
import Pagination from 'src/components/Pagination';
import DeviceIcon from '../../../../../components/DeviceIcon';
import { getKeyValue } from '../../../../../libs/Dictionary';


class view extends React.Component {

  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      goPage,
      updateDeviceOcId,
      ...props
    } = this.props;
    const columns = [
      {
        title: '摄像机名称',
        width: '30%',
        dataIndex: 'deviceName',
        render: (name, record) => {
          return (
            <div className="device-table-name">
              <span>
                <DeviceIcon
                  deviceType={record.manufacturerDeviceType}
                  type={record.deviceType}
                  status={record.deviceData}
                />
                {name}
              </span>
            </div>
          );
        }
      },
      {
        title: 'SN码',
        dataIndex: 'sn',
        width: '30%'
      },
      {
        title: '类型',
        dataIndex: 'deviceType',
        width: '20%',
        render: (text, item, index) => {
          return (
            <span>
              {getKeyValue(
                'deviceType',
                `${
                  item.manufacturerDeviceType === 103401
                    ? item.deviceType
                    : item.manufacturerDeviceType
                }`
              )}
            </span>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'del',
        width: '20%',
        render: (text, item) => (
          <span>
            <span
              onClick={ () => updateDeviceOcId(item.id)}
              style={{ cursor: 'pointer' }}
            >
              取消分配
            </span>
          </span>
        )
      }
    ];
    return (
      <div className="center-device-container">
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
