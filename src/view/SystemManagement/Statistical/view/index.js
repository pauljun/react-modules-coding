
import React, { Component } from 'react';
import {observer} from 'mobx-react'
import {withRouter} from 'react-router-dom'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import SearchView from '../components/Search'
import ListTable from '../components/ListTable'
import Title from '../../components/Title';
import moment from 'moment'
import '../index.scss'
import { toJS } from 'mobx';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
@withRouter
@BusinessProvider('UserStore', 'RoleManagementStore', 'TabStore','StatisticStore')
@observer
class Statistic extends Component {
  state={
    loding:false,
    list:[],
    total:0,
    timeActive: 7
  }
  /**
   * 生命周期函数
   */
  // componentWillMount() {
  //   // this.storeId = this.props.args.storeId
  //   this.props.TabStore.initData()
  // }
  // shouldComponentUpdate(newProps, newState) {
  //   return this.props.tabModel.timeActive === this.props.args.storeId;
  // }
  // componentWillUnmount() {
  //   this.props.StatisticStore.delData();
  // }
  componentDidMount() {
    this.setTimeRange(7)
    this.getList()
  }
  getList () {
    const { StatisticStore } = this.props
    StatisticStore.search().then(res => {
      this.setState({
        list:res.result, 
        total:res.result.length
      })
    })

  }
  
  // 查询
  doSearch = () => {
    const { StatisticStore} = this.props;
    StatisticStore.search().then(res => {
      this.getList()
    })

  }
  // //列表改变
  // handleTableChange = (pagination, filters, sorter) => {
  // }
  // 修改store的searchData
  updateStoreSearchData = (data) => {
    const { StatisticStore} = this.props;
    StatisticStore.updateSearchData(data);
  }

  // 选时控件change
  timeChange = (type, value) => {
    const newDate = {}
    if (type === 'startTime'){
      newDate.begin = moment(new Date(value)).format(DATE_FORMAT)
    } else {
      newDate.end = moment(new Date(value)).format(DATE_FORMAT)
    }
    this.updateStoreSearchData(newDate);
    this.setState({
      timeActive: null
    })
  }

  // 切换统计时间
  setTimeRange = (value) => {
    const end = new Date();
    const begin = moment(end).subtract(value, 'days');
    this.updateStoreSearchData({
      begin: moment(begin).format(DATE_FORMAT),
      end: moment(end).format(DATE_FORMAT)
    })
    this.setState({
      timeActive: value
    })
  }

  // 切换统计类型
  setSearchType = (type) => {
    this.updateStoreSearchData({
      type
    })
    this.setTimeRange(this.state.timeActive)
    this.doSearch()
  }

  downloadExcel = () => {
    const { StatisticStore} = this.props;
    StatisticStore.downloadExcel()
  }
 
  render() {
    const { StatisticStore } = this.props;
    const { searchData } = StatisticStore;

    const { list,total,timeActive } = this.state
    return(
      <React.Fragment>
			<div className='noTreeTitle'>数据统计</div>
      <div className='statistical-view'>
        <Title className="statistical-title" name="" style={{border:'0'}}>
          <SearchView 
            doSearch = {() => this.getList()} 
            className='statistical-search-view' 
            setSearchType={(typeValue) => this.setSearchType(typeValue)} 
            setTimeRange={this.setTimeRange} 
            timeActive = {timeActive}
            timeChange = {(type,value) => {this.timeChange(type,value)}}
          />
           
        </Title>
        <div className="statistical-list">
          <ListTable
            columnType={searchData.type-1}
            dataSource={list} 
            handleTableChange={this.handleTableChange}
            total={total}
            searchData={searchData}
            scroll={{ y: '100%' }}
          />
        </div>
      </div>
      </React.Fragment>
  
    );
  } 
}
export default Statistic