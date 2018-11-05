import React, { Component } from 'react';
import { Icon, Spin, Select, message, Button, Input, Checkbox, Popover, Tabs, BackTop, Tooltip } from 'antd';
import CommunityShow from '../../components/PersonManage/CommunityShow/index';
import CommunityCard from '../../components/PersonManage/CommunityCard/index';
import Upload from '../../../../components/UploadInput/index';
import AlarmHeadSearch from '../../../PersonnelControl/Components/alarm/components/alarmHeaderSearch';
import AlarmHeaderFilter from '../../components/PersonManage/TopSelect/alarmHeaderFilter';
import Pagination from '../../../../components/Pagination/index';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import RegisButCard from '../../components/PersonManage/RegisButNoCard/index';
import CommunityShowLeft from '../../components/PersonManage/CommunityShowLeft/index'
import { withRouter } from 'react-router-dom';
import NoData from '../../../../components/NoData/index'
import Socket from '../../../../libs/Socket'; 
import LogsComponent from 'src/components/LogsComponent';
import UploadA from '../../components/PersonManage/UploadInput/index'
import './index.scss';
const TabPane = Tabs.TabPane;

@LogsComponent()
@withRouter
@BusinessProvider('LongLivedStore', 'CommunityEntryStore', "TabStore")
class LongLivedPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      activeKey: '1',
      loading: true,
      LongLiveList: [],
      RegisUnappList: [],
      total: 0,
      UnAppearTotal: 0,
      villageList: [],
      choseId: undefined,
      valueA: '',
      valueB:'',
      showTopOne: false,
      showTopTwo: false,
      show: false,
      id:Math.random(),
      imgUrl:'',
      val:'',
      imgUrlA:'',
      valA:''
    };
    this.initData()
  }
  initData(){
    Socket.on('updateTag', this.updateTag);
  }
  updateTag = result => {
    setTimeout(() => {
      this.onTypeChange();
    }, 500);
  
  }
  componentWillUnmount() {
    Socket.off('updateTag', this.updateTag);
  }
  requestData = (show) => {
    const { LongLivedStore } = this.props;
    if (!show) {
    LongLivedStore.searchOption = {
      villageIds: [],
      tagCodes: [],
      fuzzyContent: '',
      page: 1,
      pageSize: 24,
      collectionType: 1
    }
    }
    this.setState({
      loading: true
    })
    LongLivedStore.getListPersonalInformation(LongLivedStore.searchOption).then(res => {
      this.setState({
        LongLiveList: res.list,
        total: res.total,
        loading: false
      })

    })
  }
  requestUnappear = (show) => {
    const { LongLivedStore } = this.props;
    if (!show) {
      LongLivedStore.searchOptionUnappear = {
        villageIds: [],
        tagCodes: [],
        fuzzyContent: '',
        page: 1,
        pageSize: 24,
        collectionType: 0
      }
    }
    LongLivedStore.getListPersonalInformation(LongLivedStore.searchOptionUnappear).then(res => {
      this.setState({
        RegisUnappList: res.list,
        UnAppearTotal: res.total
      })
    })
  }
  FreShen = () => {
    this.requestData(true);
    this.requestUnappear(true);
  }
  onTypeChange = option => {
    const { LongLivedStore } = this.props;
    let { activeKey } = this.state;
    if (activeKey == 1) {
      this.setState({
        loading: true
      })
      LongLivedStore.getListPersonalInformation(LongLivedStore.searchOption).then(res => {
        this.setState({
          LongLiveList: res.list,
          loading: false,
          total: res.total
        })
      });
    }
    if (activeKey == 2) {
      this.setState({
        loading: true
      })
      LongLivedStore.getListPersonalInformation(LongLivedStore.searchOptionUnappear).then(res => {
        this.setState({
          RegisUnappList: res.list,
          loading: false,
          UnAppearTotal: res.total
        })
      });
    }
  };
  HandleDataPropcess = () => {
    const {LongLivedStore}=this.props;
    let {activeKey } = this.state;
    if(activeKey==1){
      LongLivedStore.searchOption.page=1;
    } else {
      LongLivedStore.searchOptionUnappear.page=1;
    }
this.onTypeChange();
  }
  onTopTypeChange = option => {
    const { LongLivedStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      LongLivedStore.searchOption.pageSize = option.pageSize;
      LongLivedStore.searchOption.page=1;
    } else {
      LongLivedStore.searchOptionUnappear.pageSize = option.pageSize;
      LongLivedStore.searchOptionUnappear.page=1;
    }
    this.onTypeChange()
  }
  onChange = (currentPage, pageSize) => {
    const { LongLivedStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      LongLivedStore.searchOption.page = currentPage;
      LongLivedStore.searchOption.pageSize = pageSize;
      this.setState({
        searchData: LongLivedStore.searchOption,
        loading: true
      });
      LongLivedStore.getListPersonalInformation(LongLivedStore.searchOption).then(res => {
        this.setState({
          LongLiveList: res.list,
          total: res.total,
          loading: false
        })
      });
    } else {
      LongLivedStore.searchOptionUnappear.page = currentPage;
      LongLivedStore.searchOptionUnappear.pageSize = pageSize;
      this.setState({
        searchData: LongLivedStore.searchOptionUnappear,
        loading: true
      });
      LongLivedStore.getListPersonalInformation(LongLivedStore.searchOptionUnappear).then(res => {
        this.setState({
          RegisUnappList: res.list,
          UnAppearTotal: res.total,
          loading: false
        })
      });
    }
  };
  handlePageJump = (data) => {
    const { TabStore, history } = this.props;
    const moduleName = 'Detail';
    const childModuleName = 'CommunityResidenceDetail';
    const state = { data };
    TabStore.goPage({ moduleName, childModuleName, history, state })
  }
  handleInputChange = e => {
    const { LongLivedStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      LongLivedStore.searchOption.fuzzyContent = e.target.value;
      this.setState({
        valueA:e.target.value
      })
    }
    else {
      LongLivedStore.searchOptionUnappear.fuzzyContent = e.target.value;
      this.setState({
        valueB:e.target.value
      })
    }
  }
  HandleNoVillageData = () => {
    this.setState({
      LongLiveList:[],
        RegisUnappList:[]
    })
  }
  handleTableKey = key => {
    const {LongLivedStore}=this.props;
    this.setState({
      activeKey: key
    });
  };
  componentDidMount() {
    const { history, LongLivedStore,CommunityEntryStore } = this.props;
    LongLivedStore.searchOption.fuzzyContent='';
    LongLivedStore.searchOption.faceFeature=null;
    LongLivedStore.searchOptionUnappear.fuzzyContent='';
    LongLivedStore.searchOptionUnappear.faceFeature='';
    const id = this.props.location.search.substring(4, 40);
    if (id.length > 0) {
      LongLivedStore.searchOption.villageIds = [id];
      LongLivedStore.searchOptionUnappear.villageIds = [id];
      this.setState({
        choseId: id,
        selectIf: false
      })
      this.requestData(true);
      this.requestUnappear(true);
    }else{
      this.requestData();
      this.requestUnappear();
    }
  }
  componentWillMount() {
    const {CommunityEntryStore}=this.props;
    window.addEventListener(
      'scroll',
      () => {
        let ell = this.refs.backonereal;
        let eml = this.refs.backtworeal;
        let scrollTop = ell ? ell.scrollTop : 0;
        let scrollTopTwo = eml ? eml.scrollTop : 0;
        if (scrollTop > 1000) {
          !this.state.showTopOne && this.setState({
            showTopOne: true
          })
        } else {
          this.state.showTopOne && this.setState({
            showTopOne: false
          })
        }
        if (scrollTopTwo > 1000) {
          !this.state.showTopTwo && this.setState({
            showTopTwo: true
          })
        } else {
          this.state.showTopTwo && this.setState({
            showTopTwo: false
          })
        }
      },
      true
    );
  /*   CommunityEntryStore.searchCommunityList({ page: 1, pageSize: 10}).then(res => {
      setTimeout(() => {
      this.setState({
        villageList:res.list
      })},0)
    }) */
  }
  getFeature = feature => {
    const {activeKey}=this.state;
    const {LongLivedStore}=this.props;
    if(activeKey==1){
      LongLivedStore.searchOption.faceFeature=feature;
    } else {
      LongLivedStore.searchOptionUnappear.faceFeature=feature;
    }
  }
  deleteImg = (type) => {
    const {activeKey}=this.state;
    const {LongLivedStore}=this.props;
    if(activeKey==1){
      LongLivedStore.searchOption.faceFeature=null;
      LongLivedStore.searchOption.fuzzyContent=null;//新加的
      LongLivedStore.searchOption.page=1;
    } else {
      LongLivedStore.searchOptionUnappear.faceFeature=null;
      LongLivedStore.searchOptionUnappear.fuzzyContent=null;//新加的
      LongLivedStore.searchOptionUnappear.page=1;
    }
    if(!type){
    this.onTypeChange();}
  }
  getInputValue = (val) => {
    const {activeKey}=this.state;
    const {LongLivedStore}=this.props;
    if(activeKey==1){
      LongLivedStore.searchOption.fuzzyContent=val;
    } else {
      LongLivedStore.searchOptionUnappear.fuzzyContent=val;
    }
  }
  backTop = type => {
    let ell = this.refs.backonereal;
    let eml = this.refs.backtworeal;
    if (type == 0) {
      ell.scrollTop = 0
    } else { eml.scrollTop = 0 }
  }
  handleSelctId = () => {
this.setState({
  id:Math.random(),
  value:'',
  val:'',
  imgUrl:'',
  imgUrlA:'',
  valA:''
})
  }
  handleNoImgUrl = (type) => {
    if(this.state.activeKey==1){
    if(type==1){
    this.setState({
    imgUrl:'',
    val:''
    })}
    else {
      this.setState({
        imgUrl:''
      })
    }}
    else {
      if(type==1){
        this.setState({
        imgUrlA:'',
        valA:''
        })}
        else {
          this.setState({
            imgUrlA:''
          })
        }
    }
  }
  handleYesImgUrl = (Url) => {
    if(this.state.activeKey==1){
  this.setState({
    imgUrl:Url,
  })} else {
    this.setState({
      imgUrlA:Url
    })
  }
  }
  handleVal= (value) => {
    if(this.state.activeKey==1)
    {this.setState({
      val:value
    })} else {
      this.setState({
        valA:value
      })
    }
  }
  onTypeChangeAnother = () => {
    const {activeKey}=this.state;
    const {LongLivedStore}=this.props;
    if(activeKey==1){
      LongLivedStore.searchOption.page=1;
    } else {
      LongLivedStore.searchOptionUnappear.page=1;
    }
    this.onTypeChange()
  }
  render() {
    const { selectIf, show, activeKey, LongLiveList, total, villageList,id,
       choseId, RegisUnappList, UnAppearTotal,valueA,valueB,imgUrl,val,imgUrlA,valA } = this.state;
       console.log(9999+"测试")
    const searchData =
      activeKey == 1
        ? this.props.LongLivedStore.searchOption
        : this.props.LongLivedStore.searchOptionUnappear;
    return (
      <div className="community_long_lived_alarm_box">
        <div className="community_left_total">
        <CommunityShowLeft 
        handleSelctId={this.handleSelctId}
        type={2}
        HandleNoVillageData={this.HandleNoVillageData} 
        requestData={this.requestData} 
        requestUnappear={this.requestUnappear} 
        choseId={choseId} 
        //selectIf={villageList.length>1?false:true}
        selectIf={selectIf}
        />
        </div>
        <div className="community_right_container">
          <AlarmHeadSearch
            searchData={searchData}
            total={activeKey == 1 ? total : UnAppearTotal}
            onTypeChange={this.onTopTypeChange}
            onChange={this.onChange}
            search={this.FreShen}
          />
          {this.state.showTopOne && (
            <Tooltip title="返回顶部">
              <div className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 0)} />
            </Tooltip>
          )}
          {this.state.showTopTwo && (
            <Tooltip title="返回顶部">
              <div className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 1)} />
            </Tooltip>
          )}
          <Tabs type="card" onChange={this.handleTableKey}>
            <TabPane tab="常住居民" key="1">
              <React.Fragment>
                {<div className="float-community">
                  <AlarmHeaderFilter
                    onTypeChange={this.onTypeChange}
                    activeKey={activeKey}
                    id={id}
                  />
                  <Upload 
                  getFeature={this.getFeature.bind(this)}
                  search={this.onTypeChangeAnother}
                  deleteImg={this.deleteImg}
                  activeKey={activeKey}
                  getInputValue={this.getInputValue}
                  handleYesImgUrl={this.handleYesImgUrl}
                  handleNoImgUrl={this.handleNoImgUrl}
                  handleVal={this.handleVal}
                  imgUrl={imgUrl}
                  val={val}
                  />
                   {/*  <Input
                      onChange={this.handleInputChange}
                      onPressEnter={this.HandleDataPropcess}
                      placeholder="请输入关键字按Enter键搜索"
                      value={valueA}
                      prefix={
                        <Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />
                      }
                    /> */}
                  
                </div>}
                <div className="float-communty-tab-scroll" ref="backonereal">
                  {LongLiveList&&LongLiveList.length > 0 ? <Spin spinning={this.state.loading} size="large">
                    <div className="back-top-register">
                      {LongLiveList.map((v, i) => (
                        <CommunityCard data={v} handlePageJump={this.handlePageJump.bind(this,v)} key={i} />
                      ))}
                      <div style={{ width: "348px", height: "0", marginLeft: '20px' }}></div>
                      <div style={{ width: "348px", height: "0", marginLeft: '20px' }}></div>
                      <div style={{ width: "348px", height: "0", marginLeft: '20px' }}></div>
                      <div className="community-footer-page">
                        <Pagination
                          total={total}
                          onChange={this.onChange}
                          onShowSizeChange={this.onChange}
                          current={searchData.page}
                          pageSize={searchData.pageSize}
                          pageSizeOptions={['24', '36', '48', '72', '96']}
                        />
                      </div>
                    </div>
                  </Spin> : <React.Fragment>{this.state.loading ? <div style={{ position: 'absolute', left: "48%", top: "13%" }} ><Spin size="large" /></div> : <NoData />}</React.Fragment>}
                </div>
              </React.Fragment>
            </TabPane>
            <TabPane tab="疑似已迁出" key="2">
              <React.Fragment>
                {<div className="float-community">
                  <AlarmHeaderFilter
                    onTypeChange={this.onTypeChange}
                    activeKey={activeKey}
                    id={id}
                  />
                  <UploadA
                  getFeatureB={this.getFeature.bind(this)}
                  searchB={this.onTypeChangeAnother}
                  deleteImgB={this.deleteImg}
                  activeKey={activeKey}
                  getInputValueB={this.getInputValue}
                  imgUrl1={imgUrlA}
                  val={valA}
                  handleYesImgUrl={this.handleYesImgUrl}
                  handleNoImgUrl={this.handleNoImgUrl}
                  handleVal={this.handleVal}
                  />
                   {/*  <Input
                      onChange={this.handleInputChange}
                      onPressEnter={this.HandleDataPropcess}
                      placeholder="请输入关键字按Enter键搜索"
                      value={valueB}
                      prefix={
                        <Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />
                      }
                    /> */}
                </div>}
                <div className="float-communty-tab-scroll" ref="backtworeal">
                  {RegisUnappList&&RegisUnappList.length > 0 ? <Spin spinning={this.state.loading} size="large">
                    <div className="back-top-register">
                      {RegisUnappList.map(v => (
                        <RegisButCard data={v} handlePageJump={this.handlePageJump.bind(this, v)} key={v.id} />
                      ))}
                      <div style={{ width: "348px", height: "0", marginLeft: '20px' }}></div>
                      <div style={{ width: "348px", height: "0", marginLeft: '20px' }}></div>
                      <div style={{ width: "348px", height: "0", marginLeft: '20px' }}></div>
                      <div className="community-footer-page">
                        <Pagination
                          total={UnAppearTotal}
                          onChange={this.onChange}
                          onShowSizeChange={this.onChange}
                          current={searchData.page}
                          pageSize={searchData.pageSize}
                          pageSizeOptions={['24', '36', '48', '72', '96']}
                        />
                      </div>
                    </div>
                  </Spin> : <NoData />}
                </div>
              </React.Fragment>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default LongLivedPerson;
