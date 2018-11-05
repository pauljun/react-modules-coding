import React from 'react';
import moment from 'moment';
import { getKeyValue } from '../../../../../libs/Dictionary';
import WaterMark from 'src/components/WaterMarkView';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

import './index.scss';
@BusinessProvider('UserStore')
export default class RegisButCard extends React.Component {
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
      nation,
      gender,
      birthDate,
      tagList
    } = this.props.data;
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
    const tagListHandle = tagListAnother.slice(0, 3);
    let { UserStore } = this.props;

    let realName = UserStore.userInfo && UserStore.userInfo.realName;
    return (
      <div
        className="card-design-community-another"
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
                ? moment(parseInt(birthDate, 10)).format('YYYY.MM.DD')
                : '未知'}
            </p>
            <p title={presentAddress&&presentAddress.length > 20 ? presentAddress : ''}>
              <span>地址：</span>
              {presentAddress&&presentAddress.length > 20
                ? presentAddress.substring(0, 10) + '...'
                : presentAddress}
            </p>
            <p>
              <span>身份证：</span>
              {credentialNo}
            </p>
          </div>
          <div className="card-design-top-right">
            <WaterMark src={portraitPicUrl} type="face" />
            {/* <div className="watermask">{realName}</div> */}
            {/* <img src={portraitPicUrl}/> */}
          </div>
        </div>
        <div className="card-design-line" />
        <div className="circle-half">
          {tagListHandle.map((v, i) => (
            <div className="circle-half-community" key={i} title={v.length>4?v:''}>
              {v ? (v.length>4?v.substring(0,4)+'...':v) : '空'}
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
