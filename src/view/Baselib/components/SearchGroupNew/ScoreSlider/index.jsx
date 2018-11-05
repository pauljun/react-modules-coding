import React,{ Component } from 'react';
import { Slider } from 'antd';
import IconFont from 'src/components/IconFont'


class ScoreSlider extends Component {
  onAfterChange = (data) => {
    const { name, onAfterChange } = this.props
    onAfterChange && onAfterChange({
      [name]:data
    })
  }
  onChange = data => {
    const { name, change } = this.props
    change && change({
      [name]:data
    })
  }
  render(){
    const { label='相似度', value, iconFont } = this.props;
    return (
      <div className='item'>
        <div className='label-data-repository'>
          {iconFont && (
            <IconFont className="data-repository-icon" type={iconFont} />
          )}
          {label}：
        </div>
        <div className='item-content slider-select'>
          <div className='min'>60</div>
          <Slider
            defaultValue={value}
            value={value}
            min={60}
            max={99}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange} 
          />
          <div className='max'>99</div>
        </div>
      </div>
    )
  }
}

export default ScoreSlider;
