import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {List,NavBar,InputItem,TextareaItem,Button} from 'antd-mobile' 
import HeaderSelecter from '../../components/header_selecter/header_selecter'
import {updateUser} from '../../redux/actions'

class YingpinInfo extends Component{
    state={
        header:'',
        post:'',
        info:'',
        url:''
    }
    setHeader=(header)=>{
        this.setState({header})
    }
    handleChange=(name,val)=>{
       this.setState({
            [name]:val
       })
    }
    save=()=>{
        this.props.updateUser(this.state)
    }
    render(){
        //如果信息已经完善，自动重定向到对应的主界面
        const {header,type}=this.props.user
        if(header&&type){
            const path=type==='yingpin'?'/yingpin':'/zhaopin'
            return <Redirect to={path}/>
        }
        return (
         <div>
            <NavBar >应聘者信息完善界面</NavBar>
            <HeaderSelecter setHeader={this.setHeader}/>
            <List>
                <InputItem placeholder='请输入心仪的职位' onChange={val=>this.handleChange('post',val)}>求职岗位</InputItem>
                <TextareaItem title='个人介绍' rows={3} placeholder='请输入个人介绍' onChange={val=>this.handleChange('info',val)}/>
                <InputItem placeholder='请输入作品链接' onChange={val=>this.handleChange('url',val)}>作品链接</InputItem>                
                
            </List>
            
            <Button type='primary' onClick={this.save}>保存</Button>
        </div>)
       
        
    }
}
export default connect(
    state=>({user:state.user}),
    {updateUser}
)(YingpinInfo)