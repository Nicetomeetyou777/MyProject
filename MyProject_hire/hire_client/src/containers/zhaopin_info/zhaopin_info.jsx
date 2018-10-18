import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {List,NavBar,InputItem,TextareaItem,Button} from 'antd-mobile' 
import HeaderSelecter from '../../components/header_selecter/header_selecter'
import {updateUser} from '../../redux/actions'

class ZhaopinInfo extends Component{
    state={
        header:'',//头像
        info:'',//职位简介
        post:'',//职位名称
        salary:'',//薪资
        company:''//公司名称

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
        const {header,type}=this.props.user
        if(header&&type){//说明信息已完善
              const path=type==='zhaopin'?'/zhaopin':'/yingpin'
              return <Redirect to={path}/>
        }
        return (
         <div>
            <NavBar >招聘者信息完善界面</NavBar>
            <HeaderSelecter setHeader={this.setHeader}/>
            <List>
                <InputItem placeholder='请输入空缺的职位' onChange={val=>this.handleChange('post',val)}>招聘职位</InputItem>
                <InputItem placeholder='请输入公司名称' onChange={val=>this.handleChange('company',val)}>公司名称</InputItem>
                <InputItem placeholder='请输入职位薪资' onChange={val=>this.handleChange('salary',val)}>职位薪资</InputItem>                
                <TextareaItem title='职位要求' rows={3} placeholder='请输入职位要求' onChange={val=>this.handleChange('info',val)}/>
            </List>
            
            <Button type='primary' onClick={this.save}>保存</Button>
        </div>)
       
        
    }
}
export default connect(
    state=>({user:state.user}),
    {updateUser}
)(ZhaopinInfo)