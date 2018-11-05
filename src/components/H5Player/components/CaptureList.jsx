import React, { Component } from 'react';
import { Button, Icon, Carousel, Modal } from 'antd';
// import ImgHandle from 'src/view/components/ImageView/captureViewPlus';

class CaptureList extends Component {
  state = {
    visible: false,
    imgUrl: '',
  }

  onSelectImg = (v) => {
    console.log(v)
    this.setState({
      visible: true,
      imgUrl:v.url,
    })
  }
  modalClick = (type) => {
    const { imgUrl } = this.state;
    const { captureData } = this.props;
    let index;
    captureData.every((v, k) => {
      if (v.url === imgUrl) {
        index = k
        return false
      }
      return true
    })
    switch (type) {
      case 'prev':
        index--;
        index = index < 0 ? captureData.length - 1 : index;
        break;
      case 'next':
        index++;
        index = index >= captureData.length ? 0 : index;
        break;
      default: break
    }
    this.setState({
      imgUrl: captureData[index].url
    })
  }
  
  render () {
    const { captureData, clearCapture, delImg } = this.props;
    const { visible, imgUrl } = this.state;
    const config = {
      dots: false,
      infinite: false, // 无限循环
      slidesToShow: 4,
      slidesToScroll: 1, 
      arrows: true,
      responsive: [
        { breakpoint: 347, settings: { slidesToShow: 3 } },
        { breakpoint: 463, settings: { slidesToShow: 4 } },
        { breakpoint: 700, settings: { slidesToShow: 5 } },
        { breakpoint: 1399, settings: { slidesToShow: 10 } }, 
      ]
    };
    return (
      <div className='capture-list'>
        <Icon className='close-list' onClick={clearCapture} type='close' />
        <Carousel {...config}>
        {
          captureData.map((v,k) => {
            return (
              <div key={v.time}
                className='capture-item'
                onClick={() => this.onSelectImg(v)}
              >
                <Icon 
                  className='delete-img' 
                  type='close' 
                  onClick={(e) => delImg(e,k)} 
                />
                <img 
                  className='capture-img'
                  draggable={false}
                  src={v.url} 
                />
              </div>
            )
          })
        }
        </Carousel>
        <Modal
          title='截图列表'
          footer={null}
          width={800}
          visible={visible}
          onCancel={() => this.setState({visible:false})}
        > 
          <Icon type='left' onClick={() => this.modalClick('prev')} />
          {/* <ImgHandle
            key={imgUrl}
            options={{
              urlSrc: imgUrl,
              width: 600,
              height: 500,
            }}
          /> */}
          <Icon type='right' onClick={() => this.modalClick('next')} />  
        </Modal>
      </div>
    )
  }
  
}

export default CaptureList;
