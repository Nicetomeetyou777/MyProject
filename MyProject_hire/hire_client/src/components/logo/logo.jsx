import React from 'react'
import './logo.less'
import logo from './logo.jpg'
export default function Logo(){
    return(
        <div className='logo-container'>
        <img src={logo} alt="" className='logo-img'/></div>
    )
}