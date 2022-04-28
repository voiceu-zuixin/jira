const param = {
  name: '11',
  id: 1
}

let a = { ...param }
console.log('a:', a)

/* 
Object.assign({},...)第一个参数为目标对象，后面所有参数为源对象，
把所有源对象合并到目标对象中，只要把目标对象设置成一个空对象，
我们就得到了一个新对象，这种做法是拥抱不变性的，
因为没有任何源对象的改变。当遇到相同属性时，排在后面的源对象会覆盖写先前对象的该属性。
*/

let b = { ...param, name: '222' } //会自动覆盖param解构出来的name
console.log('b', b)

// 相对于如下形式
let c = Object.assign({}, param, { name: '333' })
console.log('c', c)

// async function async1() {
//   console.log(1)
//   await waitHandle()
//   console.log(2)
// }
// async1()
// function waitHandle() { console.log(3) }
let data = 1
console.log(1)
console.log('data,同步', data)
let foo = new Promise((resolve, reject) => {
  // 同步任务
  console.log(2)
  // 宏任务
  setTimeout(() => {
    console.log(4)
    resolve('1')
  }, 1500)
})

new Promise((resolve, reject) => {
  // 同步
  console.log(3)
  // 宏任务
  // resolve('1')

  // 如果这里写的是宏任务，那么该promise的then处理，需要等到他的结果出来才进行
  // 不管后面有没有async，因为async只是等待await后面的函数
  setTimeout(() => {
    console.log(5)
    resolve('1')
  }, 3000)
})
  // 微任务，但是变成了同步
  .then(async (res) => {
    console.log(6)

    // 异步函数，会等待await后方的函数执行完毕后，再继续往下执行
    // 此处就是等待
    console.log('async,内部1', data)
    // console.log(foo)
    await foo.then(() => {
      console.log(7)

      data = 2
      console.log('data,异步', data)
    })
    console.log(8)
    console.log('async,内部2', data)
  })
