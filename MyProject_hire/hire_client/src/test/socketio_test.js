// // 引入客户端 io
// import io from 'socket.io-client'
// // 连接服务器 , 得到代表连接的 socket 对象
// const socket = io('ws://localhost:4000')
// // 绑定 'receiveMessage' 的监听 , 来接收服务器发送的消息
// socket.on('receiveMsg', function (data) {
// console.log(' 浏览器端接收到消息:', data)
// })
// // 向服务器发送消息
// socket.emit('sendMsg', {name: 'Tom', date: Date.now()})
// console.log(' 浏览器端 向服务器发送 消息:', {name: 'Tom', date: Date.now()})
import io from 'socket.io-client'
//连接服务器,得到与服务器的连接对象
const socket=io('ws://localhost:4000')
//发送消息
socket.emit('sendMsg',{name:'abc'})
console.log('客户端向服务器发消息',{name:'abc'})
//绑定监听，接收服务器发送的消息
socket.on('receiveMsg',function(data){
  console.log('客户端接受服务器发送的消息',data)
})