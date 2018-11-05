import React from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Title from '../../components/Title';

import ViewItem from '../components/ViewItem';
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 6
  }
};

@BusinessProvider('OperationCenterStore')
class view extends React.Component {
  state = {
    data: {
      userInfo: {}
    }
  };
  componentWillMount() {
    const { history, OperationCenterStore } = this.props;
    const ocId = history.location.search.split('=')[1];
    OperationCenterStore.getDetail(ocId).then(data => {
      this.setState({ data });
    });
  }
  render() {
    const { data } = this.state;
    return <InfoView key="optCenterInfoView" data={data} />;
  }
}

function InfoView(props) {
  const { data } = props;
  return (
    <React.Fragment>
      <div className="noTreeTitle">运营中心管理</div>
      <div className="optCenter-wrapper">
        <div className="setting-operation-center-eidt">
          <h3>基本信息</h3>
          <div className="info-view-part" />
          <ViewItem label="运营中心名称" required>
            {data.centerName}
          </ViewItem>
          <ViewItem label="联系人姓名">{data.contactPerson}</ViewItem>
          <ViewItem label="联系人电话">{data.contactPhone}</ViewItem>
          <h3>登录信息</h3>
          <ViewItem label="系统logo">
            <img src={data.systemLogo} />
          </ViewItem>
          <ViewItem label="登录账号">{data.userInfo.loginName}</ViewItem>
          <ViewItem label="系统名称">{data.systemName}</ViewItem>
          <ViewItem label="登录手机号">{data.userInfo.phoneNum}</ViewItem>
          <ViewItem label="地图中心点">{data.centerPoint}</ViewItem>
          <ViewItem label="放大级别">{data.zoomLevelCenter}</ViewItem>
          <ViewItem label="开启手机验证">
            {data.isCheckPhoneNumber ? '是' : '否'}
          </ViewItem>
        </div>
      </div>
    </React.Fragment>
  );
}

export default view;
