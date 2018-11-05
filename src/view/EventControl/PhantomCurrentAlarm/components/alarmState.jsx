import React, { Component } from 'react';
import { Button, Select, Dropdown, Icon, Menu } from 'antd';
import ReactEcharts from 'echarts-for-react';
 import util from '../components/util/util' 
class ResourceTendencyStatic extends Component {
    getOtionTem() {
        let {resourcesTrendStatis} = this.props;
        if(!resourcesTrendStatis){
            resourcesTrendStatis= [];
        }

        const totalRecource = resourcesTrendStatis.map(v => v.event);
       // const totalRecource=[800,760,0,0,0,0,0]
        const bodyNumRecource = resourcesTrendStatis.map(v => v.bodyNum);
        const faceNumRecource = resourcesTrendStatis.map(v => v.faceNum);
        //近一周的日期数组
        const weekDays = [util.getDay(-7),util.getDay(-6),util.getDay(-5),util.getDay(-4),util.getDay(-3),util.getDay(-2),util.getDay(-1)]
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                confine: true
            },
            grid:{
                x:63,
                y:10,
                x2:30,
                y2:50,
                borderWidth:0
            },
            legend: {
                orient: 'horizontal',
                icon:'rect',
                itemGap:6,
                itemWidth:20,
                itemHeight:4,
                bottom:-5,
                data: [{
                    name: '魅影布防',
                    textStyle: { color: " #333333" },
                }
                ],
            },
             xAxis: {
                type: 'value',
                boundaryGap: [0, 0.5],
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel: {
                    show: true,
                    /* rotate:30, */
                    textStyle: {
                        color: '#333333'
                    }
                } ,
                splitLine:{
                    lineStyle: {
                        color: ['#D8DCE3']
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: weekDays,
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel: {
                    interval:0,
                    show: true,
                    textStyle: {
                        color: '#333333'
                    }
                }
            },
            series: [
                {
                    barWidth: 8,
                    barGap: 0.8,
                    name: '魅影布防',
                    type: 'bar',
                    label: {
                        emphasis: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                fontSize: '12',
                                color: ' #8899BB'
                            }
                        }
                    },
                    data: totalRecource,
                    itemStyle:{
                        normal:{color:' #8899BB'},
                    },
                }
            ]
        };

        return option;
    }
    render() {
        let {cardLength} = this.props
        return (
            <div className='chart'>
                <ReactEcharts option={this.getOtionTem()} style={{height:'calc(100% - 32px)'}}/>
            </div>
        )
    }
}
export default ResourceTendencyStatic;