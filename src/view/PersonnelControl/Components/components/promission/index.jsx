import React, { Component } from 'react';
import { Tree, Input, Icon, Tag } from 'antd';
import _ from 'lodash';
import './index.scss';
import InputSearch from 'src/components/SearchInput';
import IconFont from 'src/components/IconFont';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

export default class PromissionManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }

  renderTreeNodes = data => {
    return data.map(item => {
      const icon = (
        <IconFont
          type={
            item.type === 'user' ? 'icon-UserName_Light' : 'icon-List_Tree_Main'
          }
        />
      );
      if (!_.isEmpty(item.children)) {
        return (
          <TreeNode
            title={
              <span>
                {icon}
                <span>{item.title}</span>
              </span>
            }
            key={`${item.type}-${item.key ? item.key : item.id}`}
            dataRef={item}
            selectable={false}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          dataRef={item}
          title={
            <span>
              {icon}
              <span>{item.title}</span>
            </span>
          }
          key={`${item.type}-${item.key ? item.key : item.id}`}
          selectable={false}
        />
      );
    });
  };

  /**选择接警人员 */
  onCheck = (checkedKeys, e) => {
    this.props.setCheckedKeys(checkedKeys);
  };

  /**删除已选人员 */
  onTagClose = key => {
    let { userId } = this.props;
    let keys = userId.filter(v => v.indexOf(key) === -1);
    this.props.setCheckedKeys(keys);
  };

  /**清空已选人员 */
  delAllItem = () => {
    this.props.setCheckedKeys([]);
  };

  /**搜索 */
  onChange = e => {
    const value = e.target.value;
    this.setState({
      searchValue: value
    });
  };

  render() {
    const { formTreeData, userId, orgUserList, className = '' } = this.props;

    let selectUsers = [];
    if (userId && userId.length && orgUserList && orgUserList.length) {
      orgUserList.map(v => {
        let list = [];
        if (v.key) {
          list = userId.filter(
            v1 => v.key.indexOf(v1) > -1 && v.type === 'user'
          );
        } else {
          list = userId.filter(
            v1 => v1.indexOf(v.id) > -1 && v.type === 'user'
          );
        }
        if (list.length) {
          selectUsers.push(v);
        }
      });
    }
    return (
      <div className={'promission_management ' + className}>
        <div className="leftOrgTree">
          <div className="title">
            <span>组织人员</span>
            {/* <Search
              placeholder="请输入你要搜索的人员"
              onChange={this.onChange}
            /> */}
            <InputSearch
						  placeholder="请输入你要搜索的人员"
              onChange={this.onChange}
					/>
          </div>
          <div className="orgTree">
            <Tree
              checkable
              onCheck={this.onCheck}
              checkedKeys={userId}
              defaultExpandAll={true}
              filterTreeNode={node => {
                let flag = false;
                const data = node.props.dataRef;
                if (data && this.state.searchValue) {
                  flag = data.title.indexOf(this.state.searchValue) > -1;
                }
                return flag;
              }}
            >
              {this.renderTreeNodes(formTreeData)}
            </Tree>
          </div>
        </div>
        <div className="rightOrgTree selected-users">
          <div className="title">
            <span>已添加人员</span>
            <span onClick={this.delAllItem}>
              <i className="icon anticon">&#xa61e;</i> 清空
            </span>
          </div>
          <div className="users">
            {selectUsers &&
              selectUsers.map(v => {
                return (
                  <Tag
                    className={`user-tag ${v.type}`}
                    key={v.key ? v.key : v.id}
                    closable
                    onClose={this.onTagClose.bind(this, v.key ? v.key : v.id)}
                  >
                    <IconFont type={'icon-UserName_Light'} />
                    {v.title}
                  </Tag>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}
