import React from 'react';
import { observer } from 'mobx-react';
import Container from '../../components/Container';
import Table from '../../components/Table';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import moment from 'moment';
import Pagination from 'src/components/Pagination';
import Search from '../components/Search';
import Breadcrumb from '../../components/Breadcrumb';
import { message, Modal, Row, Col, Divider, Button } from 'antd';
import BaseInfo from '../components/baseInfo';
import ModalView from '../components/ModalView';
import ModalDelete from 'src/components/ModalComponent'
import IconSpan from 'src/components/IconSpan';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import Title from '../../components/Title';


/**前端分页处理函数 */
/**数组截取 */
const confirm = Modal.confirm;

@BusinessProvider(
  'OrgManagementStore',
  'OrgStore',
  'UserStore',
  'TabStore',
  'OrgStore'
)
@observer
export default class OrganizationView extends React.Component {
  state = {
    /**渲染列表 */
    list: [],
    editShow: false,
    deleteShow:false,
    deleteInfo:'',
    data: {},
    total: 0,
    type: '',
    modalKey: Math.random(),
    //  获取当前点击的组织信息
    clickedOrgInfo: ''
  };
  componentWillMount(){
    const { OrgManagementStore } = this.props
    OrgManagementStore.initData()
  }
  /**子节点点击事件1 */
  leafClk(key) {
    const { OrgManagementStore } = this.props;
    if (key.length !== 0) {
      OrgManagementStore.setData({
        activeKey: key,
      });
      this.setState({
        pageIf: false
      });
    }
    OrgManagementStore.editSearchData({
      orgId: key[0],
      pageNo:1
    });
    this.getBaseInfo();
    this.getUserList();
  }
  /**
   * 获取选中的组织信息
   */
  getBaseInfo = () => {
    const { OrgManagementStore, OrgStore } = this.props;
    OrgStore.getOrgInfoByOrgId(OrgManagementStore.activeKey[0]).then(res => {
      this.setState({
        clickedOrgInfo: res
      });
    });
  };
  /*
   * 修改查询条件
   */
  editSearchData = options => {
    const { OrgManagementStore } = this.props;
    OrgManagementStore.editSearchData(options).then(() => {
      this.getUserList();
    });
  };

  getUserList = () => {
    const { OrgManagementStore } = this.props;
    this.setState({ loading: true });
    OrgManagementStore.getOrgList().then(res => {
      this.setState({
        list: res.data,
        total: res.total,
        loading: false
      });
    });
  };
  /**
   * 分页切换查询
   */
  onChange = (currentPage, pageSize) => {
    this.editSearchData({
      pageSize,
      pageNo: currentPage
    });
  };
  orderByAscAction(item, index) {
    var that = this;
    const { list } = this.state;
    const { OrgManagementStore, OrgStore } = this.props;
    const params = OrgManagementStore.searchData;
    // 判断第一页第一个，不能上移
    if (index === 0 && params.pageNo === 1) {
      message.error('排序受限！');
      return;
    }
    // 操作提示
    confirm({
      title: '请确认是否上移部门？',
      content: `${item.name /* item.organizationName */}`,
      onOk() {
        const Index = list.findIndex(v => v.id == item.id) - 1; 
        /* params.pageSize * (params.current - 1) + index - 1 */
        // 入参
        let options = [
          {
            orgId: item.id, // 当前ID
            sort: list[Index].orgSort // 上一个orgSort
          },
          {
            orgId: list[Index].id, // 上一个ID
            sort: item.orgSort // 当前orgSort
          }
        ];
        OrgManagementStore.getUpDownList(options).then(function() {
          that.setState({
            NameState: true
          });
          that.getUserList();
          OrgStore.getOrgList();
        });
      },
      onCancel() {
        return Promise.resolve();
      },
      okType: 'danger',
      cancelText: '取消',
      okText: '确定'
    });
  }
  orderByDescAction(item, index) {
    var that = this;
    const { list } = this.state;
    const { OrgManagementStore, OrgStore } = this.props;
    const params = OrgManagementStore.searchData;
    const Index = list.findIndex(v => v.id == item.id) + 1;
    // 判断第一页第一个，不能上移
    if (Index === list.length && params.pageNo === 1) {
      message.error('排序受限！');
      return;
    }
    // 操作提示
    confirm({
      title: '请确认是否下移部门？',
      content: `${item.name /* item.organizationName */}`,
      onOk() {
        /* params.pageSize * (params.pageNo - 1) + index - 1 */
        // 入参
        let options = [
          {
            orgId: item.id, // 当前ID
            sort: list[Index].orgSort // 上一个orgSort
          },
          {
            orgId: list[Index].id, // 上一个ID
            sort: item.orgSort // 当前orgSort
          }
        ];
        OrgManagementStore.getUpDownList(options).then(function() {
          that.setState({
            NameState: true
          });
          that.getUserList();
          OrgStore.getOrgList();
        });
      },
      onCancel() {
        return Promise.resolve();
      },
      okType: 'danger',
      cancelText: '取消',
      okText: '确定'
    });
  }
  // 新增部门
  addOrg(option, type) {
    this.setState({
      data:'',
      editShow: true,
      type: type,
      modalKey: Math.random()
    });
  }
  editAction(item, type) {
    this.setState({
      editShow: true,
      data: item,
      type: type,
      modalKey: Math.random()
    });
  }
  CancelModal = () => {
    this.setState({
      editShow: false
    });
  };
  deleteOk = () => {
    var that = this;
    const { deleteInfo } = this.state
    const { OrgManagementStore, OrgStore, UserStore } = this.props;
    let options = {
      orgId: deleteInfo.id
    };
    OrgManagementStore.DeleteOrg(options).then(() => {
      OrgManagementStore.getOrgList().then((res) => {
        that.setState({
          list: res.data
        });

        const buttonInfo = UserStore.btnInfo;
        OrgStore.getOrgsCameraLists(
          UserStore.userInfo.organizationId,
          UserStore.userInfo.userType,
          UserStore.userInfo.optCenterId,
          buttonInfo
        );
      });
      OrgStore.getOrgList();
    });
    this.deleteCancel()
  }
  deleteCancel = () => {
    this.setState({
      deleteShow:false
    })
  }
  deleteAction(item) {
    this.setState({
      deleteShow:true,
      deleteInfo:item,
    })
  }
  onSubmit = (data, value, type) => {
    const { OrgManagementStore, UserStore, OrgStore } = this.props;
    let options = {
      organizationDesc: value.organizationDesc,
      organizationName: value.organizationName,
      organizationType: data.type,
      parentId: OrgManagementStore.searchData.orgId || 0,
      validEndTime: '',
      centerId: UserStore.userInfo.optCenterId // 获取用户信息，获取该用户对应的运营中心id
    };
    let subAction = OrgManagementStore.addAction;

    if (type === 'edit') {
      options.id = data.id;
      options.parentId = data.parentId;
      subAction = OrgManagementStore.EditOrganization;
    }
    return subAction(options).then(() => {
      this.getUserList();
      const buttonInfo = UserStore.btnInfo;
      OrgStore.getOrgsCameraLists(
        UserStore.userInfo.organizationId,
        UserStore.userInfo.userType,
        UserStore.userInfo.optCenterId,
        buttonInfo
      );
    });
  };
  render() {
    const { OrgStore, OrgManagementStore } = this.props;
    const params = this.props.OrgManagementStore.searchData;
    const columns = [
      {
        title: '序号',
        key: 'id',
        width: '10%',
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '部门名称',
        dataIndex: 'name',
        width: '25%',
        render: (name, record) => {
          return (
            <a onClick={this.editAction.bind(this, record, 'view')}> {name}</a>
          );
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '20%',
        render: time =>
          time && moment(parseInt(time, 10)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '描述',
        width: '25%',
        dataIndex: 'desc'
      },
      {
        title: '操作',
        width: '20%',
        dataIndex: 'action',
        key: '10',
        render: (text, record, index) => {
          const isUp = index === 0;
          const isDown = index === list.length - 1;
          return (
            <div className="table-tools">
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  icon="icon-Edit_Main"
                  title="编辑"
                  onClick={this.editAction.bind(this, record, 'edit')}
                />
              </AuthComponent>
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  icon="icon-Delete_Main"
                  title="删除"
                  onClick={this.deleteAction.bind(this, record)}
                />
              </AuthComponent>
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  title="上移"
                  onClick={this.orderByAscAction.bind(this, record, index)}
                  disabled={isUp ? true : false}
                  icon="icon-UpDown_Up_Dark"
                />
              </AuthComponent>
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  title="下移"
                  onClick={this.orderByDescAction.bind(this, record, index)}
                  disabled={isDown ? true : false}
                  icon="icon-UpDown_Down_Dark"
                />
              </AuthComponent>

            </div>
          );
        }
      }
    ];
    const { searchData } = OrgManagementStore;
    const { list, total, type, clickedOrgInfo, loading, modalKey } = this.state;
    return (
      <Container
        title='组织管理'
        treeActiveKey={OrgManagementStore.activeKey}
        leafClk={this.leafClk.bind(this)}
        allowClear={true}
      >
        {OrgManagementStore.activeKey && 
        <div className="org-breadCrumb">
          <Breadcrumb
            list={OrgStore.getParentOrgListByOrgId(
              OrgManagementStore.activeKey[0]
            ).reverse()}
          >
          </Breadcrumb>
        </div>
        }
        <div className="org-table-content">
          <div className="org-baseInfo">
            <Title name='基本信息'/>
            <BaseInfo info={clickedOrgInfo}/>
          </div>
          <div className="org-table-container">
            <Title name='直属部门列表'>
              <div className='org-Search-Btns'>
                <AuthComponent actionName="OrganizationOperata">
                  <Button
                    className='orange-btn addOrgBtn'
                    type={'primary'}
                    icon={'plus'}
                    onClick={() => this.addOrg(false, 'add')}
                  >
                    新建直属部门
                  </Button>
                </AuthComponent>
                <Search searchData={searchData} onChange={this.editSearchData} />
              </div>
            </Title>
            <div className="org-table">
              <Table
                columns={columns}
                dataSource={list}
                loading={loading}
                scroll={{ y: '100%' }}
              />
              <Pagination
                total={total}
                current={searchData.pageNo}
                pageSize={searchData.pageSize}
                onChange={this.onChange}
                simpleMode={false}
              />
            </div>
          </div>
          <ModalView
            key={modalKey}
            visible={this.state.editShow}
            CancelModal={this.CancelModal}
            data={this.state.data}
            onSubmit={this.onSubmit}
            type={type}
          />
          <ModalDelete 
            visible={this.state.deleteShow}
            onOk = {this.deleteOk}
            onCancel = {this.deleteCancel}
            title= '删除确认'
            img = 'delete'
          >
            <p style={{textAlign: 'center'}}>确定删除 <span className='highlight'>{this.state.deleteInfo.name}</span></p>
          </ModalDelete>
        </div>
      </Container>
    );
  }
}
