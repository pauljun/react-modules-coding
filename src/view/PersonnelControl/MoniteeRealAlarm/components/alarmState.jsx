import React, { Component } from 'react';
import { Button, Select, Dropdown, Icon, Menu } from 'antd';
import ReactEcharts from 'echarts-for-react';
import util from '../components/util/util';
class ResourceTendencyStatic extends Component {
  componentDidMount() {
    const beginDay = util.getDayYMD(-6);
    const endDay = util.getDayYMD(0);
    let options = { beginDay, endDay };
  }
  getOtionTem() {
    let { resourcesTrendStatis=[] } = this.props;
    if (!resourcesTrendStatis) {
      resourcesTrendStatis = [];
    }

    const totalRecource = resourcesTrendStatis.map(v => v.black);
    const bodyNumRecource = resourcesTrendStatis.map(v => v.white);
    const faceNumRecource = resourcesTrendStatis.map(v => v.special);
    //近一周的日期数组
    const weekDays = [
      util.getDay(-7),
      util.getDay(-6),
      util.getDay(-5),
      util.getDay(-4),
      util.getDay(-3),
      util.getDay(-2),
      util.getDay(-1)
    ];

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        confine: true
      },
      grid: {
        x: 63,
        y: 10,
        x2: 30,
        y2: 43,
        borderWidth: 0
      },
      legend: {
        orient: 'horizontal',
        icon: 'rect',
        itemGap: 6,
        itemWidth: 20,
        itemHeight: 4,
        bottom: -5,
        // padding: [0,0,50,0],
        pageButtonGap: 1,
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
            name: '专网套件',
            textStyle: { color: '#333333' }
          }
        ]
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.5],
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          /* rotate:30, */
          textStyle: {
            color: '#333333'
          }
        },
        splitLine: {
          lineStyle: {
            color: ['#D8DCE3']
          }
        }
      },
      yAxis: {
        type: 'category',
        data: weekDays,
        axisTick: false,
        axisLine: {
          show: false
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
          barWidth: 4,
          barGap: 0.8,
          name: '重点人员',
          type: 'bar',
          label: {
            emphasis: {
              show: true,
              position: 'right',
              textStyle: {
                fontSize: '12',
                color: '#5A60A2'
              }
            }
          },
          data: totalRecource,
          itemStyle: {
            normal: { color: '#5A60A2' }
          }
        },
        {
          barWidth: 4,
          barGap: 0.8,
          name: '外来人员',
          type: 'bar',
          label: {
            emphasis: {
              show: true,
              position: 'right',
              textStyle: {
                fontSize: '12',
                color: '#8899BB'
              }
            }
          },
          data: bodyNumRecource,
          itemStyle: {
            normal: { color: '#8899BB' }
          }
        },
        {
          barWidth: 4,
          barGap: 0.8,
          name: '专网套件',
          type: 'bar',
          label: {
            emphasis: {
              show: true,
              position: 'right',
              textStyle: {
                fontSize: '12',
                color: '#FFAA00'
              }
            }
          },
          data: faceNumRecource,
          itemStyle: {
            normal: { color: '#FFAA00' }
          }
        }
      ]
    };

    return option;
  }
  render() {
    let { cardLength } = this.props;
    return (
      <div className="chart">
        <ReactEcharts
          option={this.getOtionTem()}
          style={{ height: 'calc(100% - 32px)' }}
        />
      </div>
    );
  }
}
export default ResourceTendencyStatic;
