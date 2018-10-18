/**
 * 测试使用mongoose操作mongodb数据库
 */
const md5=require('blueimp-md5')//密码加密函数
// 1. 连接数据库

// 1.1. 引入 mongoose
const mongoose=require('mongoose')
// 1.2. 连接指定数据库 (URL 只有数据库是变化的 )
mongoose.connect('mongodb://localhost:27017/hire_test',{ useNewUrlParser: true })
// 1.3. 获取连接对象
const conn=mongoose.connection
// 1.4. 绑定连接完成的监听 ( 用来提示连接成功 
conn.on('connected',function(){
    console.log('数据库连接成功')
})
// 2. 得到对应特定集合的 Model
// 2.1. 字义 Schema( 描述文档结构 )
const userSchma=mongoose.Schema({//属性名，属性值的类型，是否是必须的，默认值
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true},
    header:{type:String}
})
// 2.2. 定义 Model( 与集合对应 , 可以操作集合 )
const UserModel=mongoose.model('user',userSchma)//集合名称users
// 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
// 3.1. 通过 Model 实例的 save() 添加数据
function testSave(){
    //创建UserModel实例
    const userModel = new UserModel({username:'剑圣',password:md5('456'),type:'yingpin'})
    //调用
    userModel.save(function(error,user){
        console.log('save()',error,user)
    })
}
// testSave()
// 3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
//查询多个：得到的是包含所有匹配文档对象的数组，如果没有匹配则结果为【】
function testFind(){
    UserModel.find(function(error,users){
        console.log('find()',error,users)
    })
//查询一个：得到的是匹配的文档对象，如果没有匹配的就是null    
    UserModel.findOne({_id:'5ba4ed129f4c55714089f7a7'},function(error,user){
        console.log('findOne()',error,user)
    })
}
// testFind()
// 3.3. 通过 Model 的 findByIdAndUpdate() 更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id:'5ba4ed129f4c55714089f7a7'},{username:'盖伦'},function(error,oldUser){
           console.log('findByIdAndUpdate()',error,oldUser)
    })
}
// testUpdate()
// 3.4. 通过 Model 的 remove() 删除匹配的数据
function testRemove(){
    UserModel.remove({_id:'5ba4ed129f4c55714089f7a7'},function(error,doc){//{n:1(删除了n个文档)，ok：1（成功）}
        console.log('remove()',error,doc)
    })
}
testRemove()
