import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form, Button, Input, Icon, message } from 'antd';
import { setCacheItem } from '../../utils';
import { Base64 } from 'js-base64';
import footerLogin from 'src/assets/login/Logo_2.svg';
import google from 'src/assets/login/Chrome.svg';
import downloadPic from 'src/assets/login/DownLoad_Hover.svg';
import logo from 'src/assets/img/logo.png';
import ChangePwdMarkView from 'src/view/Layout/components/changePwd';
import CodeView from './components/code';
import CityLightsHD from 'src/assets/login/City-Lights_HD.mp4';
import CityLightsHDPoster from 'src/assets/login/City-Lights_HD.jpg';
import User from '../../service/RequestUrl/user';
import moment from 'moment';
import './index.scss';

const FormItem = Form.Item;
@withRouter
@inject('UserStore', 'LoggerStore')
@observer
class LoginView extends Component {
  state = {
    changePwdVisible: false,
    //登录方式,: 默认账号密码登录, false:手机验证码登录
    userPswLogin: true
  };
  componentWillMount() {
    let { UserStore, history } = this.props;
    window.ReactHistory = history;
    const isLogin = UserStore.isLogin;
    if (isLogin) {
      history.replace('/');
    }
  }

  /**获取手机号码 */
  getPhoneNum = () => {
    return this.props.form.getFieldsValue();
  };

  // 登录
  submitEvent = e => {
    e.preventDefault();
    const log = this.Logger;
    const { UserStore, history, LoggerStore } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        log.error('表单错误', err);
        return;
      }
      let params = {
        loginName: values.loginName,
        userPwd: Base64.encode(values.userPwd),
        loginType: values.phoneNum ? 2 : 1
      };
      if (values.phoneNum) {
        params.phoneNum = values.phoneNum;
        params.identifyCode = values.identifyCode;
      }
      const dataTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const name = params.loginName || params.phoneNum;
      UserStore.loginAction(params)
        .then(res => {
          setCacheItem('token', res.result.token, 'cookie');
          LoggerStore.save({
            ...User.USER_LOGIN.logInfo[0],
            description: `【${name}】登录系统`
          });
          if (!res.result.isModifyPassWord) {
            this.setState({
              changePwdVisible: true
            });
            return;
          }
          if (res.result.isPwdModified === 0) {
            this.setState({
              userId: res.result.userId,
              shouldMotifyPwd: true,
              machineId: res.result.machineId
            });
          } else {
            UserStore.setLoginState(true);
            setTimeout(() => {
              history.replace('/');
            }, 10);
          }
          // TODO
          // logsModel.save(options)
        })
        .catch(res => {
          if (res.code === 50100) {
            this.setState({
              userPswLogin: false,
              phoneNum: res.result.phoneNum
            });
            message.warning('管理已开启手机验证功能,请进行手机验证!');
          }
          return Promise.reject(res)
        });
    });
  };

  closeChangePwdMark = () => {
    this.setState({
      changePwdVisible: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <div className="user-login-view">
        <video
          width="100%"
          height="auto"
          src={CityLightsHD}
          poster={CityLightsHDPoster}
          autoPlay="autoplay"
          loop
        />
        <div className="login-logo">
          <img src={logo} />
          智慧云眼
        </div>
        {/* <div className='footer-logo'><img src={footerLogin} /></div> */}
        <div className="footer-logo">
          <div>
            {' '}
            <img src={footerLogin} />
          </div>
          <div className="footer-logo-text">
            为获得最佳使用体验&nbsp;&nbsp;建议使用谷歌浏览器最新版&nbsp;&nbsp;并在分辨率为1920×1080的显示器上显示
            <div className="footer-logo-text-download">
              <img src={google} className="footer-logo-google-icon" />
              <a
                className="footer-logo-google-link"
                target="_blank"
                href="https://www.google.cn/chrome/"
                rel="noopener noreferrer"
              >
                {' '}
                <img src={downloadPic} />
              </a>
              {/* <img src={google} /> */}
            </div>
          </div>
        </div>
        <div className="login-content" key={this.state.userPswLogin}>
          <div className="login-cg-bg" />
          <div className="animate-tranform-content">
            <div className="login-title">Login</div>
            <div className="login-title-right">
              <div className="login-title-nav">
                {this.state.userPswLogin ? '验证码登录' : '密码登录'}
              </div>
              <div
                className="login-book"
                onClick={() =>
                  this.setState({
                    userPswLogin: !this.state.userPswLogin,
                    phoneNum: null
                  })
                }
              >
                <Icon
                  type={this.state.userPswLogin ? 'PhoneIcon' : 'UserName'}
                />
              </div>
            </div>
            <div className="login-form">
              {this.state.userPswLogin ? (
                <Form size="large" onSubmit={this.submitEvent}>
                  <FormItem {...formItemLayout} hasFeedback>
                    <div className="login-item-label">账号</div>
                    {getFieldDecorator('loginName', {
                      rules: [
                        {
                          required: true,
                          message: `请输入用户名或手机号`
                        }
                      ]
                    })(
                      <div>
                        <Icon type="UserName" />
                        <Input
                          autoComplete="off"
                          name="user"
                          placeholder={'请输入用户名或手机号'}
                        />
                      </div>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} hasFeedback>
                    <div className="login-item-label">密码</div>
                    {getFieldDecorator('userPwd', {
                      rules: [
                        {
                          required: true,
                          message: `密码是必填项`
                        }
                      ]
                    })(
                      <div>
                        <Icon type="PassWord" />
                        <Input
                          autoComplete="new-password"
                          name="password"
                          type="password"
                          placeholder={'请输入密码'}
                        />
                      </div>
                    )}
                  </FormItem>
                  <Form.Item className="login-btn-con">
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      className="login-btn mt10"
                    >
                      {'登录'}
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Form size="large" onSubmit={this.submitEvent}>
                  <FormItem {...formItemLayout} hasFeedback>
                    <div className="login-item-label">手机号</div>
                    {getFieldDecorator('phoneNum', {
                      initialValue: this.state.phoneNum && this.state.phoneNum,
                      rules: [
                        {
                          required: true,
                          message: `请输入手机号`
                        },
                        {
                          validator(rule, value, callback, source, options) {
                            var errors = [];
                            if (
                              !/^((1[3,5,7,8,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(
                                value
                              ) &&
                              value
                            ) {
                              errors[0] = '请输入正确的手机号码';
                            }
                            callback(errors);
                          }
                        }
                      ]
                    })(
                      <div>
                        <Icon type="PhoneIcon" />
                        <Input
                          autoComplete="off"
                          name="phoneNum"
                          defaultValue={this.state.phoneNum}
                          disabled={this.state.phoneNum ? true : false}
                          placeholder={'请输入手机号'}
                        />
                      </div>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} hasFeedback>
                    <div className="login-item-label">验证码</div>
                    {getFieldDecorator('identifyCode', {
                      rules: [
                        {
                          required: true,
                          message: `请输入验证码`
                        }
                      ]
                    })(
                      <div>
                        <Icon type="PhoneNum" />
                        <Input
                          autoComplete="new-password"
                          name="identifyCode"
                          type="text"
                          placeholder={'请输入验证码'}
                        />
                        <CodeView
                          UserStore={this.props.UserStore}
                          getPhoneNum={this.getPhoneNum}
                        />
                      </div>
                    )}
                  </FormItem>
                  <Form.Item className="login-btn-con">
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      className="login-btn mt10"
                    >
                      {'登录'}
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </div>
          </div>
        </div>
        <ChangePwdMarkView
          changePwdVisible={this.state.changePwdVisible}
          maskClosable={false}
          closable={false}
          closeChangePwdMark={this.closeChangePwdMark}
        />
      </div>
    );
  }
}

export default Form.create({})(LoginView);
