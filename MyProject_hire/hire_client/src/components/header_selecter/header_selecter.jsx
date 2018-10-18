/**
 * 选择用户头像的UI组件
 */

import React,{Component} from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'


export default class HeaderSelecter extends Component{
static propTypes={
        setHeader:PropTypes.func.isRequired
}
state={
    icon:''
}
selecterHeader=({icon,text})=>{//el:数组元素object
    this.setState({icon})//更新当前组件状态
    this.props.setHeader(text)//更新父组件状态
}
        constructor(props){
                super(props)
                //准备需要显示的数据
                this.headerList=[]
                for (let i = 0; i < 20; i++) {
                   this.headerList.push({
                           text:'头像'+(i+1),
                           icon:require(`../../assets/images/头像${i+1}.png`)//不能使用import
                   })
                        
                }
        }
        render(){
             const {icon}=this.state   
            const gridHeader=icon ? <p>已选择头像：<img src={icon} alt=""/></p>:'请选择头像'
            return (
             
              <List renderHeader={() => gridHeader}>
              <Grid data={this.headerList} columnNum={5} onClick={this.selecterHeader}></Grid>
              </List>
              )
            
        }
} 