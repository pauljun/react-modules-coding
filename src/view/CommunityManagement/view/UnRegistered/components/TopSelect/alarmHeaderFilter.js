import React from 'react';
import { Select, Radio, Popover,Button } from 'antd';
import RangePicker from '../../../../../../components/RangePicker/index';
import moment from 'moment';
import IconFont from 'src/components/IconFont';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

import './alarmHeaderFilter.scss';

const Option = Select.Option;
@BusinessProvider('FloatPersonStore')
class AlarmHeaderFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateBegin: undefined,
      dateEnd: undefined,
      showDate: false,
      SpopHoverType:false,
      popShow:false,
      minDate:moment(new Date()).valueOf() - 2592000000
    };
  }

  // 标签筛选
  handleTimeSort = value => {
    const {FloatPersonStore,onTypeChange,activeKey}=this.props;
    if(activeKey==1){
    switch(value){
      case 1:
      FloatPersonStore.FloatsearchOption.tagCodes=1;
      break;
      case 2:
      FloatPersonStore.FloatsearchOption.tagCodes=2;
      break;
      case 3:
      FloatPersonStore.FloatsearchOption.tagCodes=3;
      break;
      case 4:
      FloatPersonStore.FloatsearchOption.tagCodes=4;
      break;
      case 5:
      FloatPersonStore.FloatsearchOption.tagCodes=5;
      break;
      case 6:
      FloatPersonStore.FloatsearchOption.tagCodes=6;
      break;
      default:return;
    }}
    else{
      switch(value){
        case 1:
        FloatPersonStore.FloatsearchOptionUnappear.tagCodes=1;
        break;
        case 2:
        FloatPersonStore.FloatsearchOptionUnappear.tagCodes=2;
        break;
        case 3:
        FloatPersonStore.FloatsearchOptionUnappear.tagCodes=3;
        break;
        case 4:
        FloatPersonStore.FloatsearchOptionUnappear.tagCodes=4;
        break;
        case 5:
        FloatPersonStore.FloatsearchOptionUnappear.tagCodes=5;
        break;
        case 6:
        FloatPersonStore.FloatsearchOptionUnappear.tagCodes=6;
        break;
        default:return;
      }
    }
    onTypeChange();
  };

  // 类别筛选
   handleTypeChange = value => {
    let { onTypeChange,FloatPersonStore,activeKey } = this.props;
    if(activeKey==1){
     switch(value){
      case 1: 
      FloatPersonStore.FloatsearchOption.sortType=1;
      break;
      case 2: 
      FloatPersonStore.FloatsearchOption.sortType=2;
      break;
      case 3: 
      FloatPersonStore.FloatsearchOption.sortType=3;
      break;
      default:return;
    } }
    else {
      switch(value){
        case 1: 
        FloatPersonStore.FloatsearchOptionUnappear.sortType=1;
        break;
        case 2: 
        FloatPersonStore.FloatsearchOptionUnappear.sortType=2;
        break;
        case 3: 
        FloatPersonStore.FloatsearchOptionUnappear.sortType=3;
        break;
        default:return;
      } 
    }
    onTypeChange()
  }; 
/**时间筛选 */
chooseTime =(activeKey,e) => {
    
  let { onTypeChange,FloatPersonStore } = this.props;
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
    FloatPersonStore.FloatsearchOption.startTime=undefined;
    FloatPersonStore.FloatsearchOption.endTime=undefined;
    FloatPersonStore.FloatsearchOption.page=1;
  switch (value - 0) {
    case 0:
    FloatPersonStore.FloatsearchOption.peroidType=0;
      break;
    case 1:
    FloatPersonStore.FloatsearchOption.peroidType=1;
      break;
    case 3:
    FloatPersonStore.FloatsearchOption.peroidType=3;
      break;
    case 7:
    FloatPersonStore.FloatsearchOption.peroidType=7;
      break;
    default:return;
  }}
  else{
    FloatPersonStore.FloatsearchOptionUnappear.page=1;
    FloatPersonStore.FloatsearchOptionUnappear.startTime=undefined;
    FloatPersonStore.FloatsearchOptionUnappear.endTime=undefined;
    switch (value - 0) {
      case 0:
       FloatPersonStore.FloatsearchOptionUnappear.peroidType=0;
        
        break;
      case 1:
      FloatPersonStore.FloatsearchOptionUnappear.peroidType=1;
        break;
      case 3:
      FloatPersonStore.FloatsearchOptionUnappear.peroidType=3;
        break;
      case 7:
      FloatPersonStore.FloatsearchOptionUnappear.peroidType=7;
        break;
      default:return;
    }
  }
  onTypeChange();
};
  /*  chooseTime =(activeKey,e) => {
    
    let { onTypeChange,FloatPersonStore } = this.props;
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
      FloatPersonStore.FloatsearchOption.page=1;
    switch (value - 0) {
      case 0:
        delete FloatPersonStore.FloatsearchOption.startTime;
        delete FloatPersonStore.FloatsearchOption.endTime;
        break;
      case 1:
      FloatPersonStore.FloatsearchOption.startTime = moment(moment(Date.now()).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
      FloatPersonStore.FloatsearchOption.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 3:
      FloatPersonStore.FloatsearchOption.startTime = moment(moment(Date.now()).valueOf() - 3 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        FloatPersonStore.FloatsearchOption.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 7:
      FloatPersonStore.FloatsearchOption.startTime = moment(moment(Date.now()).valueOf() - 7 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        FloatPersonStore.FloatsearchOption.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
        break;
      default:return;
    }}
    else{
      FloatPersonStore.FloatsearchOptionUnappear.page=1;
      switch (value - 0) {
        case 0:
          delete FloatPersonStore.FloatsearchOptionUnappear.startTime;
          delete FloatPersonStore.FloatsearchOptionUnappear.endTime;
          break;
        case 1:
        FloatPersonStore.FloatsearchOptionUnappear.startTime = moment(moment(Date.now()).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
        FloatPersonStore.FloatsearchOptionUnappear.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
          break;
        case 3:
        FloatPersonStore.FloatsearchOptionUnappear.startTime = moment(moment(Date.now()).valueOf() - 3 * 24 * 60 * 60 * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          FloatPersonStore.FloatsearchOptionUnappear.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
          break;
        case 7:
        FloatPersonStore.FloatsearchOptionUnappear.startTime = moment(moment(Date.now()).valueOf() - 7 * 24 * 60 * 60 * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          FloatPersonStore.FloatsearchOptionUnappear.endTime = moment(moment(Date.now()).valueOf()).format('YYYY-MM-DD HH:mm:ss');
          break;
        default:return;
      }
    }
    onTypeChange();
  }; */
  timeChange = (type, value) => {
    let { searchData, onTypeChange,FloatPersonStore,activeKey } = this.props;
    let { dateBegin, dateEnd } = this.state;
    let startTime =dateBegin;
    let endTime = null;
    if (type === 'startTime') {
      startTime = value;
      this.setState({ dateBegin: startTime });
    } else {
      endTime = value;
      this.setState({ dateEnd: endTime });
    }
    if (endTime === null) {
      endTime = moment(new Date()).valueOf();
    } 
   // let option = searchData;
   
   if(activeKey==1){
    console.log(moment(startTime).format('YYYY-MM-DD HH:mm:ss')+"无线测试1")
    console.log(moment(endTime).format('YYYY-MM-DD HH:mm:ss')+"无线测试1")
    FloatPersonStore.FloatsearchOption.page=1;
    FloatPersonStore.FloatsearchOption.peroidType=-1;
    FloatPersonStore.FloatsearchOption.endTime = endTime;
    FloatPersonStore.FloatsearchOption.startTime = startTime;}
    else{
      FloatPersonStore.FloatsearchOptionUnappear.page=1;
      FloatPersonStore.FloatsearchOptionUnappear.peroidType=-1;
      FloatPersonStore.FloatsearchOptionUnappear.endTime = endTime;
      FloatPersonStore.FloatsearchOptionUnappear.startTime = startTime;
    }
    if(dateBegin){
      onTypeChange();
    }
  };
  popCancel = () => {
    this.setState({
      popShow:false
    })
  }
  popChange = () => {
    this.setState({
      popShow:true
    })
  }
  popSubmit = () => {
    const {onTypeChange}=this.props;
    onTypeChange();
    this.setState({
      popShow:false
    })
  }
  render() {
    let { showDate, dateBegin, dateEnd, SpopHoverType,popShow,minDate } = this.state;
    let {activeKey,id} = this.props;
    return (
      <div className="community-another-alarm_header_filter-unregistered">
        <Radio.Group
          key ={id}
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
          <Radio value={2}>自定义</Radio>
         
          {/* SpopHoverType ? (
            <Popover
              overlayClassName={'radio_poppver'}
              defaultVisible={true}
              content={
                <div>
                <RangePicker
                  onChange={this.timeChange}
                  startTime={dateBegin}
                  endTime={dateEnd}
                />
                <div className="pop_btn">
										<Button onClick={this.popCancel}>取消</Button>
										<Button onClick={this.popSubmit} type="primary">
											确定
										</Button>
									</div>
                  </div>
              }
              trigger="hover"
              placement="bottom"
              visible={popShow}
            >
            <span onClick={this.popChange}>
              <Radio value={2}>自定义</Radio>
              </span>
            </Popover>
          ) : (
            <span onClick={this.popChange}>
            <Radio value={2}>自定义</Radio>
          </span>
          ) */}
        </Radio.Group>
        {SpopHoverType&&<RangePicker
                  onChange={this.timeChange}
                  startTime={dateBegin}
                  endTime={dateEnd}
                  minDate={minDate}
                />}
        {/* <Select
          dropdownClassName="header_filter_select_time_downwrap"
          className="header_filter_time_select"
          style={{ width: 148 }}
         // value={searchData.sortType}
          onChange={this.handleTimeSort}
          defaultValue={1}
        >
          <Option value={1}>全部标签</Option>
          <Option value={2}>常驻居民</Option>
          <Option value={3}>长期未出现</Option>
          <Option value={4}>空巢老人</Option>
          <Option value={5}>工作人员</Option>
          <Option value={6}>其他</Option>
        </Select> */}
        {/* <Select
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
