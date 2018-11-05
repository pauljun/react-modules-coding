import React from 'react';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import { Input, Button } from 'antd';
const Search = Input.Search;

export default ({ value, onChange, goPage }) => {
  return (
    <div className="optCenter-table-search">
      <Search
        placeholder="请输入您想搜索的内容"
        enterButton
        defaultValue={value}
        onSearch={value =>
          onChange({
            key: value,
            pageNo: 1
          })
        }
      />
      <AuthComponent actionName="CenterAdd">
        <Button
          className="orange-btn"
          type='primary' 
          icon="user"
          onClick={() => goPage('SystemManagement', 'CenterAdd')}
        >
          新建运营中心
        </Button>
      </AuthComponent>
    </div>
  );
};
