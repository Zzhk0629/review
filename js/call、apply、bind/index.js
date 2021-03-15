Function.prototype.myCall = function (context, ...args) {
  context = context ? Object(context) : window
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.myApply = function (context, arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('参数类型错误！')
  }
  context = context ? Object(context) : window
  context.fn = this
  const result = context.fn(...arr)
  delete context.fn
  return result
}

Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('绑定的this不是一个函数')
  }
  const self = this
  let fNOP = function () {}
  let fBound = function () {
    const args1 = Array.prototype.slice.call(arguments)
    return self.apply(fNOP.prototype && fNOP.prototype.isPrototypeOf(this) ? this : context, args.concat(args1))
  }
  fNOP.prototype = this.prototype
  // if (this.prototype) {
  //   fNOP.prototype = this.prototype
  // }
  fBound.prototype = new fNOP()
  return fBound
}

let a = {
  name: 'fromA',
  getName (extra) {
    console.log(this.name, extra)
  }
}

let b = {
  name: 'fromB'
}

let result = {
  a: 'resultA',
  b: 'resultB'
}

a.getName.myCall(b, 'call')
a.getName.myApply(b, ['apply'])
a.getName.myBind(b, 'bind')()

function First (opt) {
  this.a = opt.a
  this.b = opt.b
}
const Second = First.myBind(result, result)

console.log(new Second())
