/**
 * 主界面路由
 */


import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'//set/get/remove
import {NavBar} from 'antd-mobile'

import ZhaopinInfo from '../zhaopin_info/zhaopin_info'
import YingpinInfo from '../yingpin_info/yingpin_info'
import Personal from '../personal/personal'
import Message from '../message/message'
import Yingpin from '../yingpin/yingpin'
import Zhaopin from '../zhaopin/zhaopin'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import {getRedirectTo} from '../../utils/index'
import {getUser} from '../../redux/actions'
import '../../assets/css/index.less'




class Main extends Component{
    //组件类和组件对象
    //给组件对象添加属性
    navList=[
        {
            path:'/zhaopin',
            component:Zhaopin,
            title:'求职列表',
            icon:'zhaopin',
            text:'去招聘'
        },
        {
            path:'/yingpin',
            component:Yingpin,
            title:'职位列表',
            icon:'yingpin',
            text:'去应聘'
        },
        
        {
            path:'/message',
            component:Message,
            title:'消息列表',
            icon:'message',
            text:'消息'
        },
        {
            path:'/personal',
            component:Personal,
            title:'用户中心',
            icon:'personal',
            text:'个人'
        },
    ]
    componentDidMount(){
        //登陆过（cookie中有userid），但还没有登录（redux管理的user中没有_id）,发请求获取对应的user
        const userid=Cookies.get('userid')
        const {_id}=this.props.user
        if(userid && !_id){
            //发送异步请求，获取user信息
            // console.log('发送ajax请求获取user')
             this.props.getUser()
        }
    }
    render(){
        //读取cookie中的userid
         const userid=Cookies.get('userid')
        //如果没有，自动重定向到登陆界面
        if(!userid){
            return <Redirect to='/login'/>
        }
        //如果有，读取redux中的user状态
        const {user,unReadCount}=this.props
        //如果user没有_id,返回null（不做任何显示）
      
        if(!user._id){
            return null
        }else{
         //如果有_id，显示对应的界面
         //如果请求的是跟路径，根据user的type和header来计算出一个重定向的路由路径，并自动重定向
         let path =this.props.location.pathname
         if(path==='/'){
             //得到重定向的路径
            path= getRedirectTo(user.type,user.header)
             return <Redirect to={path}/>
         }
        }       
        
        const {navList}=this
        const path=this.props.location.pathname//获取当前路径
        const currentNav=navList.find(nav=>nav.path===path)//当前导航,数组中得到当前的nav，可能没有
        if(currentNav){
            if(user.type==='yingpin'){
                //隐藏数组的第一个
                navList[0].hide=true
            }else{
                //隐藏数组的第二个
                navList[1].hide=true
            }
        }
        return(
            <div>
                {currentNav?<NavBar className='sticky-header'>{currentNav.title}</NavBar>:null}
                <Switch>
                    {
                        navList.map(nav=><Route path={nav.path} component={nav.component}/>)
                    }
                    <Route path='/zhaopininfo' component={ZhaopinInfo}/>
                    <Route path='/yingpininfo' component={YingpinInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav?<NavFooter navList={navList} unReadCount={unReadCount}/>:null}
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user,unReadCount:state.chat.unReadCount}),
    {getUser}
)(Main)
/**
 * 实现自动登录
 * 1.componentDidMount()
 * 如果cookie中有对应的userid，登陆过（cookie中有userid），但还没有登录（redux管理的user中没有_id）,发请求获取对应的user（跳转期间显示？暂时不做）
 * 2.render()
 * 1).如果cookie中没有userid，自动进如login界面
 * 2).判断redux管理的user中是否有_id,如果没有，暂时不做任何显示
 * 3).如果有，说明当前已经登录，显示对应的界面
 * 4).如果请求跟路径： * 根据user的type和header来计算出一个重定向的路由路径，并自动重定向
 * 
 */