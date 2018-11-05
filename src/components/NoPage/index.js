import React from 'react'
import { Link } from 'react-router-dom'
import Page404 from '../../view/PersonnelControl/Components/components/noDataComp/img/404.png'
import './style.scss'

class NoPage extends React.Component {
  render() {
    return <div className='has-not-data-box-container'>
      <img src={Page404} alt=""/> 
      <p>404</p>
      <div className="has-not-titlt">{'你打开的页面出错了，刷新试试！'}</div>
    </div>
  }
}
export default NoPage
