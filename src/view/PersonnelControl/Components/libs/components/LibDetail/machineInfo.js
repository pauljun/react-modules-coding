import React from 'react'
import { Input } from 'antd'

import './index.scss';

const TextArea = Input.TextArea

class MachineInfo extends React.Component {

  onSubmit = () => {
    return Promise.resolve(this.describe)
  }

  handleDescChange = (e) => {
    this.describe = e.target.value;
  }

  componentWillMount(){
    const { viewRef, libDetail } = this.props;
    this.describe = libDetail.describe
    viewRef && viewRef(this)
  }

  render() {
    const { libDetail, isEdit=false } = this.props;

    return (
      <div className='lib-info-container'>
        <div className='lib-info'>
          <span className='info-label'>{'布控库互联网名称：'}</span><br/>
          <span className='info-value'>{libDetail.name}</span>
        </div>
        <div className='lib-info'>
          <span className='info-label'>{'一体机设备名：'}</span><br/>
          <span className='info-value'>{libDetail.machineName}</span>
        </div>
        <div className='lib-info'>
          <span className='info-label'>{'一体机SN码：'}</span><br/>
          <span className='info-value'>{libDetail.machineSn}</span>
        </div>
        <div className='lib-info'>
          <span className='info-label'>{'布控对象：'}</span><br/>
          <span className='info-value'>
            已选人员 <span className='highlight'>{libDetail.personCount}</span> 人
          </span>
        </div>
        <div className='lib-info machine-desc'>
          <span className='info-label'>{'描述：'}</span><br/>
          {!isEdit
            ? <span className='info-value'>
                {libDetail.describe || '-- 暂无描述 --'}
              </span>
            : <TextArea
                className='info-value'
                rows={4}
                defaultValue={libDetail.describe}
                onChange={this.handleDescChange}
              />
          }
        </div>
      </div>
    )
  }
}

export default MachineInfo