/* 
  useContext的用法
  两个子组件想要进行通信，可以在外部的父组件创建const AuthContext = React.createContext()
  参数是AuthContext.Provider中value一样的

  父组件用<AuthContext.Provider/>包裹子组件
  子组件内部用useContext(AuthContext)，传入父组件定义的AuthContext，才能进行通信

  其中可以通信的内容是<AuthContext.Provider/>标签的value属性，比如下面的
  <AuthContext.Provider value={{ user, login, register, logout }} />

*/

import React, { ReactNode, useState } from 'react'
// 因为auth-provider中有login与此模块的login重名，所以起一个别名auth，通过auth.login调用，其他同理
import * as auth from 'auth-provider'
import { User } from 'screens/project-list/search-panel'

// 定义AuthForm类型
interface AuthForm {
  username: string
  password: string
}

// 创建AuthContext的context
const AuthContext = React.createContext<
  | {
      user: User | null
      register: (form: AuthForm) => Promise<void>
      login: (form: AuthForm) => Promise<void>
      logout: () => Promise<void>
    }
  | undefined
>(undefined)

// 用在dev-tool里面，跟前端没多大关系，后端逻辑会处理
AuthContext.displayName = 'AuthContext'

// AuthProvider，返回<AuthContext.Provider>用于包裹子组件，
// 只有包裹上了，并且子组件用useContext后，才能通信
// 用法：父组件用这个，生成<AuthContext.Provider>标签，再包裹子组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
    return auth.login(form).then(setUser)
  }

  // 注册同理
  const register = (form: AuthForm) => {
    return auth.register(form).then(setUser)
  }

  // 退出，将user再次设置为null
  const logout = () => {
    return auth.logout().then(() => setUser(null))
  }

  // 返回AuthContext.Provider
  return (
    // 看一下React.createContext的用法
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  )
}

// 自定义hook，不再写useContext一堆，封装起来，更简洁
// 用法：子组件内部直接用这个，就可以建立通信了
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用')
  }
  return context
}
