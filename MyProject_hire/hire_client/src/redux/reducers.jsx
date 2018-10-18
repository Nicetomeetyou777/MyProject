/**
 * 包含n个reducer函数，根据老的state生成新的state
 */
import {combineReducers,} from 'redux'
import {AUTH_SUCCESS,ERR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG_LIST,RECEIVE_MSG, MSG_READ} from './action-type'
import {getRedirectTo} from '../utils/index'

const initUser={
    username:'',
    type:'',
    msg:'',
    redirectTo:''//自动跳转的路由path
}
// function xxx(state=0,action){
//     return state
// }
// function yyy(state=0,action){
//     return state
// }
//产生user状态的reducer
function user(state=initUser,action){
    
    switch(action.type){
       
        case AUTH_SUCCESS://成功
        const {type,header}=action.data
        return {...action.data,redirectTo:getRedirectTo(type,header)}
        case ERR_MSG://失败
        return {...state,msg:action.data}
        case RECEIVE_USER://失败
        return action.data
        case RESET_USER://失败
        return {...initUser,msg:action.data}
        default:
        return state
    }
}
const initUserList=[]
function userList(state=initUserList,action){
    switch(action.type){
        case RECEIVE_USER_LIST://data为userList
        return action.data
        default:
        return state

    }
}
const initChat={
     users:{},//所有用户信息的对象 属性名userid 属性值{username,header}
     chatMsgs:[],//所有用户相关msg的数组
     unReadCount:0//总的未读数量
}
function chat(state=initChat,action){
    switch(action.type){
        case RECEIVE_MSG_LIST://data:{users,chatMsgs5}
        const {users,chatMsgs,userid}=action.data
        return {
            users,
            chatMsgs,
            unReadCount:chatMsgs.reduce((preTotal,msg)=>preTotal+(!msg.read&&msg.to===userid?1:0),0)//总的未读数量
       }
        case RECEIVE_MSG://data:chatMsg
        const {chatMsg}=action.data
        return {
            users:state.users,
            chatMsgs:[...state.chatMsgs,chatMsg],
            unReadCount:state.unReadCount+(!chatMsg.read&&chatMsg.to===action.data.userid?1:0)//总的未读数量
       }
       case MSG_READ:
       const {count,from,to}=action.data
       return {
        users:state.users,
        chatMsgs:state.chatMsgs.map(msg=>{//read由false改为true 不能直接改
           if(msg.from===from&&msg.to===to&&!msg.read){//需要更新
             return {...msg,read:true}
           }else{//不需要更新
             return msg
           }
        }),
        unReadCount:state.unReadCount-count//已读
   }
        default:
        return state
    }
}
export default combineReducers({
    user,
    userList,
    chat
})//向外暴露的结构：{user:{},userList:[],chat:{}}