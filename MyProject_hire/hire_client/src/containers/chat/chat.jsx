/*
对话聊天的路由组件
*/
import React, { Component } from 'react'
import { NavBar, List, InputItem,Grid, Icon} from 'antd-mobile'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'

import { sendMsg ,readMsg} from '../../redux/actions'

const Item = List.Item
class Chat extends Component {
    state = {
        content: '',
        isShow:false//是否显示表情列表
    }
    //在第一次执行之前回调
    componentWillMount(){
        const emojis=['😁','😂','😃','😄','😅','😆',' 😉','😊 ','😋','😎','😍','😘',
        '😚','☺','😐','😶','😏','😣','😥','😪','😫','😌','😜','😝','😒','😓','😔',
        '😲','☹','😖','😞','😤','😳','😵','🤪','😡','😠','😷','😇','🤒','🤕']         
        this.emojis=emojis.map(emoji=>({text:emoji}))
    }
    componentDidMount(){
        //初始显示列表
        window.scrollTo(0,document.body.scrollHeight)
        
    }
    componentDidUpdate(){
        //更新显示列表
        window.scrollTo(0,document.body.scrollHeight)
    }
    componentWillUnmount(){//退出，死亡之前回调
        //发请求更新消息的未读状态
        const from = this.props.match.params.userid
        const to=this.props.user._id
        this.props.readMsg(from,to)//也可以先判断有没有未读消息，有待完善
    }
    toggleShow=()=>{
        const isShow=!this.state.isShow
        this.setState({isShow})
        if(isShow){
            //异步手动派发resize事件，解决表情列表显示bug
            setTimeout(()=>{
                window.dispatchEvent(new Event('resize'))
            },0)

        }
       
    }
    //收集数据
    handleSend = () => {
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()//去除字符串两边的空白
        //发送请求（发消息）
        if (content) {
            //异步action
            this.props.sendMsg({ from, to, content })
        }
        //清除输入数据
        this.setState({ 
            content: '' ,
            isShow:false
        })
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        //计算当前聊天的chatid
        const meId = user._id
        if(!users[meId]){//如果还没有获取数据，直接不作任何显示  users最初是空
           return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join('_')
        //对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        //得到目标函数的header图片对象
        const targetHeader = users[targetId].header
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar
                  icon={<Icon type='left'/>}
                  className='sticky-header'
                  onLeftClick={()=>this.props.history.goBack()}
                >
                  {users[targetId].username}
                </NavBar>
                <List style={{marginTop:45,marginBottom:45}}>
                  <QueueAnim type='left' delay={10}>
                     {
                        msgs.map(msg => {
                            if (targetId === msg.from) {//对方发给我的 meId===msg.to
                                return (
                                    <Item
                                        key={msg._id}
                                        thumb={targetIcon}
                                    >
                                        {msg.content}
                                    </Item> 

                                )
                            } else {
                                return (
                                    <Item
                                        key={msg._id}
                                        className='chat-me'
                                        extra=' 我'
                                    >
                                        {msg.content}
                                    </Item>

                                )

                            }
                        })

                    } 
                  </QueueAnim>
                    


                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        placeholder=" 请输入"
                        value={this.state.content} 
                        onChange={val => this.setState({ content: val })}//收集数据
                        onFocus={()=>this.setState({isShow:false})}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight:5}}>😊</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>
                            
                        }
                    />
                    {
                        this.state.isShow?(
                            <Grid
                      data={this.emojis}
                      columnNum={8}
                      carouselMaxRow={4}
                      isCarousel={true}
                      onClick={(item)=>{
                          this.setState({content:this.state.content+item.text})
                      }}
                      />
                        ):null
                    }
                    

                </div>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
    { sendMsg ,readMsg}
)(Chat)