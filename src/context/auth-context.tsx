import React, { useState } from 'react'
// 因为auth-provider中有login与此模块的login重名，所以起一个别名auth，通过auth.login调用，其他同理
import * as auth from 'auth-provider'
import { User } from 'screens/project-list/search-panel'

// 定义AuthForm类型
interface AuthForm {
  username: string
  password: string
}

// 创建AuthContext的context
const AuthContext = React.createContext(undefined)

// 用在dev-tool里面，跟前端没多大关系，后端逻辑会处理
AuthContext.displayName = 'AuthContext'

// AuthProvider权限提供者函数
export const AuthProvider = () => {
  /* 
  useState的类型如下方所示，所以可以指定<S>为想要的类型
  function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] (+1 overload)
  */
  // 指定泛型为<User | null>，意思是后面参数initialState: <User | null> | (() => <User | null>)
  // 初始user为null
  const [user, setUser] = useState<User | null>(null)

  // login函数，传入form表单数据，类型是上方定义的接口AuthForm类型
  const login = (form: AuthForm) => {
    //将form传入auth.login()方法，期望得到一个成功的promise对象，结果是user
    // 随后通过then将user传入，调用setUser方法，更新user的状态，
    // 此前user是null，成功后得到user的信息，存入state，便是在前端页面登录了，后续的操作可以继续

    // xxx((user) => setUser(user)) xxx函数的内部参数是一个函数，
    // 且函数的函数体是一个函数，其参数函数的参数，可以直接写成 xxx(setUser)
    auth.login(form).then(setUser)
  }

  // 注册同理
  const register = (form: AuthForm) => {
    auth.register(form).then(setUser)
  }

  // 退出，将user再次设置为null
  const logout = (form: AuthForm) => {
    auth.logout().then(() => setUser(null))
  }
}
