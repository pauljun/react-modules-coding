import React, { Component } from 'react';
import { Button,Select,Dropdown,Icon,Menu } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
const splitNum = (data = 0) => {
	return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
class AlarmType extends Component {
    state={

    }
    componentDidMount(){

    }
    componentWillUnmount(){
        
    }
    getOtionTem() {
        let {dataAlarmType} = this.props;
        if(!dataAlarmType){
            dataAlarmType = {}
        }
        let emphasisNum = dataAlarmType.blacklistAlarmCounts || 0;
        let outsideNum = dataAlarmType.whitelistAlarmCounts || 0;
        let integrationNum = dataAlarmType.machineAlarmCounts || 0;
        let myColor = [
            {
                type: 'linear',
                x: 0,y: 0,x2: 0,y2: 1,
                colorStops: [{
                    offset: 0, color: '#8899BB' // 0% 处的颜色
                }, {
                    offset: 1, color: '#8899BB' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }, {
                type: 'linear',
                x: 0,y: 0,x2: 0,y2: 1,
                colorStops: [{
                    offset: 0, color: '#A3B8DC ' // 0% 处的颜色
                }, {
                    offset: 1, color: '#A3B8DC  ' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }, {
                type: 'linear',
                x: 0,y: 0,x2: 0,y2: 1,
                colorStops: [{
                    offset: 0, color: ' #FFAA00 ' // 0% 处的颜色
                }, {
                    offset: 1, color: ' #FFAA00 ' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }, 
        ]

        var data = [{
            value: emphasisNum,
            name:'重点人员告警'
        },{
            value: outsideNum,
            name:'外来人员告警'
        },{
            value: integrationNum,
            name:'专网套件告警'
        }]
        const option = {
             tooltip: {
                trigger: 'item',
                formatter: `{b}: {c}<br/>({d}%)`,
                confine:true
            }, 
          /*    legend: {
                orient: 'horizontal',
                itemHeight: 4,
                itemGap:4,
                bottom:0,
                data: [
                    {
                      name: '重点人员',
                      textStyle: { color: ' #333333' }
                    },
                    {
                      name: '外来人员',
                      textStyle: { color: '#333333' }
                    },
                    {
                      name: '一体化布控报警',
                      textStyle: { color: '#333333' }
                    }
                  ]
            },  */
            color: myColor,
            series: [
                {
                    type:'pie',
                    radius: ['29%', '75%'],
                    emphasis:{
                        itemStyle:{
                           /*  color:{
                                type: 'linear',
                                x: 0,y: 0,x2: 0,y2: 1,
                                colorStops: [{
                                    offset: 0.8, color: '#E5176A  ' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#F22F66 ' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }, */
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data
                },
                {
                    type:'pie',
                    radius: ['75%', '85%'],
                    label: {
                        normal: {
                            show: false,
                            textStyle: {
                              fontSize: 24,
                              color: '#ade3ff'
                            }
                        }
                    },
                    animation:false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                      normal:{
                         opacity:0.3
                      }  
                    },
                    data:data
                }
            ]
        };
                            
        return option;
      }
    render () {
        return (
            <div className='chart'>
                <ReactEcharts option={this.getOtionTem()} style={{height:'calc(100% - 32px)'}}/>
            </div>
        )
    }
}
export default AlarmType;