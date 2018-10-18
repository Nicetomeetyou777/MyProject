/**
 * 包含n个action
 * 异步action
 * 同步action
 */
import io from 'socket.io-client'
import { AUTH_SUCCESS, ERR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST,RECEIVE_MSG_LIST ,RECEIVE_MSG,MSG_READ} from './action-type'
import { reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList ,reqChatMsgList,reqReadMsg} from '../api/index'

/**
 * 单例对象
 * 1.创建对象之前：判断对象是否已经存在，只有不存在才去创建
 * 2.创建对象之后：保存对象io.socket
 */
function initIO(dispatch,userid) {
    //1.创建对象之前：判断对象是否已经存在，只有不存在才去创建
    if (!io.socket) {
        //连接服务器,得到与服务器的连接对象 存
        io.socket = io('ws://localhost:4000')//2.创建对象之后：保存对象io.socket

        //绑定监听，接收服务器发送的消息 读
        io.socket.on('receiveMsg', function (chatMsg) {
            console.log('客户端接受服务器发送的消息', chatMsg)
        //只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
        if(userid===chatMsg.from||userid===chatMsg.to){
            dispatch(receiveMsg(chatMsg,userid))
        }
        })
    }

}

//异步获取消息列表数据  工具函数
async function getMsgList(dispatch,userid){
    initIO(dispatch,userid)//使用单例对象，限制连接多次
    const response=await reqChatMsgList()
    const result=response.data
    if(result.code===0){
        const {users,chatMsgs}=result.data
        //分发同步action
        dispatch(receiveMsgList({users,chatMsgs,userid}))
    }
}



//发送消息的异步action
export const sendMsg = ({ from, to, content }) => {
    return dispatch => {
        console.log('客户端向服务器发送消息', { from, to, content })
        
        //发消息到服务器端
        io.socket.emit('sendMsg',{ from, to, content })
    }
}
//读取消息的异步action
export const readMsg = (from,to) => {
    return async dispatch => {
      const response=await reqReadMsg(from) 
      const result=response.data
      if(result.code===0){
          const count=result.data
         dispatch(msgRead({count,from,to}))
      }
    
    }
}


//授权成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
//错误提示信息的同步action
const errMsg = (msg) => ({ type: ERR_MSG, data: msg })
//同步接收用户
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
//同步重置用户
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
//同步接收用户列表
const receiveUserList = (userList) => ({ type: RECEIVE_USER_LIST, data: userList })
//接收消息列表的同步action
const receiveMsgList=({users,chatMsgs,userid})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
//接受一个消息的同步action
const receiveMsg=(chatMsg,userid)=>({type:RECEIVE_MSG,data:{chatMsg,userid}})
//消息已查看
const msgRead=({count,from,to})=>({type:MSG_READ,data:{count,from,to}})


//注册
export const register = (user) => {
    const { username, password, password2, type } = user
    //做表单数据检察，如果不通过返回一个同步action
    if (!(password && password2)) {
        return errMsg('请输入密码')
    } else if (!username) {
        return errMsg('请输入用户名')
    } else if (password !== password2) {
        return errMsg('密码不一致')
    }
    //表单数据合法，返回一个发送ajax的异步action
    return async dispatch => {
        //发送注册异步ajax请求
        const response = await reqRegister({ username, password, type })
        const result = response.data//{ code: 0,data:user,msg:'';}
        if (result.code === 0) {//chengg
            getMsgList(dispatch,result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errMsg(result.msg))
        }
    }
}
//登录
export const login = (user) => {
    const { username, password } = user
    if (!username) {
        return errMsg('请输入用户名')
    } else if (!password) {
        return errMsg('密码不能为空')
    }
    return async dispatch => {
        //发送注册异步ajax请求
        const response = await reqLogin(user)
        const result = response.data//{ code: 0,data:user,msg:'';}
        if (result.code === 0) {//chengg
            getMsgList(dispatch,result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errMsg(result.msg))
        }
    }
}
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user)
        const result = response.data
        if (result.code === 0) {//更新成功
            dispatch(receiveUser(result.data))
        } else {//更新失败
            dispatch(resetUser(result.msg))
        }
    }
}
//获取用户异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch,result.data._id)
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}
//异步获取用户列表
export const getUserList = (type) => {
    return async dispatch => {
        //执行异步ajax请求
        const response = await reqUserList(type)
        const result = response.data
        //得到结果后分发一个同步action
        if (result.code === 0) {
            dispatch(receiveUserList(result.data))
        }
    }
}
