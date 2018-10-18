/**
 * 能发送ajax请求的函数模块
 * 函数返回至是promise对象
 */
import axios from 'axios'
export default function ajax(url,data={},type='GET'){
    if(type==='GET'){//发送get请求
        //拼请求参数串
        //data={username:tom,password:123}
        //paramStr:username=tom&password:123
        let paramStr=''
        Object.keys(data).forEach(key=>{
            paramStr+=key+'='+data[key]+'&'
        })
        if(paramStr){
            paramStr=paramStr.substring(0,paramStr.length-1)
        }
        return axios.get(url+'?'+paramStr)
    }else{//发送post请求
        return axios.post(url,data)
    }
         
}