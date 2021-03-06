/* 
  useContext的用法
  两个子组件想要进行通信，可以在外部的父组件创建const AuthContext = React.createContext()
  参数是AuthContext.Provider中value一样的

  父组件用<AuthContext.Provider/>包裹子组件
  子组件内部用useContext(AuthContext)，传入父组件定义的AuthContext，才能进行通信

  其中可以通信的内容是<AuthContext.Provider/>标签的value属性，比如下面的
  <AuthContext.Provider value={{ user, login, register, logout }} />

*/

import React, { ReactNode } from 'react'
// 因为auth-provider中有login与此模块的login重名，所以起一个别名auth，通过auth.login调用，其他同理
import * as auth from 'utils/auth-provider'
import { User } from 'types/user'
import { http } from 'utils/http'
import { useMount } from 'utils'
import { useAsync } from 'utils/use-async'
import { FullPageErrorFallback, FullPageLoading } from 'components/lib'
import { useQueryClient } from 'react-query'

// 定义AuthForm类型
interface AuthForm {
  username: string
  password: string
}

// 一个用于保存当前user信息状态的函数，以防刷新后丢失user
const bootstrapUser = async () => {
  let user = null
  // 虽然刷新了，但是在localStroage里面还是存的有token
  const token = auth.getToken()

  //如果有token，就拿着token去后端请求，获取当前的user是什么，并返回user
  if (token) {
    const data = await http('me', { token })
    user = data.user
  }

  // console.log(user)
  // 如果没有返回的还是null
  return user
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
  // const [user, setUser] = useState<User | null>(null)

  // 用useAsync来改造，展示loading效果,data:user这是起别名，换成user
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser
  } = useAsync<User | null>()

  const queryClient = useQueryClient()

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
    return auth.logout().then(() => {
      setUser(null)
      // 清空useQuery的缓存，以防下次注册新用户进来的时候，网络慢，会先展示上一个用户的信息
      queryClient.clear()
    })
  }

  // 每次刷新的时候都要根据存好的token获取当前的user，防止刷新后user状态就没了
  useMount(() => {
    // 如果是未登录状态，那么bootstrapUser()返回的是null，null再setUser就没任何影响了
    // setUser会在run内部调用
    run(bootstrapUser())
  })

  // 如果请求还没有结果的时候，就渲染loading
  if (isIdle || isLoading) {
    return <FullPageLoading />
  }

  // 如果在刷新的时候出错，那么会自动弹到登录界面，如果不给用户提示的话，用户可能一直反复登录
  // 体验不好
  if (isError) {
    return <FullPageErrorFallback error={error} />
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
