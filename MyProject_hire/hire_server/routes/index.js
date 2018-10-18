var express = require('express');
var router = express.Router();
const { UserModel, ChatModel } = require('../db/model')
const md5 = require('blueimp-md5')
const filter = { password: 0, _v: 0 }//查询时过滤出制定的属性

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
//注册一个路由：用户注册
/**
 * 提供一个用户注册的接口
a) path 为: /register
b) 请求方式为: POST
c) 接收 username 和 password 参数
d) admin 是已注册用户
e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f) 注册失败返回: {code: 1, msg: '此用户已存在'}
 */
// router.post('/register',function(req,res){
//   //    1,获取请求参数
//   const {username,password}=req.body
//    // 2，处理请求
//    if(username==='admin'){//注册失败
//         res.send({code:1,msg:'此用户已存在'})
//    }else{//注册成功
//         res.send({code:0,data:{_id: 'abc', username, password}})
//    }
//   // 3，返回响应

// })

/**
 * 注册的路由
 */
router.post('/register', (req, res) => {
  //读取参数数据
  const { username, password, type } = req.body
  //处理
  //判断用户是否存在，如果存在，返回错误信息，如果不存在，保存
  //查询（根据username）
  UserModel.findOne({ username }, (error, userDoc) => {
    //如果userDoc有值
    if (userDoc) {
      res.send({ code: 1, msg: '此用户已存在' })//返回错误信息
    } else {//没值
      new UserModel({ username, type, password: md5(password) }).save((error, user) => {
        //生成cookie，并交给浏览器保存
        res.cookie('userid', user._id, { masAge: 1000 * 60 * 60 * 24 * 30 })
        //返回包含userDoc的json数据
        const data = { username, type, _id: user._id }
        res.send({ code: 0, data })
      })
    }
  })
  //返回相应数据
})

/**
 * 登录的路由
 */

router.post('/login', (req, res) => {
  //获取参数
  const { username, password } = req.body
  //处理,根据username,password查询数据库users
  UserModel.findOne({ username, password: md5(password) }, filter, (err, user) => {
    if (user) {//登陆成功
      res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 30 })
      res.send({ code: 0, data: user })
    } else {
      res.send({ code: 1, msg: '用户名或密码不正确' })
    }//登录失败
  })

})

/**
 * 更新用户路由
 */
router.post('/update', (req, res) => {
  const { userid } = req.cookies
  //如果不存在
  if (!userid) {
    res.send({ code: 1, msg: '请重新登录' })
  }
  //如果不存在
  //根据userid更新对应的user文档数据
  //得到提交的用户数据
  const user = req.body//没有_id
  UserModel.findByIdAndUpdate({ _id: userid }, user, (err, oldUser) => {
    if (!oldUser) {
      //通知浏览器删除cookie
      res.clearCookie('userid')
      //返回错误通知信息
      res.send({ code: 1, msg: '请先登录' })
    } else {
      //返回数据
      const { _id, username, type } = oldUser
      const data = Object.assign(user, { _id, username, type })
      res.send({ code: 0, data })
    }
  })
})
//获取用户信息的路由（根据cookie中的userid）
router.get('/user', (req, res) => {
  //从请求的cookie中得到userid
  const { userid } = req.cookies
  //如果不存在，直接返回一个提示信息
  if (!userid) {
    return res.send({ code: 1, msg: '请先登录' })
  }
  //根据userid查询对应的user
  UserModel.findOne({ _id: userid }, filter, (err, user) => {
    if (!user) {
      //通知浏览器删除cookie
      res.clearCookie('userid')
      //返回错误通知信息
      res.send({ code: 1, msg: '请先登录' })
    } else {
      res.send({ code: 0, data: user })
    }
  })
})
//获取用户列表的路由(根据类型)
router.get('/userlist', (req, res) => {  //req.params   '/userlist:type'
  const { type } = req.query
  if (!type) {
    return res.send({ code: 1, msg: '请先选择用户类型' })

  } else {
    UserModel.find({ type }, filter, (err, user) => {
      res.json({ code: 0, data: user })
    })
  }

  //获取当前用户所有相关聊天信息列表
  router.get('/msglist', (req, res) => {
    //获得cookie中的userid
    const { userid } = req.cookies
    //查询得到所有user文档数组
    UserModel.find(function (err, userDocs) {
      //用对象存储所有user信息：key为user的_id，val为name和header组成的user对象
      //const users = {}对象容器
      // userDocs.forEach(user => {
      //   users[user._id] = { username: user.username, header: user.header }
      // })
      const users =userDocs.reduce((users,user)=>{
        users[user._id] = { username: user.username, header: user.header }
        return users
      },{})//累加
      /**查询userid相关的所有聊天信息
       * 参数1：查询条件
       * 参数2：过滤条件
       * 参数3：回调函数
       */
      //or 或
      ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, filter, function (err, chatMsgs) {
        //返回包含所有用户和当前用户相关的所有聊天信息的数据
        res.send({ code: 0, data: { users, chatMsgs } })
      })
    })
  })
})

/**
 * 修改指定已读消息
 */
router.post('/readmsg',function(req,res){
  //得到请求中的from和to
  const from=req.body.from
  const to=req.cookies.userid
  /**
   * 更新数据库中的chat数据
   * 参数1：查询条件
   * 参数2：更新为指定的数据对象
   * 参数3：是否1次更新多条，默认只更新一条
   * 参数4：更新完成的回调函数
   */
  ChatModel.update({from,to,read:false},{read:true},{multi:true},function(err,doc){
    console.log('/readmsg',doc)
    res.send({code:0,data:doc.nModefied})//更新修改的数量
  })
})

module.exports = router;
