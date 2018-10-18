import React,{Component} from 'react'
import {TabBar} from 'antd-mobile'
import PropTypes from  'prop-types'
import {withRouter} from 'react-router-dom'




const Item=TabBar.Item
class NavFooter extends Component{
static propTypes={
    navList:PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
}
    render(){
        let {navList,unReadCount}=this.props
        //过滤掉hide为true的nav
        navList=navList.filter(nav=>!nav.hide)//函数返回值为ture，被留下
        const path=this.props.location.pathname
        return(
            
                <TabBar>
                    {
                       navList.map((nav)=>(
                           <Item key={nav.path}
                           badge={nav.path==='/message'?unReadCount:0}
                           title={nav.text}
                           icon={{uri:require(`./images/${nav.icon}.png`)}}
                           selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                           selected={path===nav.path}
                           onPress={()=>{this.props.history.replace(nav.path)}}/>
                           
                       ))
                    }
                </TabBar>
            
        )
    }
}
export default withRouter(NavFooter)
//让非路由组件可以访问到路由组件的 API