import React, { Component } from 'react';
import './index.scss';
import { Upload, message,Icon } from 'antd';
import { observer, inject } from 'mobx-react';
import UploadPicMessage from '../../service/lyService.js'
const Dragger = Upload.Dragger;

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
@inject('UserStore')
@observer
class UploadComponent extends Component {
  state = {
    loading: false,
    imageUrl:'',
    fileList:[]
  }
  // clear(){
  //   this.setState({imageUrl:''})
  // }
  render(){
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className='ant-upload-text'>上传</div>
      </div>
    );
    const { expiretype = 0 } = this.props;    
    const config = {
      name: 'file',
      listType:'picture-card',
      multiple: false,
      showUploadList:false,
      action: '',
      beforeUpload: file => {
        let self = this
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
          message.error('图片格式必须为JPG或者PNG!')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片大小不能超过2M!')
          return false
        }
        this.setState({ loading: true });
        const formData = new FormData()
        let token = this.props.UserStore.lyToken
        const lyupload = window.webConfig.uploadDomain
        formData.append('file', file)
        fetch(`${lyupload}upload2?size=${file.size}&access_token=${token}&expiretype=${expiretype}`, {
          method: 'POST',
          body: formData
        }).then(
          (response) => response.json()
        ).then((result) => {
          message.success('上传成功')
          // 上传成功后删除上一次上传的图片
          let deleteObjId = this.objId ? this.objId : ''
          if(deleteObjId){
            UploadPicMessage.deleteFile(deleteObjId)
          }
          this.objId = result.obj_id
          // let imgurl = `${lyupload}upload2?files?obj_id=${result.obj_id}&access_token=${token}`
          let imgurl = `${lyupload}files?obj_id=${result.obj_id}&access_token=${token}`;          
          this.setState({
            imageUrl:imgurl,
            loading: false
          })
          // 将图片链接传给父组件的 state
          self.props.changeheadImg && self.props.changeheadImg(imgurl)
        })
        return false
      },
    };    
    const imageUrl = this.state.imageUrl || this.props.imageUrl;
    const image = (
      <div>
        {/* <div className="watermask">{this.props.userModel.userInfo.realName}</div> */}
        <img src={imageUrl} alt='' /> 
      </div>
    )
    return (
      <div className={this.props.cssname}>
        <Dragger {...config} key={Math.random()} {...this.props} disabled={this.props.disabled}>
          {imageUrl ? image : uploadButton}
        </Dragger>
      </div>
    )
  }
}

export default UploadComponent;
