import React from 'react';
import Stores from '../../store/GlobalStore';
import './index.scss';

class WaterMakerCorsView extends React.Component {
  render() {
    let { className = '', src, background = true, type = 'face', ...rest } = this.props;
    return (
      <span
        className={`bg-sence-path ${className}`}
        style={{
          display: 'inline-block',
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        {background
          ? <span
            className='img-span'
            style={{
              backgroundImage: `url(${src})`
            }}
          ></span>
          : <img
            style={{ display: 'block' }}
            src={src}
            {...rest}
          />
        }
        <span
          className={`water-mark-span ${type === 'face' ? 'rt' : 'ct'}`}
        >
          {Stores.UserStore.userInfo.realName}
        </span>
        {type === 'face' &&
          <span
            className='water-mark-span lb'
          >
            {Stores.UserStore.userInfo.realName.split('').reverse().join('')}
          </span>
        }
      </span>
    );
  }
}

export default WaterMakerCorsView;
