import React, { Component } from "react";
import RangePicker from 'src/components/RangePicker';
import { Button, Icon } from "antd";

class DownloadWindow extends Component {

  handleDownload = () => {
    const { handleDownload } = this.props;
    handleDownload && handleDownload();
  }
  cancelDownload = () => {
    const { cancelDownload } = this.props;
    cancelDownload && cancelDownload();
  };

  render() {
    const { startTime, endTime, minDate, maxDate, onDateChange } = this.props;
    console.log(startTime,endTime,18)
    return (
      <div className="html5-player-download-window">
        <p className="html5-player-download-title">
          <span>选择时间段</span>
          <Icon type='close' onClick={this.cancelDownload}/>  
        </p>
        <RangePicker 
          onChange={onDateChange}        
          className='html5-player-download-range-picker'
          startLabel='开始时间 :'
          endLabel='结束时间 :'
          divider={false}          
          startTime={startTime}
          endTime={endTime}
          minDate={minDate}
          maxDate={maxDate}
          showToday={false}
          allowClear={false}
        />
        <div className="html5-player-download-btns">
          <Button className='cancel' onClick={this.cancelDownload}>取消</Button>
          <Button className='submit' type="primary" onClick={this.handleDownload}>确定</Button>
        </div>
      </div>
    )
  }
}

export default DownloadWindow;
