import React from 'react';
import { Select, Input, Button, Icon } from 'antd';
import CustomPagination from './CustomPagination';
import CustomUpload from 'src/components/Upload/upload.sw'
import './index.scss';
import IconFont from 'src/components/IconFont/'
import AuthComponent from '../../../BusinessComponent/AuthComponent'
const Option = Select.Option;
const Search = Input.Search;
const defaultPageSizeOptions = [
  10, 20, 50, 80
]

class ModuleWrapper extends React.Component {

  handlePageSizeChange = (pageSize) => {
    const { current, onPageChange } = this.props;
    onPageChange &&　onPageChange(current, pageSize)
  }

  handleReload = () => {
    const { onReload } = this.props;
    onReload &&　onReload()
  }

  render() {
    const { 
      className='', title, total=0, current, onPageChange, 
      pageSizeOptions=defaultPageSizeOptions, onSearch, placeholder,
      onUpload, 
      children=null 
    } = this.props;
    const { pageSize=pageSizeOptions[0] } = this.props;
    const BTN = <Button className='search-btn-data-repository'>
      <IconFont type='icon-ImageSearch_Light'/>
      <span>以图搜图</span>
    </Button>
    return (
      <div className={`c-module-wrapper ${className}`}>
        <div className='module-header-warpper'>
          <div className='module-title'>
            { title }
          </div>
          <div className='module-header'>
            <div className='search-input-wrapper'>
              {onSearch && (
                <Search 
                  enterButton 
                  addonBefore={onUpload ? <Icon type='camera' /> : ''}
                  placeholder={placeholder}
                  onSearch={onSearch} 
                />
              )}
              {onUpload && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <CustomUpload
                    className='img-upload'
                    expiretype={1}
                    uploadBtn={BTN}
                    uploadTip={false}
                    uploadDone={onUpload}
                  />
                </AuthComponent>
              )}
            </div>
            <div className='pagination-wrapper'>
              <span>
                共显示 
                <span className='highlight'>{ total }</span> 
                条资源    
              </span> 
              <span className='page-size-select'>
                <Select value={pageSize} onChange={this.handlePageSizeChange}>
                  {pageSizeOptions.map(v => (
                    <Option key={v} value={v}>{`${v}条/页`}</Option>
                  ))}
                </Select>
              </span>
              <CustomPagination 
                current={current}
                pageSize={pageSize}
                total={total}
                onPageChange={onPageChange}
              />
              <span className='pagination-btn-container'>
                <Button onClick={this.handleReload}>
                  <IconFont type={'icon-Left_Main'} theme="outlined" />刷新
                </Button>
              </span>
            </div> 
          </div>
        </div>
        <div className='module-content-wrapper'>
          { children }
        </div>
      </div>
    )
  }
}

export default ModuleWrapper;