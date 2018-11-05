import React from 'react';
import './index.scss';
import CaptureViewPlus from 'src/view/components/ImageView/captureViewPlus.jsx'
import imgUrl from 'src/assets/img/aaa.jpg'

import { message ,Button,Icon} from 'antd';
class BaseImageView extends React.Component{
  state= {
    urlSrc:'',
    mouseDownStatus:false,
    firstMouseX:0,
    firstMouseY:0,
    top:'50%',
    left:'50%',
    translatex:'-50%',
    translatey:'-50%',
    rotate:0,
    scale:1,
    nowTop:0,
    nowLeft:0,
    viewWidth:0,
    viewHeight:0,
    show:true,
    firstClick:true,
    imgType:false,//图片的高宽比 (offsetHeight/offsetWidth) >=1为true <1为false 默认宽图
    captureSrc:'',
    imgWidth:0,
    imgHeight:0,
  }
  componentDidMount() {
    this.setState({
      viewWidth:this.props.width||500,
      viewHeight:this.props.height||500,
      urlSrc:this.props.urlSrc||imgUrl,
      show:this.props.show,
    })
  }
  handleMouseDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if(this.state.firstClick){
      let top=this.refs.img.offsetTop-(this.refs.img.offsetHeight/2)
      let left=this.refs.img.offsetLeft-(this.refs.img.offsetWidth/2)
      let imgType= this.refs.img.offsetHeight/this.refs.img.offsetWidth>=1?true:false
      this.setState({
        top:top,
        left:left,
        nowTop:top,
        nowLeft:left,
        imgType:imgType,
        firstClick:false,
      })
    }
    this.setState({
      mouseDownStatus:true,
      firstMouseX:e.clientX,
      firstMouseY:e.clientY,
      translatex:0,
      translatey:0,
    })
  }
  handleMouseMove = (e) => {
    if(!this.state.mouseDownStatus){
      return
    }
    let {firstMouseX,firstMouseY,top,left,nowTop,nowLeft}=this.state
    this.setState({
      top:nowTop + e.clientY - firstMouseY,
      left:nowLeft + e.clientX - firstMouseX
    })

  }
  handleMouseUp = (e) => {
    this.setState({
      mouseDownStatus:false,
      nowTop:this.state.top,
      nowLeft:this.state.left,
    })
  }
  handleMouseOut = (e) => {
    this.setState({
      mouseDownStatus:false,
      nowTop:this.state.top,
      nowLeft:this.state.left,
    })
  }
  handleDoubleClick = (e) => {
    this.setState({
      mouseDownStatus:false,
      firstMouseX:0,
      firstMouseY:0,
      top:'50%',
      left:'50%',
      translatex:'-50%',
      translatey:'-50%',
      rotate:0,
      firstClick:true,
      nowTop:0,
      nowLeft:0,
      scale:1,
    })
  }
  handleWheel = (e) => {
    let scale=this.state.scale;
    scale-=e.deltaY/1000
    message.destroy()
    if(scale<0.4){
      message.warn('已缩放到最小级别')
      return
    }
    if(scale>2.1){
      message.warn('已缩放到最大级别')
      return
    }
    this.setState({
      scale
    })
  }
  /*旋转*/
  clockwise = (deg) => {
    this.setState({
      rotate:this.state.rotate+deg
    })
  }

  /*点击截图按钮*/
  handleCapture = () => {
    if(this.state.firstClick){
      let imgType= this.refs.img.offsetHeight/this.refs.img.offsetWidth>=1?true:false
      let top=this.refs.img.offsetTop-(this.refs.img.offsetHeight/2)
      let left=this.refs.img.offsetLeft-(this.refs.img.offsetWidth/2)
      let im = document.createElement('img');
        im.src = this.state.urlSrc

      this.setState({
        top:top,
        left:left,
        nowTop:top,
        nowLeft:left,
        firstClick:false,
        imgType:imgType,
        translatex:0,
        translatey:0,
        imgWidth:im.width,
        imgHeight:im.height,
      })
    }
    this.setState({
      show:true,
    })

  }
  render(){
    let {urlSrc,top,left,width,scale,viewWidth,viewHeight,show,translatex,translatey,imgType,captureSrc,rotate,imgWidth,imgHeight}=this.state
    return (
      <div
        className='base-image-view'
       style= {{width:viewWidth,height:viewHeight}}
      >
        <div
          className='image-view'
          onMouseDown= {this.handleMouseDown}
          onMouseMove= {this.handleMouseMove}
          onMouseUp = {this.handleMouseUp}
          onMouseOut = {this.handleMouseOut}
          onDoubleClick = {this.handleDoubleClick}
          onWheel = {this.handleWheel}
        >
          <img
            src= {urlSrc}
            style= {{top:top,left:left,transform:'translate('+translatex+','+translatey+')scale('+scale+')rotate('+rotate+'deg)'}}
            ref='img'
          />
        </div>
        {
          // show&&
          // <CaptureView
          //   options= {{
          //     show,
          //     urlSrc,
          //     top,
          //     left,
          //     rotate,
          //     viewWidth,
          //     viewHeight,
          //     scale,
          //     imgType,
          //     ok:(captureSrc) => {
          //       this.setState({
          //         captureSrc:captureSrc
          //       })
          //     },
          //     close:() => {
          //       this.setState({
          //         show:false
          //       })
          //     }
          //   }}
          // />
        }
         {
          show&&
          <CaptureViewPlus
            options= {{
              show,
              urlSrc,
              top,
              left,
              rotate,
              viewWidth,
              viewHeight,
              scale,
              imgType,
              imgWidth,
              imgHeight,
              ok:(captureSrc) => {
                this.setState({
                  captureSrc:captureSrc
                })
              },
              close:() => {
                this.setState({
                  show:false
                })
              }
            }}
          />
        }
        <Button
           type='primary'
           icon='picture'
           onClick= {this.handleCapture}
        >
          框选
        </Button>
        <Button
           type='primary'
           icon='reload'
           onClick= {this.clockwise.bind(this,270)}
           style= {{transform:'rotateY(180deg)'}}
        >
        </Button>
        <Button
           type='primary'
           icon='reload'
           onClick= {this.clockwise.bind(this,90)}
        >
        </Button>
        <div>
          <img src= {captureSrc}/>
        </div>
      </div>
    )
  }
}

export default BaseImageView;
