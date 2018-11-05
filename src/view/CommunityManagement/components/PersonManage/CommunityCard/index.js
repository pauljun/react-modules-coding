import React from 'react';
import moment from 'moment';
import WaterMark from 'src/components/WaterMarkView';
import { getKeyValue } from '../../../../../libs/Dictionary';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

import './index.scss';
@BusinessProvider('UserStore')
export default class CommunityCard extends React.Component {
  handlePageJump = id => {
    this.props.handlePageJump(id);
  };
  render() {
    const {
      name,
      credentialNo,
      presentAddress,
      id,
      portraitPicUrl,
      gender,
      birthDate,
      recentAddress,
      appearTimesForThreeDays,
      recentTime,
      nation,
      tagList
    } = this.props.data;
    let { UserStore } = this.props;
    /**中英文分号分隔标签处理 */
    let item = [],
      itemT = [];
    tagList &&
      tagList.map(v => {
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
    let tagListHandle = tagListAnother.slice(0, 3);
    let realName = UserStore.userInfo && UserStore.userInfo.realName;
    return (
      <div
        className="card-design-community"
        onClick={this.handlePageJump.bind(this, id)}
      >
        <div className="card-design-top">
          <div className="card-design-top-left">
            <p>{name}</p>
            <p>
              <span>性别：</span>
              {getKeyValue('sex', gender)}
            </p>
            <p>
              <span>民族：</span>
              {getKeyValue('nation', nation)}
            </p>
            <p>
              <span>生日：</span>
              {birthDate
                ? moment(parseInt(birthDate, 10)).format('YYYY-MM-DD ')
                : '无'}
            </p>
            <p title={presentAddress&&presentAddress.length>20?presentAddress:''}>
              <span>地址：</span>
              {presentAddress&&presentAddress.length>20?presentAddress.substring(0,20)+'...':presentAddress}
            </p>
            <p>
              <span>身份证：</span>
              {credentialNo}
            </p>
          </div>
          <div className="card-design-top-right">
            {/* <div className="watermask">{realName}</div> */}
            <WaterMark src={portraitPicUrl} type="face" />
            {/* <img src={portraitPicUrl} alt=""/> */}
          </div>
        </div>
        <div className="card-design-line" />
        <div className="card-design-bottom">
          <p>
            <span>最近出现时间：</span>
            {recentTime
              ? moment(parseInt(recentTime, 10)).format('YYYY.MM.DD HH:mm:ss')
              : '无'}
          </p>
          <p title={recentAddress&&recentAddress.length>15?recentAddress:""}> 
            <span>最近出现地点：</span>
            {recentAddress&&recentAddress.length>15?recentAddress.substring(0,15)+"...":recentAddress}
          </p>
          <p>
            <span>三天出现次数：</span>
            {appearTimesForThreeDays}
          </p>
        </div>
        <div className="card-design-line-anoter" />
        <div className="circle-half">
          {tagListHandle.map((v, i) => (
            <div
              className="circle-half-community"
              key={i}
              title={v && v.length > 4 ? v : ''}
            >
              {v ? (v.length > 4 ? v.substring(0, 4) + '...' : v) : '空'}
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
