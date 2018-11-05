import React, { Component } from 'react';
import * as util from 'src/utils';
import { Modal, Checkbox, message, Input, Button, InputNumber, Icon, Select } from 'antd';
import BtnScreenSplit from './BtnScreenSplit';
const Option = Select.Option;

// 分屏数对应将屏幕划分的列数, 及对应的宽度比例
const colsMap = {
  1: { colsNum: 1, percent: 100 },
  4: { colsNum: 2, percent: 50 },
  9: { colsNum: 3, percent: 33.3333333 },
  16: { colsNum: 4, percent: 25 }
}
const maxScreenNum = 16
class VideoTrun extends Component {
  state = {
    checkList: [],
    checkAll: true,
    screenNum: 4,
    changeTime:10,
    timeType:1,
  };

  onCheckOneChange = (v,k) => {
    const { checkList } = this.state;
    checkList[k].checked = !v.checked;
    let checkAll = false;
    if (checkList[k].checked){
      const isCheckAll = checkList.filter(v => v.checked === true);
      checkAll = checkList.length === isCheckAll.length;
    }
    this.setState({
      checkList,
      checkAll,
    });
  }
  onCheckAllChange = (e) => {
    const { checkList } = this.state;
    const checked = e.target.checked;
    checkList.map(v => v.checked = v.disabled || checked);
    this.setState({
      checkList: checkList,
      checkAll: checked,
    });
  }
  setScreenNum = (v) => {
    const json = JSON.parse(v.key);
    if (this.state.screenNum !== json.value){ 
      const { disabledList, screenNum } = this.props;
      if (json.value < screenNum){
        return message.error('目标分屏小于已用分屏')
      } 
      if (json.value >= screenNum) {
        const checkList = this.getCheckList(json.value, disabledList);
        this.setState({
          screenNum: json.value,
          checkList,
          checkAll: true,
        })
      }
    }
  }
  onOk = () => {
    const { checkList, changeTime, timeType } = this.state;
    const { disabledList, posIndexArr } = this.props;
    if (disabledList.length >= checkList.length){
      return message.error('当前无可用屏幕');
    }
    if (changeTime * timeType>3600){
      return message.error('轮巡间隔时间最多为1小时');
    }
    if (!changeTime) {
      return message.error('请填入轮巡时间');
    }
    let selectedScreen = [];
    checkList.map((v, k) => {
      if (v.checked && !v.disabled) {
        selectedScreen.push(k);
      }
    });
    if (!selectedScreen.length){
      return message.error('您还未选择屏幕');
    }
    const screenNum = this.state.screenNum;
    this.props.onOk(screenNum, selectedScreen, changeTime * timeType);
  }
  getCheckList = (screenNum, disabledList) => {
    const checkList = Array.from({ length: screenNum }).map((v, k) => {
      const disabled = disabledList.indexOf(k) !== -1;
      return { checked: true, disabled }
    });
    return checkList
  }
  videoTurnTimeChange = (e) => {
    this.setState({
      changeTime: e.target.value
    })
  }
  handleChange = (value) => {
    let timeType=1
    if (value==='min'){
      timeType=60
    }else if(value === 'sec'){
      timeType=1
    }
    this.setState({
      timeType
    })
  }
  componentDidMount(){
    const { screenNum, disabledList } = this.props;
    const checkList = this.getCheckList(screenNum, disabledList);
    this.setState({ screenNum, checkList });
  }
  
  render () {
    const { visible, onCancel, posIndexArr } = this.props;
    const { screenNum, checkList, checkAll } = this.state;
    const colsTemp = colsMap[+screenNum];
    const colsNum = colsTemp.colsNum;
    const percent = colsTemp.percent;
    const cols = 'cols-' + colsNum;
    return (
      <Modal
        className='video-turn-modal'
        destroyOnClose={true}
        title={util.lan('轮巡设置')}
        visible={visible}
        onOk={this.onOk}
        onCancel={onCancel}
        maskClosable={false}
        width={720}
        footer={null}
      >
        <div className='video-turn-body'>
          <div className='dialog-body-thead'>
            <span>
              <Checkbox
                onChange={this.onCheckAllChange}
                checked={checkAll}
              >
                {util.lan('全部可用窗口')}
              </Checkbox>
            </span>
            <label className='time-set'>
              <span>{util.lan('间隔时间 :')}</span>
              <Input
                type={'number'}
                style={{ width: 120,margin:'0 8px'}}
                defaultValue="10"
              
                // placeholder='请选择轮巡切换时间,默认为10s'
                onChange={this.videoTurnTimeChange}
              />
              <Select defaultValue="sec" style={{ width: 88 }} onChange={this.handleChange} >
                <Option value="sec">秒</Option>
                <Option value="min">分钟</Option>
              </Select>
            </label>
            <span>
              {util.lan('窗口设置 :')}
              <BtnScreenSplit setScreenNum={this.setScreenNum} screenNum={screenNum} maxScreenNum={maxScreenNum} />
            </span>
          </div>
          <div className={`dialog-body-tcontent ${cols}`}>
          {
            checkList.map((v,k) => {
              const posIndex = posIndexArr[k];
              const top = Math.floor(posIndex / colsNum) * percent + '%';
              const left = (posIndex % colsNum) * percent + '%';
              const key = v.disabled ? k : Math.random();
              return (
                v.disabled ?
                <Checkbox
                  className='video-turn-checkbox disabled'
                  key={key}
                  style={{ top, left }}
                  checked
                  disabled
                >
                    <Icon type="yunyanjiankong" />
                    <span className='tip'>当前窗口有视频正在播放</span>
                </ Checkbox > :
                <Checkbox
                  className='video-turn-checkbox'
                  key={key} 
                  style={{ top, left }}          
                  checked={v.checked}
                  onChange={() => this.onCheckOneChange(v,k)}
                > 
                  <Icon type="yunyanjiankong" /> 
                </ Checkbox > 
          )
        })
      }
          </div>
        </div>        
        <div className='video-turn-footer'>

          <div className='modal-btns'>
            <Button type="primary" onClick={this.onOk}>{util.lan('确定')}</Button>
            <Button onClick={onCancel}>{util.lan('取消')}</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default VideoTrun;
