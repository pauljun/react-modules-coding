import React from 'react';
import { inject, observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Input, message, Icon } from 'antd';
import CaptureViewPlus from '../CaptureView/captureViewPlus.jsx';
import camera from '../../assets/img/community/RealPopulation/ImageSearch_Dark.svg';
import search from '../../assets/img/community/RealPopulation/Search_Light.svg';
import IconFont from 'src/components/IconFont';
import './index.scss';
@BusinessProvider('CommunityDetailStore', 'UserStore')
@observer
class UploadInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }
  state = {
    imgUrl: '',
    capShow: false,
    val: '',
    feature: '',
    file: ''
  };

  onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    let df = e.dataTransfer.items[0];
    var file = df.getAsFile();
    this.upDataImg(file);
  };

  upDataImg = file => {
    this.props.changeImg && this.props.changeImg(true);
    const formData = new FormData();
    let token = this.props.UserStore.lyToken;
    const lyupload = window.webConfig.uploadDomain;
    formData.append('file', file);
    fetch(
      `${lyupload}upload2?size=${file.size}&access_token=${token}&expiretype=0`,
      {
        method: 'POST',
        body: formData
      }
    )
      .then(response => response.json())
      .then(result => {
        let imgUrl = `${lyupload}files?obj_id=${
          result.obj_id
        }&access_token=${token}`;
        //this.setState({ imgUrl });
        this.props.handleYesImgUrl(imgUrl)
        this.getImgFeature(imgUrl, 1);
      });
  };
  //提取图片特征
  getImgFeature = (imgUrl, type) => {
    //type为1是url上传为2是base64上传
    let options = {
      score: 0.6
    };
    if (type === 2) {
      options.base64 = imgUrl;
    } else {
      options.url = imgUrl;
    }
    this.props.CommunityDetailStore.getFaceFeature(options).then(res => {
      if (res.imgsList.length > 0 && res.imgsList[0].face) {
        let feature = res.imgsList[0].face.feature;
        this.setState({
          feature: feature
        });
        let { val } = this.state.val;
        this.props.getFeature && this.props.getFeature(feature);
      } else {
        this.fileInput.current.input.value = '';
        message.warn('提取图片特征失败');
        this.props.handleNoImgUrl(2);
        this.setState({
          //imgUrl: '',
          capShow: false
        });
        this.props.deleteImg && this.props.deleteImg(true);
      }
    });
    this.props.changeImg && this.props.changeImg(false);
  };

  fileInputChange = e => {
    let file = e.target.files[0];
    this.upDataImg(file);
  };
  onDragOver = e => {
    e.preventDefault();
  };

  onDragEnter = () => {};

  onDragLeave = () => {};

  onChange = e => {
    const { activeKey } = this.props;
    this.props.handleVal(e.target.value)
    /* this.setState({
      val: e.target.value
    }); */
    this.props.getInputValue(e.target.value);
  };
  deleteImg = () => {
    this.props.handleNoImgUrl(1)
    this.setState({
      //imgUrl: '',
      feature: '',
      capShow: false,
      //val:''
    });
    this.fileInput.current.input.value = '';
    this.props.deleteImg && this.props.deleteImg();
  };
  edit = () => {
    this.setState({
      capShow: true
    });
  };
  captureCb = src => {
    this.props.handleYesImgUrl(src);
    this.setState({
      //imgUrl: src,
      capShow: false
    });
    this.getImgFeature(src, 2);
  };
  //调用父组件模糊搜索函数，然后渲染页面，明天来要注意
  search = () => {
    let { feature, val } = this.state;
    this.props.search && this.props.search(val, feature);
    this.setState({
      capShow: false
    });
  };
  close = () => {
    this.setState({
      capShow: false
    });
  };
  render() {
    let {capShow } = this.state;
    let {imgUrl,val}=this.props;
    const { activeKey } = this.props;
    return (
      <div className="upload-input-view">
        <div className="upload-input-box">
          <Input
            onDrop={this.onDrop}
            onPressEnter={this.search}
            onDragLeave={this.onDragLeave}
            onDragOver={this.onDragOver}
            onChange={this.onChange}
            value={val}
            style={imgUrl ? { paddingLeft: '50px' } : {}}
            className="upload-input"
            placeholder="请输入关键字搜索"
            /*   suffix={
              (val||imgUrl) && <IconFont type={'icon-Close_Main1'} theme="outlined" style={{ fontSize: '16px' }} />
            }   */
          />
          <div className="delete-pic-input">
            {(val || imgUrl) && (
              <IconFont
              onClick={this.deleteImg}
                type={'icon-Close_Main1'}
                theme="outlined"
                style={{ fontSize: '16px' }}
              />
            )}
          </div>
          <div className="camera-btn">
            <label htmlFor="upDate">
              <Input
                type="file"
                ref={this.fileInput}
                accept="image/*"
                id="upDate"
                onChange={this.fileInputChange}
                style={{ visibility: 'hidden', position: 'fixed' }}
              />
              { !imgUrl && <img src={camera} alt="" />}
            </label>
          </div>
          {/* <div className="line"></div> */}
          <div className="search-btn" onClick={this.search}>
            <img src={search} alt="" />
          </div>
          {imgUrl && (
            <div className="img-view">
              <div className="img-box">
                <img src={imgUrl} alt="" />
                {/*  <div className="edit-view" onClick={this.edit}>
                  <Icon type="edit" />
                </div> */}
              </div>
             {/*  <div className="delete-btn">
                <Icon onClick={this.deleteImg} type="close" />
              </div> */}
            </div>
          )}
          {/* capShow && (
            <div className="capture-view-box">
              <div className="close-view">
                <Icon onClick={this.close} type="close-circle-o" />
              </div>
              <p>请框选图片中要识别的区域</p>
              <div className="capview">
                <CaptureViewPlus
                  options={{
                    capture: true,
                    init: true,
                    urlSrc: imgUrl,
                    captureCb: this.captureCb
                  }}
                />
              </div>
            </div>
          ) */}
        </div>
      </div>
    );
  }
}

export default UploadInput;
