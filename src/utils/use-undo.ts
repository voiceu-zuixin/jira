import { useState } from 'react'

// undo：撤销相对于ctrl + z  //  redo：撤销之后恢复 ctrl + y
// 传入初始的当前状态
export const useUndo = <T>(initialPresent: T) => {
  const [past, setPast] = useState<T[]>([])
  const [present, setPresent] = useState(initialPresent)
  const [future, setFuture] = useState<T[]>([])

  // past数组有内容的时候，可用撤销到past状态
  const canUndo = past.length !== 0

  // past数组有内容的时候，可用恢复到future状态
  const canRedo = future.length !== 0

  // undo撤销 函数
  const undo = () => {
    // 当canUndo为false的时候，即是不可以撤销，直接return
    if (!canUndo) return

    // 取past状态最后一位数据，作为previous
    const previous = past[past.length - 1]

    // 定义newPast数组，删掉取出来的最后一位变为新数组
    const newPast = past.slice(0, past.length - 1)

    // 更新past
    setPast(newPast)

    // 把当前状态变为previous
    setPresent(previous)

    // 添加原来的初始状态到future，以便redo
    setFuture([present, ...future])
  }

  // redo恢复 函数  跟undo相同的逻辑
  const redo = () => {
    if (!canRedo) return

    const next = future[0]
    const newFuture = future.slice(1)

    // 更新past数组，注意把present放在最后
    setPast([...past, present])
    setPresent(next)
    setFuture(newFuture)
  }

  // set添加新状态 函数  只有past，当前新状态newPresent，没有future
  const set = (newPresent: T) => {
    // 如果新添加的状态是当前状态，就不做任何动作
    if (newPresent === present) {
      return
    }

    // 更新past和present
    setPast([...past, present])
    setPresent(newPresent)

    // 但是future变成空数组，因为是跳到了一个全新的状态
    setFuture([])
  }

  // reset重置 函数 只有当前新状态newPresent ， 没有past，没有future
  const reset = (newPresent: T) => {
    setPast([])
    setPresent(newPresent)
    setFuture([])
  }

  // 返回数据和函数
  return [
    { past, present, future },
    { set, reset, undo, redo, canUndo, canRedo }
  ] as const
}
