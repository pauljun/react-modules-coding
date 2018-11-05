import React, { Component } from 'react';
import { Icon, Spin, Input, Checkbox, Popover, Tabs, BackTop, Tooltip } from 'antd';
import CommunityShow from '../../components/PersonManage/CommunityShow/index';
import CommunityCard from './components/RegisButNoCard/index';
import Upload from '../../..//../components/UploadInput/index';
import AlarmHeadSearch from '../../../PersonnelControl/Components/alarm/components/alarmHeaderSearch';
import AlarmHeaderFilter from './components/TopSelect/alarmHeaderFilter';
import Pagination from '../../../../components/Pagination/index';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import CommunityShowLeft from '../../components/PersonManage/CommunityShowLeft'
import { withRouter } from 'react-router-dom';
import NoData from '../../../../components/NoData/index';
import Socket from '../../../../libs/Socket';
import LogsComponent from 'src/components/LogsComponent';
import Upload1 from '../../components/PersonManage/UploadInput/index'

import './index.scss';
const TabPane = Tabs.TabPane;

@LogsComponent()
@withRouter
@BusinessProvider('FloatPersonStore', 'CommunityEntryStore', 'TabStore')
class FloatPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      FloatVillageList: [],
      NewFaceList: [],
      UnLongExistList: [],
      activeKey: '1',
      loading: true,
      total: 0,
      anotherTotal: 0,
      choseId: undefined,
      showTopOne: false,
      showTopTwo: false,
      value: '',
      show: false,
      id:Math.random(),
      SpopHoverType:false,
      imgUrl:'',
      val:'',
      imgUrlA:'',
      valA:''
    };
    this.initData()
  }
  initData(){
    Socket.on('updateTag', this.updateFloatTag);
  }
  updateFloatTag = () => {
    setTimeout(() => {
      this.onTypeChange();
    },500)
  }
  componentWillUnmount(){
    Socket.off('updateTag',this.updateFloatTag);
  }
  /**请求小区列表数据 */
  requestVillage = () => {
    const { CommunityEntryStore } = this.props;
    CommunityEntryStore.searchCommunityList({ page: 1, pageSize: 10 }).then(
      res => {
        this.setState({
          FloatVillageList: res.list
        });
      }
    );
  };
  requestData = show => {
    const { FloatPersonStore } = this.props;
    if (!show) {
      FloatPersonStore.FloatsearchOption = {
        villageIds: [],
        fuzzyContent: '',
        peroidType: 0,
        page: 1,
        pageSize: 24,
        startTime: undefined,
        endTime: undefined,
        sortType: '',
        floatingPeopleType: 0
      };
    }
    this.setState({
      loading: true
    });
    FloatPersonStore.getListFlowFace(FloatPersonStore.FloatsearchOption).then(
      res => {
        this.setState({
          NewFaceList: res.list,
          total: res.total,
          loading: false
        });
      }
    );
  };
  requestDataExist = show => {
    const { FloatPersonStore } = this.props;
    if (!show) {
      FloatPersonStore.FloatsearchOptionUnappear = {
        villageIds: [],
        fuzzyContent: '',
        peroidType: 0,
        page: 1,
        pageSize: 24,
        startTime: undefined,
        endTime: undefined,
        sortType: '',
        floatingPeopleType: 1
      };
    }
    FloatPersonStore.getListFlowFace(FloatPersonStore.FloatsearchOptionUnappear).then(res => {
      this.setState({
        UnLongExistList: res.list,
        anotherTotal: res.total
      });
    });
  };
  FreShen = () => {
    this.requestData(true);
    this.requestDataExist(true);
  };
  handlePageJump = data => {
    const { TabStore, history } = this.props;
    const moduleName = 'Detail';
    const childModuleName = 'CommunityFlowDetail';
    const state = { data };
    TabStore.goPage({ moduleName, childModuleName, history, state });
  };
  onTypeChange = option => {
    const { FloatPersonStore } = this.props;
    let { activeKey } = this.state;
    if (activeKey == 1) {
      this.setState({
        loading: true
      });
      FloatPersonStore.getListFlowFace(FloatPersonStore.FloatsearchOption).then(res => {
          this.setState({
            NewFaceList: res.list,
            total: res.total,
            loading: false
          });
        }
      );
    }
    if (activeKey == 2) {
      this.setState({
        loading: true
      });
      FloatPersonStore.getListFlowFace(
        FloatPersonStore.FloatsearchOptionUnappear
      ).then(res => {
        this.setState({
          UnLongExistList: res.list,
          loading: false,
          anotherTotal: res.total
        });
      });
    }
  };
  onTopTypeChange = option => {
    const { FloatPersonStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      FloatPersonStore.FloatsearchOption.page=1;
      FloatPersonStore.FloatsearchOption.pageSize = option.pageSize;
    } else {
      FloatPersonStore.FloatsearchOptionUnappear.pageSize = option.pageSize;
      FloatPersonStore.FloatsearchOptionUnappear.page=1;
    }
    this.onTypeChange();
  };
  onChange = (currentPage, pageSize) => {
    const { FloatPersonStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      FloatPersonStore.FloatsearchOption.page = currentPage;
      FloatPersonStore.FloatsearchOption.pageSize = pageSize;
      this.setState({
        searchData: FloatPersonStore.FloatsearchOption,
        loading: true
      });
      FloatPersonStore.getListFlowFace(FloatPersonStore.FloatsearchOption).then(res => {
          this.setState({
            NewFaceList: res.list,
            loading: false,
            total: res.total
          });
        }
      );
    } else {
      FloatPersonStore.FloatsearchOptionUnappear.page = currentPage;
      FloatPersonStore.FloatsearchOptionUnappear.pageSize = pageSize;
      this.setState({
        searchData: FloatPersonStore.FloatsearchOptionUnappear,
        loading: true
      });
      FloatPersonStore.getListFlowFace(
        FloatPersonStore.FloatsearchOptionUnappear
      ).then(res => {
        this.setState({
          UnLongExistList: res.list,
          loading: false,
          anotherTotal: res.total
        });
      });
    }
  };
  handleTableKey = key => {
    this.setState({
      activeKey: key
    });
  };
  handleVillageSelect = id => {
    const { FloatPersonStore } = this.props;
    FloatPersonStore.FloatsearchOption.villageIds = [id];
    FloatPersonStore.FloatsearchOptionUnappear.villageIds = [id];
    //this.onTypeChange();
    this.requestData(true);
    this.requestDataExist(true);
    this.setState({
      show: true,
      choseId: id,
      selectIf: false
    });
  };
  handleSelect = e => {
    const { FloatPersonStore } = this.props;
    FloatPersonStore.FloatsearchOption.villageIds = [];
    FloatPersonStore.FloatsearchOptionUnappear.villageIds = [];
    this.setState({
      selectIf: true /* !this.state.selectIf */,
      choseId: undefined,
      show: false
    });
    this.requestVillage();
    if (!this.state.selectIf) {
      this.requestData(true);
      this.requestDataExist(true);
      this.setState({
        value: ''
      })
    }
  };
  handleInputChange = e => {
    const { FloatPersonStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      FloatPersonStore.FloatsearchOption.fuzzyContent = e.target.value;
    } else {
      FloatPersonStore.FloatsearchOptionUnappear.fuzzyContent = e.target.value;
    }
  };
  handleAnotherInput = e => {
    const { CommunityEntryStore, FloatPersonStore } = this.props;
    const value = this.state.value;
    CommunityEntryStore.searchCommunityList({page: 1,pageSize: 10,keyWord: value}).then(res => {
      this.setState({
        choseId: undefined,
        selectIf: false,
        FloatVillageList: res.list
       // show: false
      })
      if(res.list.length==0){
        this.setState({
          NewFaceList: [],
          UnLongExistList: [],
        })
        return
      }
      if (value.length == 0) {
        this.setState({
          selectIf: true
        })
      }
      FloatPersonStore.FloatsearchOption.villageIds = res.list.map(v => v.id);
      FloatPersonStore.FloatsearchOptionUnappear.villageIds = res.list.map(v => v.id);
      this.requestData(true);
      this.requestDataExist(true);
    });
  };
  componentWillMount() {
    window.addEventListener(
      'scroll',
      () => {
        let el = this.refs.backone;
        let em = this.refs.backtwo;
        let scrollTop = el ? el.scrollTop : 0;
        let scrollTopTwo = em ? em.scrollTop : 0;
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
  }
  componentDidMount() {
    const { history, FloatPersonStore } = this.props;
    const id = this.props.location.search.substring(4, 20);
    FloatPersonStore.FloatsearchOption.fuzzyContent='';
    FloatPersonStore.FloatsearchOption.faceFeature=null;
    FloatPersonStore.FloatsearchOptionUnappear.fuzzyContent='';
    FloatPersonStore.FloatsearchOptionUnappear.faceFeature=null;

    if (id.length > 0) {
      FloatPersonStore.FloatsearchOption.villageIds = [id];
      FloatPersonStore.FloatsearchOptionUnappear.villageIds = [id];
      this.setState({
        //show: true,
        choseId: id,
        selectIf: false
      })
      this.requestData(true);
      this.requestDataExist(true);
    }else{
      this.requestData();
      this.requestDataExist();
    }
    //this.requestVillage();
  }
  backTop = type => {
    let el = this.refs.backone;
    let em = this.refs.backtwo;
    if (type == 0) {
      el.scrollTop = 0
    } else { em.scrollTop = 0 }
  }
  handleChange = e => {
    this.setState({
      value: e.target.value
    })
  }
  HandleNoVillageData = () => {
    this.setState({
      NewFaceList:[],
      UnLongExistList:[]
    })
  }
  handleSelctId = () => {
    this.setState({
     id:Math.random(),
     imgUrl:'',
     val:'',
     imgUrlA:'',
     valA:''
    })
  }
  showDateDoubleSelect = (type) => {
    if(type==1){
      this.setState({
        SpopHoverType:true
      })
    }
    else {
      this.setState({
        SpopHoverType:false
      })
    }
  }
  getFeature = feature => {
    const {activeKey}=this.state;
    const {FloatPersonStore}=this.props;
    if(activeKey==1){
      FloatPersonStore.FloatsearchOption.faceFeature=feature;
     // FloatPersonStore.FloatsearchOption.page=1;
    } else {
      FloatPersonStore.FloatsearchOptionUnappear.faceFeature=feature;
     // FloatPersonStore.FloatsearchOptionUnappear.page=1;
    }
  }
  deleteImg = (type) => {
    const {activeKey}=this.state;
    const {FloatPersonStore}=this.props;
    if(activeKey==1){
      FloatPersonStore.FloatsearchOption.faceFeature=null;
      FloatPersonStore.FloatsearchOption.fuzzyContent=null;
      FloatPersonStore.FloatsearchOption.page=1;
    } else {
      FloatPersonStore.FloatsearchOptionUnappear.faceFeature=null;
      FloatPersonStore.FloatsearchOptionUnappear.fuzzyContent=null;
      FloatPersonStore.FloatsearchOptionUnappear.page=1;
    }
    if(!type){
      this.onTypeChange();}
  }
  getInputValue = (val) => {
    const {activeKey}=this.state;
    const {FloatPersonStore}=this.props;
    if(activeKey==1){
      FloatPersonStore.FloatsearchOption.fuzzyContent=val;
     // FloatPersonStore.FloatsearchOption.page=1;
    } else {
      FloatPersonStore.FloatsearchOptionUnappear.fuzzyContent=val;
      //FloatPersonStore.FloatsearchOptionUnappear.page=1;
    }
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
    const {FloatPersonStore}=this.props;
    if(activeKey==1){
      FloatPersonStore.FloatsearchOption.page=1;
    } else {
      FloatPersonStore.FloatsearchOptionUnappear.page=1;
    }
    this.onTypeChange()
  }
  render() {
    const {selectIf,activeKey,NewFaceList,total,FloatVillageList,UnLongExistList = [],anotherTotal,choseId,id,
      showTopOne,showTopTwo,loading,imgUrl,val,imgUrlA,valA} = this.state;
    const searchData =activeKey == 1
        ? this.props.FloatPersonStore.FloatsearchOption
        : this.props.FloatPersonStore.FloatsearchOptionUnappear;
    return (
      <div className="community_float_alarm_box">
        <div className="community_left_total">
        <CommunityShowLeft
        handleSelctId={this.handleSelctId}
        type={1}
        HandleNoVillageData={this.HandleNoVillageData}
        requestData={this.requestData} 
        requestUnappear={this.requestDataExist} 
        choseId={choseId} selectIf={selectIf}/>
          {/* <div className="community-title-real" style={{ margin: 0 }}>
            <div>流动人口管理</div>

            <div className="community-checkbox">
              全部显示
              <span style={{ paddingLeft: '6px' }}>
                <Popover
                  overlayClassName={'checkbox-span-pop-community'}
                  placement="bottom"
                  content={
                    selectIf ? (
                      <span>请选择下面列表查看单个小区常住人口</span>
                    ) : (
                        <span>全部显示小区常住人口</span>
                      )
                  }
                >
                  <Checkbox
                    onChange={this.handleSelect}
                    checked={this.state.selectIf}
                  />
                </Popover>
              </span>
            </div>
          </div>
          <div className="community-input">
            <Input
              prefix={<Icon type="search" />}
              placeholder="请输入小区名称按Enter键搜索"
              onPressEnter={this.handleAnotherInput}
              onChange={this.handleChange}
              value={this.state.value}
            />
          </div>
          <div className="community-exp">
            {FloatVillageList&&FloatVillageList.map((v, index) => (
              <CommunityShow
                show={this.state.show}
                key={index}
                choseId={choseId}
                data={v}
                handleVillageSelect={this.handleVillageSelect}
                type={1}
              />
            ))}
          </div> */}
        </div>
        <div className="community_right_container">
          <AlarmHeadSearch
            searchData={searchData}
            total={activeKey == 1 ? total : anotherTotal}
            onTypeChange={this.onTopTypeChange}
            onChange={this.onChange}
            search={this.FreShen}
          />
          {showTopOne && (
            <Tooltip title="返回顶部">
              <div className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 0)} />
            </Tooltip>
          )}
          {showTopTwo && (
            <Tooltip title="返回顶部">
              <div className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 1)} />
            </Tooltip>
          )}
          <Tabs type="card" onChange={this.handleTableKey}>
            <TabPane tab="新面孔" key="1">
              <React.Fragment>
                <div className="float-community-unregistered">
                  {/* <div className="float-input-search"> */}
                    {/*   <Input
                    //value={searchData.captureUids ? searchData.captureUids : '' }
                    onChange={this.handleInputChange}
                    placeholder="请输入关键字按Enter键搜索"
                    prefix={
                      <Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />
                    }
                    onPressEnter={this.onTypeChange}
                  /> */}
                  {/* </div> */}
                  <AlarmHeaderFilter
                    onTypeChange={this.onTypeChange}
                    activeKey={activeKey}
                    id={id}
                  />
                  <Upload
                  getFeature={this.getFeature}
                  deleteImg={this.deleteImg}
                  search={this.onTypeChangeAnother}
                  activeKey={activeKey}
                  getInputValue={this.getInputValue}
                  handleYesImgUrl={this.handleYesImgUrl}
                  handleNoImgUrl={this.handleNoImgUrl}
                  handleVal={this.handleVal}
                  imgUrl={imgUrl}
                  val={val}
                  />
                </div>
                <div className="float-communty-tab-scroll-unregister" ref="backone">
                  {NewFaceList && NewFaceList.length > 0 ? (
                    <Spin spinning={loading} size="large">
                      <div className="query-backTop">
                        {NewFaceList.map((v,i) => (
                          <CommunityCard
                          key={i}
                            data={v}
                            handlePageJump={this.handlePageJump.bind(this, v)}
                          />
                        ))}
                        <div className="shut-alarm-button-unregistered-community"
                        />
                        <div className="shut-alarm-button-unregistered-community"
                        />
                        <div className="shut-alarm-button-unregistered-community"

                        />
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
                    </Spin>
                  ) : (
                      <React.Fragment>{this.state.loading ? <div style={{ position: 'absolute', left: "48%", top: "23%" }} ><Spin size="large" /></div> : <NoData />}</React.Fragment>
                    )}
                </div>
              </React.Fragment>
            </TabPane>
            <TabPane tab="疑似新居民" key="2">
              <div className="float-community-unregistered">
               {/*  <div className="float-input-search"> */}
                  {/* <Input
                    onPressEnter={this.handleAnotherInput}
                    placeholder="请输入关键字搜索"

                    prefix={
                      <Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />
                    }
                  /> */}
               {/*  </div> */}
                <AlarmHeaderFilter onTypeChange={this.onTypeChange} activeKey={activeKey} id={id} />
                <Upload1
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
              </div>
              <div className="float-communty-tab-scroll-unregister" ref="backtwo">
                {UnLongExistList && UnLongExistList.length > 0 ? (
                  <Spin spinning={loading} size="large">
                    <div className="query-backTop" >
                      {UnLongExistList.map((v,i) => (
                        <CommunityCard data={v} handlePageJump={this.handlePageJump.bind(this, v)} key={i} />
                      ))}
                      <div className="shut-alarm-button-unregistered-community"/>
                      <div className="shut-alarm-button-unregistered-community"/>
                      <div className="shut-alarm-button-unregistered-community"/>
                      <div className="shut-alarm-button-unregistered-community"/>
                      <div className="community-footer-page">
                        <Pagination
                          total={anotherTotal}
                          onChange={this.onChange}
                          onShowSizeChange={this.onChange}
                          current={searchData.page}
                          pageSize={searchData.pageSize}
                          pageSizeOptions={['24', '36', '48', '72', '96']}
                        />
                      </div>
                    </div>
                  </Spin>
                ) : (
                    <NoData />
                  )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default FloatPerson;
