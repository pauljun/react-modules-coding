import React from 'react';
import { Select, Radio, Popover } from 'antd';
import RangePicker from '../../../../../components/RangePicker/index';
import moment from 'moment';
import IconFont from 'src/components/IconFont';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

import './alarmHeaderFilter.scss';

const Option = Select.Option;
@BusinessProvider('LongLivedStore')
class AlarmHeaderFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateBegin: undefined,
      dateEnd: undefined,
      showDate: false,
      SpopHoverType:false
    };
  }

  // 标签筛选
  handleTimeSort = value => {
    const {LongLivedStore,onTypeChange,activeKey}=this.props;
    if(activeKey==1){
      LongLivedStore.searchOption.page=1;
    switch(value){
      case 1:
      LongLivedStore.searchOption.tagCodes=[];
      break;
      case 2:
      LongLivedStore.searchOption.tagCodes=['118602'];
      break;
      case 3:
      LongLivedStore.searchOption.tagCodes=['118701'];
      break;
      case 4:
      LongLivedStore.searchOption.tagCodes=['118604'];
      break;
      case 5:
      LongLivedStore.searchOption.tagCodes=['118601'];
      break;
      case 6:
      LongLivedStore.searchOption.tagCodes=['118702'];
      break;
      case 7:
      LongLivedStore.searchOption.tagCodes=['118703'];
      break;
      case 8:
      LongLivedStore.searchOption.tagCodes=['118603'];
      break;
      case 9:
      LongLivedStore.searchOption.tagCodes=['0'];
      break;
      default:return;
    }}
    else{
      LongLivedStore.searchOptionUnappear.page=1;
      switch(value){
        case 1:
        LongLivedStore.searchOptionUnappear.tagCodes=[];
        break;
        case 2:
        LongLivedStore.searchOptionUnappear.tagCodes=['118602'];
        break;
        case 3:
        LongLivedStore.searchOptionUnappear.tagCodes=['118701'];
        break;
        case 4:
        LongLivedStore.searchOptionUnappear.tagCodes=['118604'];
        break;
        case 5:
        LongLivedStore.searchOptionUnappear.tagCodes=['118601'];
        break;
        case 6:
        LongLivedStore.searchOptionUnappear.tagCodes=['118702'];
        break;
        case 7:
        LongLivedStore.searchOptionUnappear.tagCodes=['118703'];
        break;
        case 8:
        LongLivedStore.searchOptionUnappear.tagCodes=['118603'];
        break;
        case 9:
        LongLivedStore.searchOptionUnappear.tagCodes=['0'];
        break;
        default:return;
      }
    }
    onTypeChange();
  };

  // 类别筛选
   handleTypeChange = value => {
    let { onTypeChange,LongLivedStore,activeKey } = this.props;
    if(activeKey==1){
     switch(value){
      case 1: 
      LongLivedStore.searchOption.sortType=1;
      break;
      case 2: 
      LongLivedStore.searchOption.sortType=2;
      break;
      case 3: 
      LongLivedStore.searchOption.sortType=3;
      break;
      default:return;
    } }
    else {
      switch(value){
        case 1: 
        LongLivedStore.searchOptionUnappear.sortType=1;
        break;
        case 2: 
        LongLivedStore.searchOptionUnappear.sortType=2;
        break;
        case 3: 
        LongLivedStore.searchOptionUnappear.sortType=3;
        break;
        default:return;
      } 
    }
    onTypeChange()
  }; 
/**时间筛选 */
  chooseTime =(activeKey,e) => {
    
    let { onTypeChange,LongLivedStore } = this.props;
    console.log(activeKey+"明月刀")
    let value = e.target.value;
    if(value==2){
      this.setState({
        SpopHoverType:true
      })
      return
    }
    else{
      this.setState({
        SpopHoverType:false,
        dateBegin: null,
				dateEnd: null
      })
    }
    if(activeKey==1){
    switch (value - 0) {
      case 0:
        delete LongLivedStore.searchOption.startTime;
        delete LongLivedStore.searchOption.endTime;
        break;
      case 1:
      LongLivedStore.searchOption.startTime = moment(moment(Date.now()).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
      LongLivedStore.searchOption.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 3:
      LongLivedStore.searchOption.startTime = moment(moment(Date.now()).valueOf() - 3 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        LongLivedStore.searchOption.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 7:
      LongLivedStore.searchOption.startTime = moment(moment(Date.now()).valueOf() - 7 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        LongLivedStore.searchOption.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
        break;
      default:return;
    }}
    else{
      switch (value - 0) {
        case 0:
          delete LongLivedStore.searchOptionUnappear.startTime;
          delete LongLivedStore.searchOptionUnappear.endTime;
          break;
        case 1:
        LongLivedStore.searchOptionUnappear.startTime = moment(moment(Date.now()).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
        LongLivedStore.searchOptionUnappear.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
          break;
        case 3:
        LongLivedStore.searchOptionUnappear.startTime = moment(moment(Date.now()).valueOf() - 3 * 24 * 60 * 60 * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          LongLivedStore.searchOptionUnappear.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
          break;
        case 7:
        LongLivedStore.searchOptionUnappear.startTime = moment(moment(Date.now()).valueOf() - 7 * 24 * 60 * 60 * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          LongLivedStore.searchOptionUnappear.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
          break;
        default:return;
      }
    }
    onTypeChange();
  };
  timeChange = (type, value) => {
    let { searchData, onTypeChange,LongLivedStore,activeKey } = this.props;
    let { dateBegin, dateEnd } = this.state;
    let startTime = moment(new Date(dateBegin));
    let endTime = null;
    if (type === 'startTime') {
      startTime = moment(new Date(value));
      this.setState({ dateBegin: startTime });
    } else {
      endTime = moment(new Date(value));
      this.setState({ dateEnd: endTime });
    }
    if (endTime === null) {
      endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    } else {
      endTime = endTime.format('YYYY-MM-DD HH:mm:ss');
    }
    startTime = startTime.format('YYYY-MM-DD HH:mm:ss');
   // let option = searchData;
   if(activeKey==1){
    LongLivedStore.searchOption.endTime = endTime;
    LongLivedStore.searchOption.startTime = startTime;}
    else{
      LongLivedStore.searchOptionUnappear.endTime = endTime;
      LongLivedStore.searchOptionUnappear.startTime = startTime;
    }
    onTypeChange();
  };
  render() {
    let { showDate, dateBegin, dateEnd, SpopHoverType } = this.state;
    let {activeKey,id} = this.props;
    return (
      <div className="community-another-alarm_header_filter">
        {/* <Radio.Group
          className="header_filter_radio"
          defaultValue={0}
          //value={searchData.timeType === null ? 'null' : searchData.timeType}
          buttonStyle="solid"
          onChange={this.chooseTime.bind(this,activeKey)}
        >
          <Radio value={0}>不限</Radio>
          <Radio value={1}>24小时</Radio>
          <Radio value={3}>3天</Radio>
          <Radio value={7}>一周</Radio>
          {SpopHoverType ? (
            <Popover
              overlayClassName={'radio_poppver'}
              defaultVisible={true}
              content={
                <RangePicker
                  onChange={this.timeChange}
                  startTime={dateBegin}
                  endTime={dateEnd}
                />
              }
              trigger="hover"
              placement="bottom"
            >
              <Radio value={2}>自定义</Radio>
            </Popover>
          ) : (
            <Radio value={2}>自定义</Radio>
          )}
        </Radio.Group> */}
        <Select
          key={id}
          dropdownClassName="header_filter_select_time_downwrap"
          className="header_filter_time_select"
          style={{ width: 148 }}
         // value={searchData.sortType}
          onChange={this.handleTimeSort}
          defaultValue={1}
        >
          <Option value={1}>全部标签</Option>
          <Option value={2}>空巢老人</Option>
          <Option value={3}>昼伏夜出</Option>
          <Option value={4}>快递</Option>
          <Option value={5}>外卖</Option>
          <Option value={6}>早出晚归</Option>
          <Option value={7}>足不出户</Option>
          <Option value={8}>工作人员</Option>
          <Option value={9}>其他</Option>
        </Select>
       {/*  <Select
          dropdownClassName="header_filter_select_type_downwrap"
          className="header_filter_type_select"
          style={{ width: 110 }}
          onChange={this.handleTypeChange}
          defaultValue={1}
        >
          <Option value={1}>姓名排序</Option>
          <Option value={2}>抓拍次数排序</Option>
          <Option value={3}>最后抓拍时间排序</Option>
        </Select> */}
      </div>
    );
  }
}

export default AlarmHeaderFilter;
