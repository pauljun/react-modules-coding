import React from 'react'
import './index.scss'
export default class LiveDetail extends React.Component {
render(){
  const {type}=this.props;
return(
<div className="community-click">
<div className="community-handle">
  <div></div>
  <div></div>
</div>
<div className="community-masword">
<div className="community-one"><span>{type==1?"新面孔":"常住居民"}</span><span>{this.props.LongLiveTotal}</span></div>
<div className="community-two"><span>{type==1?"未登记出现":"登记未出现"}</span><span>{this.props.ReUnAppearTotal}</span></div>
</div>
</div>)}}