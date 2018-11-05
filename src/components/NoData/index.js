import React from 'react'
// import nodata from '../../assets/img/base/nodata.svg'
import NoDataComp from '../../view/PersonnelControl/Components/components/noDataComp/index'
export default class NoData extends React.Component {
  render(){
    // return (
    //   // <div
    //   //   style={{
    //   //     width: '100%',
    //   //     height: '100%',
    //   //     background: `url(${nodata}) no-repeat center center`
    //   //   }}
    //   // />
    // )
    return <NoDataComp title={this.props.title || '数据'} imgType={this.props.imgType || 2}/>
  }
}
