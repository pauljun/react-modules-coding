import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import { escapeUrl as Util_escapeUrl } from 'src/utils';
import { message, Button } from 'antd';
import { TimeRadio, GrapPoint, GroupRadioNew, GroupCheckboxNew } from '../components/SearchGroupNew/';
import { sex, geoAddress, eyeGlass, captureTime } from 'src/libs/Dictionary';
@BusinessProvider('faceStore','TabStore')
@observer
class SearchView extends Component{

  //清除查询条件
  clear = () => {
    const { faceStore, searchDataChange, setTimeRadioValue } = this.props
    const { pageSize } = faceStore.searchData;
    faceStore.initSearchData({pageSize}).then(
      () => {
        // 修改timeRadio的选中状态
        setTimeRadioValue(3, searchDataChange)
      }
    )
  }

  jumpUrl = file => {
    if(!file.url){
      return message.error('图片上传失败，请重试')
    }
    const { TabStore, history, logsModel } = this.props;
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: 'imgSearch',
      history,
      data: {
        url: Util_escapeUrl(file.url, true),
        type: 'face',
        model: 11,
      },
    })
  }  

  change = (options) => {
    options.pageType = 0
    options.maxCaptureTime = ''
    options.maxId = ''
    options.minCaptureTime = ''
    options.minId = ''
    this.props.searchDataChange(options)
  }
  render(){
    const { timeRadioValue, setTimeRadioValue, faceStore } = this.props;
    const { searchData = {} } = faceStore;

    return (
      <div className='data-repository-search'>
        <div className="search-title">
          图库筛选：
          <Button className='reset-btn' onClick={this.clear}>重置</Button>
        </div>
        <div className='container'>
          <div className='data-repository-search-form'>
            <TimeRadio
              data={captureTime}
              change={this.change}
              value={timeRadioValue}
              startTime={searchData.startTime}
              endTime={searchData.endTime}
              changeTimeRaioValue={setTimeRadioValue}
            />
            <GrapPoint
              value={searchData.cameraIds}
              onChange={this.change}
            />
            <GroupRadioNew
              data={sex}
              label='性别'
              iconFont='icon-Sex_Dark'
              value={searchData.sex}
              name='sex'
              change={this.change}
            />
            <GroupRadioNew
              data={eyeGlass}
              label='眼镜'
              iconFont='icon-Control_Black_Main'
              value={searchData.eyeGlass}
              name='eyeGlass'
              change={this.change}
            />
            {/* <GroupRadioNew
              data={geoAddress}
              label='场所'
              iconFont='icon-Community_Main1'
              value={searchData.geoAddress}
              name='geoAddress'
              change={this.change}
            /> */}
            <GroupCheckboxNew 
              data={geoAddress}
              label='场所'
              iconFont='icon-Community_Main1'
              value={searchData.geoAddress}
              name='geoAddress'
              change={this.change}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SearchView;
