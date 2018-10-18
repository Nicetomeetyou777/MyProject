/**
 * 注册路由
 */


import React,{Component} from 'react'
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button,Radio} from 'antd-mobile'
import Logo from '../../components/logo/logo.jsx' 
import {connect} from 'react-redux'
import {register} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

const ListItem=List.Item
class Register extends Component{
    state={
        username:'',
        password:'',
        password2:'',
        type:'',
       
    }
    //点击注册调用
    register=()=>{
       this.props.register(this.state)
    }
    //处理输入数据的改变，更新对应的状态
    handleChange=(name,val)=>{
        this.setState({
            [name]:val//属性名不是name而是name变量的值  字符串转变量
        })
    }
    toLogin=()=>{ 
        this.props.history.replace('/login')
    }
   
    render(){
        const {type}=this.state
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
                    <InputItem placeholder='请再次输入密码' type='password' onChange={val=>{this.handleChange('password2',val)}}>确认密码：</InputItem> 
                    <ListItem>
                        <span>用户类型：&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='yingpin'} onChange={()=>{this.handleChange('type','yingpin')}}>应聘</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='zhaopin'} onChange={()=>{this.handleChange('type','zhaopin')}}>招聘</Radio>
                        </span>
                    </ListItem>
                    <WhiteSpace/>
                    <Button type='primary' onClick={this.register}>注册</Button>
                    <Button onClick={this.toLogin}>已有账户</Button>
                 </List>
                </WingBlank>

            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),//读状态
    {register}
)(Register)