import React, { Component } from 'react';
import IconFont from 'src/components/IconFont';
import EntryCard from './entryCard';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Input, Icon } from 'antd';
import InputAfter from 'src/components/InputAfter';
// import SearchInput from 'src/components/SearchInput';
import { stopPropagation } from '../../../../utils';
import './communityList.scss';

@withRouter
@BusinessProvider('TabStore')
@observer
class CommunityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    }
  }

  inputHandleChange = (e) => {
    clearTimeout(this.alarmTime);
    this.setState({
      inputValue: e.target.value
    })
    let value = e.target.value;
    this.alarmTime = setTimeout(() => {
        this.props.getVillageList(value);
      }, 500);
  }
  onCancel = () => {
    this.setState({
      inputValue: ''
    })
    this.props.getVillageList();
  }
  handleSearch = () => {
    let { inputValue } = this.state;
    this.props.getVillageList(inputValue);
  }
  //常住跳转
  residenceHandle = ( type, id, e) => {
    stopPropagation(e);
		let { TabStore, history } = this.props;
    let childModuleName = type == 0 ? 'CommunityRegistered': 'CommunityUnRegistered';
    TabStore.goPage({ moduleName: 'CommunityManagement', childModuleName, history,data: {id} })
  }
  render() {
    let {choseId, data = [],clickCommunity } = this.props;
    let { inputValue } = this.state;
    return (
      <div className="community_list">
       <p className="list_title">
          我的小区
       </p>
       <div className="list_search">
        {/* <SearchInput size={'lg'} style={{ color: 'rgba(0,0,0,.25)' }} placeholder="请输入小区名称搜索" onChange={this.inputHandleChange.bind(this)} onPressEnter={this.handleSearch.bind(this)}/> */}
        <InputAfter size={'lg'} style={{ color: 'rgba(0,0,0,.25)' }} value={inputValue} placeholder="请输入小区名称搜索" onChange={this.inputHandleChange.bind(this)} onCancel={this.onCancel.bind(this)}/>
       </div>
       <div className="list_content">
          {data && data.map((item, index) => {
            return (
              <EntryCard choseId={choseId} key={index} data={item} clickCommunity={clickCommunity} residenceHandle={this.residenceHandle} />
            )
          })}
       </div>
      </div>
    )
  }
}

export default CommunityList;
