function myNew (Fn, ...args) {
  let result = {}
  Object.setPrototypeOf(result, Fn.prototype)
  const returnData = Fn.apply(result, args)
  if ((typeof returnData === 'object' || typeof returnData === 'function') && returnData !== null) {
    return returnData
  }
  return result
}

function Test1(options) {
  this.name = options.name
  this.age = options.age
}
Test1.prototype.getName = function () {
  return this.name
}

const testNew = myNew(Test1, {
  name: 'Zzhk',
  age: 26
})
console.log(testNew)