/**
 * 包含n个工具函数的模块
 */


/**
 * 登录或注册：1，/zhaopin
 *      2, /yingpin
 * user.type
 * 如果未完善界面：1：/zhaopininfo
 *                2:/yingpininfo
 * user.header
 * 
 */

export function getRedirectTo(type,header){
    let path=''
    //   if(type==='/zhaopin'){
    //        path='/zhaopin'
    //   }else{
    //       path='/yingpin'
    //   }
    path+=type==='zhaopin'?'/zhaopin':'/yingpin'
      if(!header){
          path+='info'
      }
      return path
}