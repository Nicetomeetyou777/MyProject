const {ChatModel}=require('../db/model')
module.exports = function (server) {
    
    const io = require('socket.io')(server)//得到函数，执行返回io

    //监视客户端与服务器的连接
    io.on('connection', function (socket) {
        console.log('有一个客户端连接上了服务器')

        //绑定监听，接收客户端发送的消息
        socket.on('sendMsg', function ({ from, to, content }) {
            console.log('服务器接收到客户端发送的消息', { from, to, content })
            //处理数据（保存消息）
            //准备 ChatMsg对象的相关数据
            const chat_id=[from,to].sort().join('_')//from_to或者to_from 字符串排序的结果一样
            const create_time=Date.now()
            new ChatModel({ from, to, content ,chat_id,create_time}).save(function(err,chatMsg){
                //向所有连接的客户端发消息(不好！！！)  应给目标客户端发
                io.emit('receiveMsg',chatMsg)   //socket.emit 给自己发
            })
            
           
        })
    })
}
