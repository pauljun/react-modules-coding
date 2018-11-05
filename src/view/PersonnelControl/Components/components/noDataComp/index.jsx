import React, { Component } from 'react'
import Page404 from './img/404.png'
import NoAlarm from './img/NoAlarm.png'
import NoData from './img/NoData.png'
import NoNet from './img/NoNet.png'
import NoPeople from './img/NoPeople.png'
import './index.scss'
// 类型传数字 --- 0（404) 1 (无告警) 2 （无数据） 3(无网络) 4(以图搜图无图)
const imgComponent = [ Page404, NoAlarm, NoData, NoNet, NoPeople ]
const NoDataComp = (props) => {
  const title = props.title ? props.title : ''
  const imgType = props.imgType ? imgComponent[props.imgType] : NoData
  return (
    <div className='has-not-data-box'>
      <img src={imgType} alt=""/> 
      <div className="has-not-titlt">{`暂无${title}`}</div>
    </div>
	)
}
export default NoDataComp