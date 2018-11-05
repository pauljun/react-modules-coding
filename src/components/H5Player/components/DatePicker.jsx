import React, { Component } from 'react';
import { Modal, DatePicker, Select, Button, message } from 'antd';

export default class VideoDatePicker extends Component {
  state = {
    visible:false,
    startValue:'',
    endValue:'',
    downloadErrorTip:'',
  }

  // 确定按钮
  handleSubmit = () => {
    const startValue = this.state.startValue;
    let endValue = this.state.endValue;
    if (!startValue) {
      return message.error("视频下载开始时间不能为空")
    }
    if (!endValue) {
      return message.error("视频下载时长不能为空")
    }
    const reg = /^([1-2]\d|[1-9]|30)$/
    if (!reg.test(endValue)) {
      return message.error("请输入正确的下载时长")
    }
    // if(endValue<startValue.valueOf()){
    //   return message.error("结束时间不能小于开始时间")
    // }

    endValue = endValue * 60000 + startValue.valueOf();
    // if(endValue-startValue.valueOf()>1800000){
    //   return message.error("视频下载时长不能超过30分钟")
    // }
    let endTime = String(endValue).substring(0, 10) * 1
    let startTime = String(startValue.valueOf()).substring(0, 10) * 1
    
  }
  // 隐藏下载模态框
  handleHideModal = () => {
    this.setState({
      visible: false,
    });
  }
  // 选择下载开始时间
  onStartChange = (startValue) => {
    console.log(startValue.valueOf())
    this.setState({
      startValue,
    })
  }
  // 选择下载结束时间
  onEndChange = (endValue) => {
    // 0 < endValue =< 30 整数
    const reg = /^([1-2]\d|[1-9]|30)$/;
    const downloadErrorTip = !reg.test(endValue) ? "请输入正确的下载时长!" : ''
    this.setState({
      downloadErrorTip,
      endValue
    })
  }
  disabledStartDate = (startValue) => {
    // const endValue = this.state.endValue;
    // if (!startValue || !endValue) {
    //   return false;
    // }
    console.log(startValue)
    console.log(startValue.valueOf())
    return startValue.valueOf() > new Date()*1;
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  // 重置下载时间段
  handleResetDate = () => {
    if (!this.state.startValue) {
      return
    }
    this.setState({
      startValue: null,
    })
  }
  componentDidMount(){
    const { visible } = this.state;
    this.setState({
      visible
    })
  }
  componentWillReceiveProps(nextPorps) {
    const { visible } = nextPorps;
    this.setState({
      visible
    })
  }
  render() {
    const { 
      visible, downloadErrorTip, startValue, endValue
    } = this.state
    const endTimeSelect = [
      { value: "5", label: "5" },
      { value: "10", label: "10" },
      { value: "15", label: "15" },
      { value: "20", label: "20" },
      { value: "25", label: "25" },
      { value: "30", label: "30" },
    ]
    return (
      <Modal
        className="video-download-modal"
        title="视频下载"
        visible={visible}
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={this.handleHideModal}
        okText="下载"
      >
        <span className="video-start-picker">
          <span className="date-label">{('请选择开始时间：')}</span>
          <DatePicker
            name="startPicker"
            ref="video-datepicker"
            style={{ width: "230px", marginRight: "10px" }}
            allowClear={false}
            disabledDate={this.disabledStartDate}
            showTime
            hideDisabledOptions={true}
            format="YYYY-MM-DD HH:mm:ss"
            getCalendarContainer={() => document.getElementsByClassName('video-start-picker')[0]}
            value={startValue}
            onChange={this.onStartChange} />
          <Button
            className="reset-btn"
            name="resetDate"
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={this.handleResetDate}>
            {('重新选择')}
          </Button>
        </span>
        <span className="video-end-picker">
          <span className="date-label">{('请选择时长(分钟)：')}</span>
          <span className="download-select">
            <Select mode="combobox"
              name="endPicker"
              style={{ width: "230px", display: "inline-block" }}
              placeholder={('下载时长请勿超过30分钟')}
              filterOption={false}
              onChange={this.onEndChange}
              value={endValue}
              options={endTimeSelect} />
          </span>
          <span className="download-error-tip">
            {downloadErrorTip}
          </span>
        </span>
      </Modal>
    )
  }
}