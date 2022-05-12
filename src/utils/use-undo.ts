import { useCallback, useState } from 'react'

// undo：撤销相对于ctrl + z  //  redo：撤销之后恢复 ctrl + y
// 传入初始的当前状态
export const useUndo = <T>(initialPresent: T) => {
  // 合并past，present，future到state
  const [state, setState] = useState<{
    past: T[]
    present: T
    future: T[]
  }>({
    past: [],
    present: initialPresent,
    future: []
  })

  // past数组有内容的时候，可用撤销到past状态
  const canUndo = state.past.length !== 0

  // future数组有内容的时候，可用恢复到future状态
  const canRedo = state.future.length !== 0

  // 用useCallback包裹函数，以防每次都是新函数
  const undo = useCallback(() => {
    // setState传入函数的话，参数是先前的state，该函数会被执行，也不必担心异步问题？（有待确认）
    // 该函数的返回值传给setState用于更新
    setState((currentState) => {
      // 取出past, present, future
      const { past, present, future } = currentState

      // 如果past为空，则说明不能进行撤销操作，就返回旧的state
      if (past.length === 0) return currentState

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
    })
  }, [])

  // redo恢复 函数  跟undo相同的逻辑
  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState
      if (future.length === 0) return currentState

      const next = future[0]
      const newFuture = future.slice(1)

      return {
        // 更新past数组，注意把present放在最后
        past: [...past, present],
        present: next,
        future: newFuture
      }
    })
  }, [])

  // set添加新状态 函数  只有past，当前新状态newPresent，没有future
  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      const { past, present } = currentState

      // 如果新添加的状态是当前状态，就不做任何动作
      if (newPresent === present) return currentState

      // 否则 更新past和present
      return {
        past: [...past, present],
        present: newPresent,
        // 但是future变成空数组，因为是跳到了一个全新的状态
        future: []
      }
    })
  }, [])

  // reset重置 函数 只有当前新状态newPresent ， 没有past，没有future
  const reset = useCallback((newPresent: T) => {
    setState(() => {
      return {
        past: [],
        present: newPresent,
        future: []
      }
    })
  }, [])

  // 返回数据和函数
  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const
}
