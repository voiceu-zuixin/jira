// 判断是0还是undefined或者null，只有后两者才是真的false
export const isFalsy = (value) => (value === 0 ? false : !value)

// 删除空属性
export const cleanObject = (object) => {
  // 在一个函数里，改变传入的对象本身是不好的，所以新建一个一样的对象result
  // Object.assign({},object)
  const result = { ...object }

  // 对result内部的所有key进行遍历，如果该key的value是undefined或者null，就删除该key
  // 但是要防范value为0的时候，所以另写一个isFalsy函数
  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (isFalsy(value)) {
      delete result[key]
    }
  })
  return result
}
