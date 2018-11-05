import * as util from '../../utils';

export default (options, timeSamp, cb) => {
  let img = document.createElement('img')
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = options.url
  img.onload = () => {    
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let canvasFill = canvas.getContext('2d')
    canvasFill.drawImage(img, 0, 0)
  
    /**水印 */
    let waterMark = {
      text: [options.cameraInfo.name, timeSamp],
      font: '32px 黑体',
      hadowColor: 'rgba(0, 0, 0, 0.3)',
      color: 'rgba(255,255,255,0.2)',
      shadowX: 1,
      shadowY: 1,
      shadowBlur: 1,
      degree: 45,
      width: 400,
      height: 400
    }
    util.addWaterMark(canvas, waterMark);
    let frame = options.frame;
    if (frame && frame.length > 0) {
      for (let i = 0; i < frame.length; i++) {
        const item = frame[i];
        let p1 = item.points[0] - item.points[2] * 0.8
        let p2 = item.points[1] - item.points[3] * 1.5
        let p3 = item.points[2] * 2.6
        let p4 = item.points[3] * 3.2
        if (options.type === 'body') {
          p1 = item.points[0] - item.points[2] * 0.2
          p2 = item.points[1] - item.points[3] * 0.2
          p3 = item.points[2] * 1.4
          p4 = item.points[3] * 1.4
        }
        canvasFill.strokeStyle = item.color || 'red'
        canvasFill.lineWidth = item.width || 4
        canvasFill.save();
        canvasFill.moveTo(p1, p2);
        canvasFill.lineTo(p1 + p3, p2);
        canvasFill.lineTo(p1 + p3, p2 + p4);
        canvasFill.lineTo(p1, p2 + p4);
        canvasFill.lineTo(p1, p2 - (frame.width / 2 || 2));
        canvasFill.restore();
      }
      canvasFill.stroke();
    }
    let url = canvas.toDataURL('image/jpeg', .8)
    cb(url)
  }
}