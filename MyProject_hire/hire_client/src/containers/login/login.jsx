/**
 * 登陆路由
 */


import React,{Component} from 'react'
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button} from 'antd-mobile'
import Logo from '../../components/logo/logo.jsx' 
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
import {Redirect} from 'react-router-dom'


class Login extends Component{
    state={
        username:'',
        password:''
    }
    login=()=>{
      this.props.login(this.state)
    }
    toRegister=()=>{
        this.props.history.replace('/register')
    }
    handleChange=(name,val)=>{
        this.setState({
           [name]:val
        })
    }
    render(){
        const {msg,redirectTo}=this.props.user
        if(redirectTo){
            return <Redirect to={redirectTo}></Redirect>
        }
        return(
            <div>
                <NavBar>直&nbsp;&nbsp;聘</NavBar>
                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>
                <Logo></Logo>
                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>
                <WingBlank>
               
                 <List>
                      {msg ?<div className='err-msg'>{msg}!!</div> : null}
                    <WhiteSpace/>
                    <InputItem placeholder='请输入用户名' onChange={val=>{this.handleChange('username',val)}}>用户名：</InputItem> 
                    <WhiteSpace/>
                    <InputItem placeholder='请输入密码' type='password' onChange={val=>{this.handleChange('password',val)}}>密&nbsp;&nbsp;码：</InputItem>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <Button type='primary' onClick={this.login}>登录</Button>
                    <Button onClick={this.toRegister}>未有账户</Button>
                 </List>
                </WingBlank>

            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {login}
)(Login)