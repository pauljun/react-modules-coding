import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss'

let domIndex = 0;

export default class BlurMask extends React.Component {
  constructor(props) {
    super(props);
    domIndex++;
    this.id = `detail-layout-for-body-${domIndex}`;
    this.node = null
    this.createELE();
  }

  /**
   * 是否显示 (showDetail 必传)
   * @param {boolean} showDetail
   * 层级
   * @param {Number} zIndex
   * 自定义样式
   * @param {string} className
   */
  createELE() {
    const { showDetail, zIndex, className } = this.props;
    this.ele = document.getElementById(this.id);
    this.ele = document.createElement('div');
    this.ele.setAttribute('id', this.id);
    this.ele.setAttribute(
      'class',
      `layout-DetailView ${className ? className : ''} ${!showDetail ? 'layout-DetailView-hide' : ''}`
    );
    typeof zIndex === 'number' && (this.ele.style.zIndex = zIndex);
    document.body.appendChild(this.ele);
    this.createEvent()
  }
  removeDom(id) {
    const ele = document.getElementById(id);
    ReactDOM.unmountComponentAtNode(ele);
    document.body.removeChild(ele);
    this.removeEvent()
  }
  /**
   * 需要模糊的父节点 (node 必传)
   * @param {string} node
   * 模糊度
   * @param {Number} blur 
   */
  componentWillReceiveProps(nextProps) {
    const { showDetail, className, node, blur } = nextProps;
    this.node = document.querySelector(node)
    if (showDetail !== this.props.showDetail) {
      if (showDetail) {
        this.node.style.filter = `blur(${blur || 5}px)`;
        this.node.style.background = 'rgba(0,0,0,.3)'
      } else {
        this.node.style.filter = 'none';
        this.node.style.background = 'transparent'
      }
      this.ele.setAttribute(
        'class',
        `layout-DetailView ${className ? className : ''} ${!showDetail ? 'layout-DetailView-hide' : ''}`
      );
    }
  }
  /**
   * 创建点击事件监听
   */
  createEvent() {
    // 绑定Node点击情况
    this.ele && this.ele.addEventListener('click', this.onNodeClick.bind(this), true)
  }
  /**
   * 取消点击事件监听
   */
  removeEvent() {
    // 取消绑定Node点击情况
    this.ele && this.ele.removeEventListener('click', this.onNodeClick.bind(this), true)
  }

  /**
   * 关闭事件 (click 必传)
   * @param {func} click
   */
  onNodeClick(e) {
    e.stopPropagation()
    if (e.target === this.ele) {
      this.props.click && this.props.click()
    }
  }

  componentWillUnmount() {
    this.node = null
    this.removeDom(this.id)
    this.removeEvent()
  }
  render() {
    const { showDetail } = this.props;
    return ReactDOM.createPortal(
      showDetail ? (
        <div className="details-view">
          {this.props.children}
        </div>
      ) : (
          <React.Fragment />
        ),
      this.ele
    );
  }
}
//测试用例
// import React from 'react'
// import BlurMask from '../../components/BlurMask'

// export default class JurisdictionOverview extends React.Component {
//   constructor() {
//     super()
//     this.state = {
//       show: false
//     }
//   }
//   ons = () => {
//     this.setState({ show: true })
//   }
//   off = () => {
//     this.setState({ show: false })
//   }
//   render() {
//     return 
//     <div id='bg' style={{ height: '100%' }}>
//       <span onClick={this.ons}>3333333</span>
//         <BlurMask
//           showDetail={this.state.show}
//           node={'#bg'}
//           blur={3}
//           zIndex={99}
//           click={this.off}
//         >
//         <span style={{ width: '200px', height: '200px', display: 'block', background: '#fff' }} >4444444444</span>
//       </BlurMask>
//     </div>
//   }
// }