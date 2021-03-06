import React from 'react';
import { message, Icon } from 'antd';
import './captureViewPlus.scss';
function getElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const docEl = document.documentElement;
  const rectTop = (rect.top + window.pageYOffset) - docEl.clientTop;
  const rectLeft = (rect.left + window.pageXOffset) - docEl.clientLeft;
  return {
    top: rectTop,
    left: rectLeft,
  };
}

function getClientPos(e) {
  let pageX;
  let pageY;

  if (e.touches) {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
  } else {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  return {
    x: pageX,
    y: pageY,
  };
}

class CaptureViewPlus extends React.Component {
  state = {
    viewHeight: 300,
    viewWidth: 300,
    boxLeft: 0,
    boxTop: 0,
    boxWidth: 0,
    boxHeight: 0,
    boxShow: false,
    nowBoxLeft: 0,
    nowBoxTop: 0,
    nowBoxWidth: 0,
    nowBoxHeight: 0,
    firstClientPos: { x: 0, y: 0 },
    resizeType: '',
    ord: '',
    top: 0,
    left: 0,
    nowTop: 0,
    nowLeft: 0,
    rotate: 0,
    scale: 1,
    catureState: false,//是否为框选截图状态
    initTop: 0,
    initLeft: 0,
    capture: false,
    rotateButton: true,
    imgUrl: '' || this.props.options.urlSrc,
    scan: 1,
    coverSpinShow: false
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentDidMount() {
    let { options, itemDetail } = this.props
    document.addEventListener('mousemove', this.onMouseTouchMove);
    document.addEventListener('mouseup', this.onMouseTouchEnd);
    this.getImgurl(options)
    if (options.init) {
      let width = (options.width && options.width.replace('px', '') * 1) ||300
      let height = (options.height && options.height.replace('px', '') * 1) || 300
      this.setState({
        boxShow: true,
        catureState: true,
        boxLeft: width / 4,
        boxTop: height / 4,
        boxWidth: width / 2,
        boxHeight: height / 2,
        nowBoxLeft: width / 4,
        nowBoxTop: height / 4,
        nowBoxWidth: width / 2,
        nowBoxHeight: height / 2,
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.itemDetail) {
      this.setState({
        coverSpinShow: true
      })
    }
    if (nextProps.options.urlSrc !== this.state.imgUrl) {
      this.getImgurl(nextProps.options)
    }
  }

  getImgurl = (options) => {
    let { height, width, urlSrc, capture, rotate, type } = options
    if (width && typeof width === 'string') {
      width = width.replace('px', '') * 1
    }
    if (height && typeof height === 'string') {
      height = height.replace('px', '') * 1
    }
    let viewWidth = width || 300,
      viewHeight = height || 300,
      im = document.createElement('img')
    type = type || 'face'
    im.setAttribute('crossOrigin', 'anonymous')
    im.src = urlSrc
    im.onload = () => {
      let scan = (viewWidth / im.width) * (im.height / viewHeight)
      this.setState({
        viewWidth,
        viewHeight,
        scan,
      })
      if (scan >= 1) {
        this.setState({
          top: 0,
          left: (width - im.width * viewHeight / im.height) / 2,
          nowTop: 0,
          nowLeft: (width - im.width * viewHeight / im.height) / 2,
          initTop: 0,
          initLeft: (width - im.width * viewHeight / im.height) / 2,
        })
      } else if (scan < 1) {
        this.setState({
          top: (height - im.height * viewWidth / im.width) / 2,
          left: 0,
          nowTop: (height - im.height * viewWidth / im.width) / 2,
          nowLeft: 0,
          initTop: (height - im.height * viewWidth / im.width) / 2,
          initLeft: 0,
        })
      }
      if (capture) {
        this.setState({
          capture: true
        })
      }


      let canvas = document.im = document.createElement('canvas')
      canvas.width = im.width;
      canvas.height = im.height;


      let canvas1Fill = canvas.getContext('2d');
      canvas1Fill.drawImage(im, 0, 0);

      let frame = this.props.options.frame;
      if (frame && frame.length > 0) {
        for (let i = 0; i < frame.length; i++) {
          const item = frame[i];
          let p1 = item.points[0] - item.points[2] * 0.4
          let p2 = item.points[1] - item.points[3] * 0.8
          let p3 = item.points[2] * 1.8
          let p4 = item.points[3] * 1.8
          if (type === 'body') {
            p1 = item.points[0] * 1
            p2 = item.points[1] * 1
            p3 = item.points[2] * 1
            p4 = item.points[3] * 1
          }

          canvas1Fill.strokeStyle = item.color || 'red'
          canvas1Fill.lineWidth = item.width || 4
          canvas1Fill.save();
          canvas1Fill.moveTo(p1, p2);
          canvas1Fill.lineTo(p1 + p3, p2);
          canvas1Fill.lineTo(p1 + p3, p2 + p4);
          canvas1Fill.lineTo(p1, p2 + p4);
          canvas1Fill.lineTo(p1, p2 - (frame.width / 2 || 2));
          canvas1Fill.restore();
        }
        canvas1Fill.stroke();

      }

      let url = canvas.toDataURL('image/jpeg', .8);
      this.setState({
        imgUrl: url,
        coverSpinShow: false
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseTouchMove);
    document.removeEventListener('mouseup', this.onMouseTouchEnd);
  }


  onViewMouseTouchDown = (e) => {
    if (e.target !== this.refs.imgmask) {
      return
    }
    e.preventDefault();
    this.mouseDownStatw = true
    const clientPos = getClientPos(e);
    this.setState({
      firstClientPos: clientPos,
      resizeType: '',
    })
  }

  onCropMouseTouchDown = (e) => {
    e.preventDefault();
    this.mouseDownStatw = true;
    const clientPos = getClientPos(e);
    this.setState({
      firstClientPos: clientPos,
      resizeType: e.target === this.refs.box ? 'drag' : 'resize',
      ord: e.target.dataset.ord || 'con'
    })

  }

  onMouseTouchMove = (e) => {
    if (!this.mouseDownStatw) {
      return
    }
    let { firstClientPos, resizeType, boxWidth, boxHeight, boxLeft, boxTop, nowBoxLeft, nowBoxTop, nowBoxWidth, nowBoxHeight, ord, catureState, boxShow, nowTop, nowLeft, rotate, left, top, scale } = this.state
    let { width, height } = this.props.options
    const imageOffset = getElementOffset(this.refs.imgmask);
    const clientPos = getClientPos(e);
    let cx = clientPos.x, cy = clientPos.y, fx = firstClientPos.x, fy = firstClientPos.y,
      xPos = cx - fx,//x位移
      yPos = cy - fy //y位移
    if (catureState && boxShow) {
      if (!resizeType) {
        //画框
        if (xPos >= 0) {
          boxWidth = xPos
          boxLeft = fx - imageOffset.left
        } else {
          boxWidth = 0 - xPos
          boxLeft = cx - imageOffset.left
        }
        if (yPos >= 0) {
          boxHeight = yPos
          boxTop = fy - imageOffset.top
        } else {
          boxHeight = 0 - yPos
          boxTop = cy - imageOffset.top
        }
      } else if (resizeType === 'drag') {
        //拖拽框
        boxLeft = nowBoxLeft + xPos;
        boxTop = nowBoxTop + yPos;
      } else if (resizeType === 'resize') {
        //改变框的大小
        const wInversed = ord === 'nw' || ord === 'w' || ord === 'sw';//左
        const eInversed = ord === 'ne' || ord === 'e' || ord === 'se';//右
        const nInversed = ord === 'nw' || ord === 'n' || ord === 'ne';//上
        const sInversed = ord === 'sw' || ord === 's' || ord === 'se';//下
        if (wInversed) {
          if (nowBoxWidth - xPos >= 0) {
            boxLeft = nowBoxLeft + xPos;
            boxWidth = nowBoxWidth - xPos
          } else {
            boxLeft = nowBoxLeft + nowBoxWidth
            boxWidth = xPos - nowBoxWidth
          }
        }
        if (eInversed) {
          if (nowBoxWidth + xPos >= 0) {
            boxWidth = nowBoxWidth + xPos
          } else {
            boxWidth = 0 - (nowBoxWidth + xPos)
            boxLeft = nowBoxLeft + nowBoxWidth + xPos
          }
        }
        if (nInversed) {
          if (nowBoxHeight - yPos >= 0) {
            boxTop = nowBoxTop + yPos
            boxHeight = nowBoxHeight - yPos
          } else {
            boxTop = nowBoxTop + nowBoxHeight
            boxHeight = yPos - nowBoxHeight
          }
        }
        if (sInversed) {
          if (nowBoxHeight + yPos >= 0) {
            boxHeight = nowBoxHeight + yPos
          } else {
            boxHeight = 0 - (nowBoxHeight + yPos)
            boxTop = nowBoxTop + nowBoxHeight + yPos
          }
        }
      }
      //根据选择的角度来限制框选的区域
      rotate = rotate % 360
      let img = this.refs.img,
        imgWidth = img.width,
        imgHeight = img.height,
        imgLeft = left,
        imgTop = top
      if (rotate === 90 || rotate === 270) {
        imgLeft = left + (imgWidth - imgHeight) / 2
        imgTop = top + (imgHeight - imgWidth) / 2
        imgWidth = img.height
        imgHeight = img.width
      }
      let scanWidth = imgWidth * (1 - scale) * 0.5 //相较于为缩放前的宽度差的一半
      let scanHeight = imgHeight * (1 - scale) * 0.5//相较于为缩放前的高度差的一半
      imgLeft = imgLeft + scanWidth
      imgTop = imgTop + scanHeight
      let ruleLeft = imgLeft >= 0 ? imgLeft : 0
      let ruleTop = imgTop >= 0 ? imgTop : 0

      boxLeft = boxLeft >= ruleLeft ? boxLeft : ruleLeft
      boxTop = boxTop >= ruleTop ? boxTop : ruleTop
      if (resizeType !== 'drag') {
        boxWidth = boxWidth >= imgWidth * scale - boxLeft + imgLeft ? imgWidth * scale - boxLeft + imgLeft : boxWidth
        boxHeight = boxHeight >= imgHeight * scale - boxTop + imgTop ? imgHeight * scale - boxTop + imgTop : boxHeight

        if (boxWidth + boxLeft >= width) {
          boxWidth = width - boxLeft
        }
        if (boxHeight + boxTop >= height) {
          boxHeight = height - boxTop
        }
      } else {
        let ruleWidth = imgLeft + imgWidth - scanWidth * 2 >= width ? width : imgLeft + imgWidth - scanWidth * 2
        let ruleHeight = imgTop + imgHeight - scanHeight * 2 >= height ? height : imgTop + imgHeight - scanHeight * 2
        boxLeft = boxLeft + boxWidth >= ruleWidth ? ruleWidth - boxWidth : boxLeft
        boxTop = boxTop + boxHeight >= ruleHeight ? ruleHeight - boxHeight : boxTop
      }
      /*渲染截图框*/
      this.setState({
        boxLeft,
        boxTop,
        boxWidth,
        boxHeight,
      })
    } else {
      this.setState({
        left: nowLeft + xPos,
        top: nowTop + yPos,
      })
    }

  }
  onMouseTouchEnd = (e) => {
    if (!this.mouseDownStatw) {
      return
    }
    this.mouseDownStatw = false
    let { boxLeft, boxTop, boxWidth, boxHeight, left, top } = this.state
    this.setState({
      nowBoxLeft: boxLeft,
      nowBoxTop: boxTop,
      nowBoxWidth: boxWidth,
      nowBoxHeight: boxHeight,
      nowLeft: left,
      nowTop: top,
    })
  }

  handleGetCapture = () => {
    let { boxTop, boxLeft, boxWidth, boxHeight, top, left, scale, rotate } = this.state
    let canvas = document.createElement('canvas')
    let img = this.refs.img
    let image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = img.src
    image.onload = () => {
      //计算缩放后的高和和宽的差值,来确保截图的位置正确
      let scan = image.width / (img.width * scale)
      //用于绘制旋转后的图片
      rotate = rotate % 360
      let canvas1 = document.createElement('canvas')
      if (rotate === 0 || rotate === 180) {
        canvas1.width = image.width;
        canvas1.height = image.height;
      } else if (rotate === 90 || rotate === 270) {
        canvas1.width = image.height;
        canvas1.height = image.width;
      }
      let canvas1Fill = canvas1.getContext('2d');
      canvas1Fill.translate(canvas1.width / 2, canvas1.height / 2);//设置画布上的(0,0)位置，也就是旋转的中心点
      canvas1Fill.rotate(rotate * Math.PI / 180);
      canvas1Fill.save();//保存状态
      canvas1Fill.drawImage(image, -image.width / 2, -image.height / 2);//把图片绘制在旋转的中心点，
      canvas1Fill.restore();//恢复状态
      let src1 = canvas1.toDataURL('image/jpeg', .8);
      let im = new Image();
      im.crossOrigin = "Anonymous";
      im.src = src1;
      let canvasFill = canvas.getContext('2d');
      canvas.width = this.state.boxWidth;
      canvas.height = this.state.boxHeight;

      //计算旋转缩放后的截图起点位置

      let scanWidth = img.width * (1 - scale) * 0.5 //相较于为缩放前的宽度差的一半
      let scanHeight = img.height * (1 - scale) * 0.5//相较于为缩放前的高度差的一半
      left=0
      top=0
      let startX = boxLeft - left - scanWidth
      let startY = boxTop - top - scanHeight
      setTimeout(() => {
          canvasFill.drawImage(im, startX * scan, startY * scan, canvas.width * scan, canvas.height * scan, 0, 0, canvas.width, canvas.height)
        let src = canvas.toDataURL('image/jpeg', .8);
        if (src === 'data:,') {
          message.warn('请先框选图片')
          return
        }
        this.props.options.captureCb(src)
      }, 50)
    }
  }

  render() {
    let { coverSpinShow, boxWidth, boxHeight, boxLeft, boxTop, boxShow, top, left, scale, rotate, scan, catureState, viewWidth, viewHeight, capture, rotateButton, imgUrl } = this.state
    let { classname, isScan, isScale, isRotate, isDownload, isStorage, isOriginPic, showOriginDetail, styles, isContrast } = this.props
    let imgWidthStyle = 'auto'
    let imgHeightStyle = 'auto'
    let type = '人脸'
    if (this.props.options && this.props.options.type === 'body') {
      type = '人体'
    }
    if (scan >= 1) {
      imgHeightStyle = '100%'
    } else {
      imgWidthStyle = '100%'
    }

    return (
      <div className='capture-view' style={{ width: viewWidth }}>
        <div
          className='capture-view-plus'
          style={{ width: viewWidth, height: viewHeight }}
          onMouseDown={this.onViewMouseTouchDown}
          onWheel={this.handleWheel}
          onDoubleClick={this.handleDoubleClick}
        >
          <div className={coverSpinShow ? 'img coverSpin' : 'img'} >
            <div className='imgmask' ref='imgmask' style={{ cursor: catureState ? 'crosshair' : 'move' }}></div>
            <img
              ref='img'
              src={imgUrl}
              style={{
                top: top,
                left: left,
                transform: 'scale(' + scale + ')rotate(' + rotate + 'deg)',
                width: imgWidthStyle && imgWidthStyle,
                height: imgHeightStyle && imgHeightStyle
              }}
            />

          </div>
          {
            boxShow &&
            <div
              className='capture-box'
              ref='box'
              style={{ width: boxWidth, height: boxHeight, left: boxLeft, top: boxTop }}
              onMouseDown={this.onCropMouseTouchDown}
            >
              <div className='drag-box'>
                <div className='drag-bar ord-n' data-ord='n'></div>
                <div className='drag-bar ord-e' data-ord='e'></div>
                <div className='drag-bar ord-s' data-ord='s'></div>
                <div className='drag-bar ord-w' data-ord='w'></div>
                <div className='drag-handle ord-nw' data-ord='nw'></div>
                <div className='drag-handle ord-n' data-ord='n'></div>
                <div className='drag-handle ord-ne' data-ord='ne'></div>
                <div className='drag-handle ord-e' data-ord='e'></div>
                <div className='drag-handle ord-se' data-ord='se'></div>
                <div className='drag-handle ord-s' data-ord='s'></div>
                <div className='drag-handle ord-sw' data-ord='sw'></div>
                <div className='drag-handle ord-w' data-ord='w'></div>
              </div>
            </div>
          }
        </div>
        <button className='success' onClick={this.handleGetCapture}> 完成 </button>
      </div>
    )
  }
}

export default CaptureViewPlus;
