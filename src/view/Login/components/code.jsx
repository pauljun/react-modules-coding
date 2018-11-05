import React from 'react'
import { Divider, message } from 'antd'
import { observer, inject } from 'mobx-react';
@inject( 'UserStore')
@observer

class view extends React.Component{
  constructor(){
    super()
    this.loading = false
  }

  state = {
    timer: 60
  }

  /**发送验证码 */
  sendCode = () => {
    if(this.loading){
      return
    }
    let values = this.props.getPhoneNum()
    if (!values.phoneNum){
      message.warning('请输入手机号')
      return
    }
    this.loading = true
    this.props.UserStore.sendLoginIdentifyCode(values.phoneNum).then(() => {
      let intTimer = setInterval(() => {
        let { timer } = this.state
        timer--
        if(timer === 0){
          clearInterval(intTimer)
          this.setState({ timer: 60 })
          this.loading = false
          return
        }
        this.setState({timer})
      }, 1000)
    })
  }

  render(){
    const {
      timer
     } = this.state
    return(
      <div className="login-send-code">
        <Divider type="vertical" />
        {timer === 60 ? <span onClick={this.sendCode}>获取验证码</span> : `${timer}s`}
      </div>
    )
  }
}

export default view