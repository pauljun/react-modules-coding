import React from 'react';
import moment from 'moment';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import WaterMark from 'src/components/WaterMarkView';

import './index.scss';
@BusinessProvider('UserStore')
export default class RegisButCard extends React.Component {
  handlePageJump = id => {
    this.props.handlePageJump(id);
  };
  render() {
    const {
      recentTime,
      picUrl,
      recentAddress,
      appearNumForThreeDays,
      vid,
      tagList = []
    } = this.props.data || {};
    let { UserStore } = this.props;
     const index=tagList&&tagList.findIndex(v => v.tagType==118500);
    if(index>-1)
   { tagList&&tagList.splice(index,1)} 
    let item = [],
      itemT = [];
      tagList &&
      tagList.map(v => {
        if(v.tagType==118500){
          return
        }
        if (v.tagCode == 0 && v.tagName) {
          if (v.tagName.indexOf(';') > 0 || v.tagName.indexOf('；') > 0) {
            let arr = v.tagName.replace(/;/gi, '；').split('；');
            itemT = itemT.concat(arr);
          } else {
            itemT.push(v.tagName);
          }
        } else {
          item.push(v.tagName);
        }
      });
    let tagListAnother = itemT.concat(item).filter(v => v !== '') || [];
    const tagListHandle = tagListAnother.slice(0, 3);
    let realName = UserStore.userInfo && UserStore.userInfo.realName;
    return (
      <div
        className="card-design-community-another-unregistered"
        onClick={this.handlePageJump.bind(this, vid)}
      >
        <div className="card-design-top">
          <div className="card-design-top-left">
            <p>最近出现时间：</p>
            <p>
              {recentTime
                ? moment(parseInt(recentTime, 10)).format('YYYY.MM.DD HH:mm:ss')
                : '无'}
            </p>
            <p>最近出现地点：</p>
            <p
              title={
                recentAddress && recentAddress.length > 10 ? recentAddress : ''
              }
            >
              {recentAddress
                ? recentAddress.length > 10
                  ? recentAddress.substring(0, 10) + '...'
                  : recentAddress
                : '无'}
            </p>
            <p>三天内出现次数:</p>
            <p>{appearNumForThreeDays}</p>
            <p>虚拟身份号码：</p>
            <p>{vid ? vid : '无'}</p>
          </div>
          <div className="card-design-top-right">
            {/* <div className="watermask">{realName}</div> */}
            {/* <img src={picUrl}/> */}
            <WaterMark src={picUrl} type="face" />
          </div>
        </div>
        <div className="card-design-line" />
        <div className="circle-half">
          {tagListHandle &&
            tagListHandle.map((v, i) => (
              <div key={i} className="circle-half-community">
                {v && v.length > 4 ? v.substring(0, 4) + '...' : v}
              </div>
            ))}
          {tagListAnother.length > 3 && (
            <div className="circle-half-community-more" title="点击查看详情">
              更多...
            </div>
          )}
        </div>
      </div>
    );
  }
}
