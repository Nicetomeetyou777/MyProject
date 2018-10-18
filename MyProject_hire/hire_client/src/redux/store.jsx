/**
 * redux最核心的管理对象模块
 */
import {createStore,applyMiddleware} from 'redux'//应用中间件
import thunk from 'redux-thunk'//异步中间件
import {composeWithDevTools} from 'redux-devtools-extension'//扩展插件

import reducers from './reducers'

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))