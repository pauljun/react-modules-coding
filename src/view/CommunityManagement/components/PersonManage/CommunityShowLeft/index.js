import React from 'react';
import { Popover, Checkbox, Input, Icon } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import CommunityShow from '../CommunityShow/index';
import IconFont from "src/components/IconFont"
@BusinessProvider(
  'LongLivedStore',
  'FloatPersonStore',
  'CommunityEntryStore',
  'TabStore'
)
export default class CommunityShowLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      choseId: undefined,
      show: false,
      villageList: [],
      value: '',
      passVillageList: []
    };
    this.requestVillage();
    this.i = 0;
  }
  requestVillage = () => {
    const { CommunityEntryStore } = this.props;
    CommunityEntryStore.searchCommunityList({ page: 1, pageSize: 10 }).then(
      res => {
        this.setState({
          villageList: res.list,
          passVillageList: res.list
        });
      }
    );
  };
  handleVillageSelect = id => {
    const { LongLivedStore, type, FloatPersonStore } = this.props;
    const { passVillageList } = this.state;
    this.props.handleSelctId();
    if (type == 2) {
      LongLivedStore.searchOption = Object.assign(
        {},
        { villageIds: [id] },
        {
          tagCodes: [],
          fuzzyContent: '',
          page: 1,
          pageSize: 24,
          collectionType: 1
        }
      );
      LongLivedStore.searchOptionUnappear = Object.assign(
        {},
        { villageIds: [id] },
        {
          tagCodes: [],
          fuzzyContent: '',
          page: 1,
          pageSize: 24,
          collectionType: 0
        }
      );
    } else {
      FloatPersonStore.FloatsearchOption = Object.assign(
        {},
        { villageIds: [id] },
        {
          fuzzyContent: '',
          peroidType: 0,
          page: 1,
          pageSize: 24,
          startTime: undefined,
          endTime: undefined,
          sortType: '',
          floatingPeopleType: 0
        }
      );
      FloatPersonStore.FloatsearchOptionUnappear = Object.assign(
        {},
        { villageIds: [id] },
        {
          fuzzyContent: '',
          peroidType: 0,
          page: 1,
          pageSize: 24,
          startTime: undefined,
          endTime: undefined,
          sortType: '',
          floatingPeopleType: 1
        }
      );
    }
    //this.onTypeChange();
    this.props.requestData(true);
    this.props.requestUnappear(true);
    if (passVillageList.length > 1) {
      this.setState({
        selectIf: false
      });
    } else {
      this.setState({
        selectIf: true
      });
    }
    this.setState({
      choseId: id,
      show: true
    });
  };
  handleAnotherInput = e => {
    const {
      CommunityEntryStore,
      LongLivedStore,
      FloatPersonStore,
      type
    } = this.props;
    const { value, passVillageList } = this.state; /* e.target.value */
    this.props.handleSelctId();
    CommunityEntryStore.searchCommunityList({
      page: 1,
      pageSize: 10,
      keyWord: value
    }).then(res => {
      if (res.list.length == passVillageList.length) {
        this.setState({
          selectIf: true
        });
      } else {
        this.setState({
          selectIf: false
        });
      }
      this.setState({
        choseId: undefined,
        show: false,
        villageList: res.list
      });
      if (res.list.length == 0) {
        this.props.HandleNoVillageData();
        return;
      }
      if (value.length == 0) {
        this.setState({
          selectIf: true
        });
      }
      if (type == 2) {
        LongLivedStore.searchOption = Object.assign(
          {},
          { villageIds: res.list.map(v => v.id) },
          {
            tagCodes: [],
            fuzzyContent: '',
            page: 1,
            pageSize: 24,
            collectionType: 1
          }
        );
        LongLivedStore.searchOptionUnappear = Object.assign(
          {},
          { villageIds: res.list.map(v => v.id) },
          {
            tagCodes: [],
            fuzzyContent: '',
            page: 1,
            pageSize: 24,
            collectionType: 0
          }
        );
        /* LongLivedStore.searchOption.villageIds = res.list.map(v => v.id);
      LongLivedStore.searchOptionUnappear.villageIds = res.list.map(v => v.id); */
      } else {
        FloatPersonStore.FloatsearchOption = Object.assign(
          {},
          { villageIds: res.list.map(v => v.id) },
          {
            fuzzyContent: '',
            peroidType: 0,
            page: 1,
            pageSize: 24,
            startTime: undefined,
            endTime: undefined,
            sortType: '',
            floatingPeopleType: 0
          }
        );
        FloatPersonStore.FloatsearchOptionUnappear = Object.assign(
          {},
          { villageIds: res.list.map(v => v.id) },
          {
            fuzzyContent: '',
            peroidType: 0,
            page: 1,
            pageSize: 24,
            startTime: undefined,
            endTime: undefined,
            sortType: '',
            floatingPeopleType: 1
          }
        );
        /* FloatPersonStore.FloatsearchOption.villageIds = res.list.map(v => v.id);
        FloatPersonStore.FloatsearchOptionUnappear.villageIds = res.list.map(v => v.id); */
      }
      this.props.requestData(true);
      this.props.requestUnappear(true);
    });
  };
  handleSelect = e => {
    const { LongLivedStore, type, FloatPersonStore } = this.props;
    const { villageList } = this.state;
    this.props.handleSelctId();
    if (type == 2) {
      LongLivedStore.searchOption = {
        villageIds: [],
        tagCodes: [],
        fuzzyContent: '',
        page: 1,
        pageSize: 24,
        collectionType: 1
      };
      LongLivedStore.searchOptionUnappear = {
        villageIds: [],
        tagCodes: [],
        fuzzyContent: '',
        page: 1,
        pageSize: 24,
        collectionType: 0
      };
    } else {
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
    this.setState({
      selectIf: true,
      choseId: undefined,
      show: false
    });
    this.requestVillage();
    if (!this.state.selectIf) {
      this.props.requestData(true);
      this.props.requestUnappear(true);
      this.setState({
        value: ''
      });
    }
  };
  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.choseId && nextProps.selectIf == false) {
    /* if (nextProps.choseId) { */
      /* if (this.i < 4) { */
        if (this.i < 1) {
        this.setState({
          choseId: nextProps.choseId,
          selectIf: nextProps.selectIf
        });
      }
      this.i = this.i + 1;
    }
  }
  render() {
    const { selectIf, show, choseId, villageList } = this.state;
    const { type } = this.props;
    return (
      <React.Fragment>
        <div className="community-title-real" style={{ margin: 0 }}>
          <div>{type == 2 ? '常住人口管理' : '流动人口管理'}</div>

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
            prefix={<IconFont type={'icon-Search_Main'} theme="outlined" style={{ fontSize: '16px', color: 'rgba(0,0,0,.5)' }} />}
            placeholder="请输入小区名称按Enter搜索"
            onPressEnter={this.handleAnotherInput}
            onChange={this.handleChange}
            value={this.state.value}
          />
        </div>
        <div className="community-exp">
          {villageList.map((v, index) => (
            <CommunityShow
              type={type}
              show={show}
              key={index}
              data={v}
              choseId={choseId}
              handleVillageSelect={this.handleVillageSelect}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}
