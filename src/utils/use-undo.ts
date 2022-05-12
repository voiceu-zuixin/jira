// 不用useState，改用useReducer，在组件内部进行state状态的管理
import { useCallback, useReducer } from 'react'

const UNDO = 'UNDO'
const REDO = 'REDO'
const SET = 'SET'
const RESET = 'RESET'

type State<T> = {
  past: T[]
  present: T
  future: T[]
}

type Action<T> = {
  newPresent?: T
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET
}

// reducer的参数里state是旧state，action中包含了新state
const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  const { past, present, future } = state
  const { newPresent } = action

  switch (action.type) {
    // UNDO撤销 操作
    case UNDO: {
      // 如果past为空，则说明不能进行撤销操作，就返回旧的state
      if (past.length === 0) return state

      // 取past状态最后一位数据，作为previous
      const previous = past[past.length - 1]

      // 定义newPast数组，删掉取出来的最后一位变为新数组
      const newPast = past.slice(0, past.length - 1)

      return {
        // 更新past
        past: newPast,

        // 把当前状态变为previous
        present: previous,
        // 添加原来的初始状态到future，以便redo

        future: [present, ...future]
      }
    }

    // REDO恢复 操作  跟UNDO相同的逻辑
    case REDO: {
      if (future.length === 0) return state

      const next = future[0]
      const newFuture = future.slice(1)

      return {
        // 更新past数组，注意把present放在最后
        past: [...past, present],
        present: next,
        future: newFuture
      }
    }

    // SET添加新状态   只有past，当前新状态newPresent，没有future
    case SET: {
      // 如果新添加的状态是当前状态，就不做任何动作
      if (newPresent === present) return state

      // 否则 更新past和present
      return {
        past: [...past, present],
        present: newPresent,
        // 但是future变成空数组，因为是跳到了一个全新的状态
        future: []
      }
    }

    // RESET重置  只有当前新状态newPresent ， 没有past，没有future
    case RESET: {
      return {
        past: [],
        present: newPresent,
        future: []
      }
    }
  }

  // return state
}

// undo：撤销相对于ctrl + z  //  redo：撤销之后恢复 ctrl + y
export const useUndo = <T>(initialPresent: T) => {
  // useReducer第一个参数是具体的reducer逻辑，第二个参数是初始的state
  // 获取到state和dispatch函数，调用dispatch的时候，传入type和新的state
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: []
  } as State<T>)

  // past数组有内容的时候，可用撤销到past状态
  const canUndo = state.past.length !== 0

  // future数组有内容的时候，可用恢复到future状态
  const canRedo = state.future.length !== 0

  // undo只需要传type就行，state就是past数组里面的最后一个数据
  const undo = useCallback(() => dispatch({ type: UNDO }), [])

  // redo只需要传type就行，state就是future数组里面的第一个数据
  const redo = useCallback(() => dispatch({ type: REDO }), [])

  const set = useCallback(
    (newPresent: T) => dispatch({ type: SET, newPresent }),
    []
  )

  const reset = useCallback(
    (newPresent: T) => dispatch({ type: RESET, newPresent }),
    []
  )

  // 返回数据和函数
  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const
}
