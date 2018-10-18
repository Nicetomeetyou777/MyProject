/**
 * 个人主界面路由容器组件
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {Result,WhiteSpace,List,Button,Modal} from 'antd-mobile'

import {resetUser} from '../../redux/actions'
const Item=List.Item
const Brief=Item.Brief
class Personal extends Component{
    logout=()=>{
        Modal.alert('退出','确认退出登录嘛？',[
            {
                text:'取消',
                onPress:()=>console.log('cancel')//按下执行
            },{
                text:'确认',
                onPress:()=>{
                    //清除cookie中的userid
                    Cookies.remove('userid')
                    //重置redux中的user状态
                    this.props.resetUser()
                }
            }
        ])
    }
    
    render(){
        const {username,header,company,post,salary,info}=this.props.user
        return(
        <div style={{marginBottom:50 ,marginTop:45}}>
            <Result
            img={<img src={require(`../../assets/images/${header}.png`)} style={{width:50}} alt='header'/>}
            title={username}
            message={company}//如果没有值，自动不显示
            />
            <List renderHeader={() => '相关信息'}>
            <Item multipleLine>
            <Brief>职位：{post}</Brief>
            <Brief>简介：{info}</Brief>
            {salary?<Brief>薪资：{salary}</Brief>:null}
            
            </Item>
            </List>
            <WhiteSpace/>
            <List>
                <Button type='warning' onClick={this.logout}>退出登录</Button>
            </List>
        </div>
        )
        
    }
}
export default connect(
    state=>({user:state.user}),
    {resetUser}
)(Personal)