import React from 'react'
import { ReactNode } from 'react'
import {
  Draggable,
  DraggableProps,
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableProvidedProps
} from 'react-beautiful-dnd'

// 原生的DropProps的children是一个函数类型，这里先删除，然后加上ReactNode的children类型，进行改写自己风格的类型
type DropProps = Omit<DroppableProps, 'children'> & { children: ReactNode }

export const Drop = ({ children, ...props }: DropProps) => {
  //但是Droppable的类型并没有改变，自定义的是Drop的类型，所以这里还是有函数
  return (
    <Droppable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided
          })
        }
        return <div></div>
      }}
    </Droppable>
  )
}

type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> &
  React.HTMLAttributes<HTMLDivElement>

// React.forwardRef可以让这个组件能够传入ref
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {/* dnd的要求，要这样写，跟着文档走就行，什么都要了解源码太多了，不现实 */}
      {props.provided?.placeholder}
    </div>
  )
)

type DragProps = Omit<DraggableProps, 'children'> & { children: ReactNode }

export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef
          })
        }
        return <div></div>
      }}
    </Draggable>
  )
}
