/**
 * 应聘者主界面路由容器组件
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {getUserList} from '../../redux/actions'
import UserList from '../../components/user-list/user-list'

class Zhaopin extends Component{
    //初始化显示
    componentDidMount(){
        //获取userlist
        this.props.getUserList('yingpin')
    }
    render(){
        return(
        <UserList userList={this.props.userList}/>
        )
        
    }
}
export default connect(
    state=>({userList:state.userList}),//读
    {getUserList}
)(Zhaopin)