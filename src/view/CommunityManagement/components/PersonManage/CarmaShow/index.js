import React from 'react';
import IconFont from 'src/components/IconFont';
import doorcamera from '../../../../../assets/img/community/RealPopulation/4_Door_1_Main.svg'
import carcamera from '../../../../../assets/img/community/RealPopulation/5_Car_1_Main.svg'
import { getKeyValue } from "../../../../../libs/Dictionary";
export default class CameraShow extends React.Component {
  constructor(props){
   super(props);
   this.state={
     cameraList:[]
   }
  }
  componentWillReceiveProps(nextProps){
this.setState({
  cameraList:nextProps.CameraList
})
  }
  componentDidMount(){
    const {CameraList}=this.props;
    this.setState({
      cameraList:CameraList
    })
  }
  render() {
    const {cameraList}=this.state;
    let a=0;
    let d=0;
    let g=0;
    let j=0;
    let m=0;
    const b=cameraList.filter(v => v.manufacturerDeviceType!=103407&&v.deviceType==100604).map(v => v.value).map(v => {return (a += parseInt(v,10))} );
   const c=b[b.length-1];//智能枪机
   const e=cameraList.filter(v => v.deviceType==100603).map(v => v.value).map(v => {return (d += parseInt(v,10))} );
   const f=e[e.length-1];//抓拍机
   const h=cameraList.filter(v => v.manufacturerDeviceType==103406).map(v => v.value).map(v => {return (g += parseInt(v,10))} );
   const i=h[h.length-1];//门禁
   const k=cameraList.filter(v => v.manufacturerDeviceType==103407).map(v => v.value).map(v => {return (j += parseInt(v,10))} )
   const l=k[k.length-1];//闸机
   const n=cameraList.filter(v => v.deviceType==100602).map(v => v.value).map(v => {return ( m+=parseInt(v,10))});
   const o=n[n.length-1];//球机
    return (
      <React.Fragment>
        <div className="content_people">
          <div className="content_people_left">
            <IconFont type={'icon-_Camera__Main1'} theme="outlined" />
            <span className="left_title">智能枪机</span>
          </div>
          <div className="content_people_right">{c?c:0}</div>
        </div>
        <div className="content_people">
          <div className="content_people_left">
            <IconFont type={'icon-_Camera__Main'} theme="outlined" />
            <span className="left_title">球机</span>
          </div>
          <div className="content_people_right">{o?o:0}</div>
        </div>
        <div className="content_people">
          <div className="content_people_left">
            <IconFont type={'icon-_Camera__Main3'} theme="outlined" />
            <span className="left_title">抓拍机</span>
          </div>
          <div className="content_people_right">{f?f:0}</div>
        </div>
         <div className="content_people">
          <div className="content_people_left">
            <img src={doorcamera} style={{marginTop:'-2px'}}/>
            <span className="left_title" style={{paddingLeft:'4px'}}>门禁</span>
          </div>
          <div className="content_people_right">{i?i:0}</div>
        </div> 
         <div className="content_people">
          <div className="content_people_left">
            <img src={carcamera} style={{marginTop:'-2px'}}/>
            <span className="left_title" style={{paddingLeft:'4px'}}>闸机</span>
          </div>
          <div className="content_people_right">{l?l:0}</div>
        </div> 
      </React.Fragment>
    );
  }
}
