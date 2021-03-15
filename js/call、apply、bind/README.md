# call、apply、bind

## call、apply、bind是做什么的？

**call** 、**apply** 、**bind** 核心的功能就是改变当前函数的执行上下文，即 **this** 指向。

## call、apply、bind的区别

首先从函数是否调用来说，**call** 和 **apply** 会立即调用，而 **bind** 会返回一个函数，需要手动调用。而 **call** 和 **apply**的唯一区别就是接收参数的方式不一样，**call** 需要将参数按照顺序传递进去，而 **apply** 是把参数放在数组中。从性能上来说，**call** 会比 **apply** 稍微好一点，毕竟 **apply** 会对传入的数组做一层转换。

## 手写 call、apply

先来了解一下 **this** ，**this** 的指向在函数定义的时候是不确定的，只有当函数执行的时候才能知道 **this** 的指向，**this** 的最终指向调用函数的对象。因此我们在实现 **call** 、**apply** 的原理的就是将函数作为传入的第一个参数对象的属性，然后执行这个函数，这样函数的 **this** 就是这个对象。先来看看 **call** 和 **apply** 的具体实现。

```javascript
// call
Function.prototype.myCall = function (context, ...args) {
  // 判断要绑定 this 的指向值是否存在，存在就将其转为对象 不存在默认为 window
  context = context ? Object(context) : window
  // 将当前函数作为 context 的一个属性
  context.fn = this
  // 执行 fn 函数（即当前函数）并获取返回值，此时 fn 函数的 this 指向 context
  const result = context.fn(...args)
  // 将添加的属性删除，避免影响原有的对象
  delete context.fn
  // 返回函数执行的返回值
  return result
}

// apply
Function.prototype.myApply = function (context, arr) {
  // 判断传入的第二个参数是否是数组
  if (!Array.isArray(arr)) {
    throw new TypeError('参数类型错误！')
  }
  // 其它与 call 一致
  context = context ? Object(context) : window
  context.fn = this
  const result = context.fn(...arr)
  delete context.fn
  return result
}
```

## 手写 bind

**bind** 和 **call**、**apply** 的区别上面也提到过了，就是手动调用与立即调用的区别，因此我们可以知道 **bind** 返回的是一个函数，在这个函数里面会执行要执行的函数并改变它的 **this** 指向为传入 **bind** 的第一个参数。看看具体实现：
```javascript
Function.prototype.myBind = function (context, ...args) {
  // 存一下当前的 this
  const self = this
  // 返回一个函数
  return function () {
    // 获取函数的参数值并转成数组
    const args1 = Array.prototype.slice.call(arguments)
    // 执行 apply 方法改变当前函数的 this 指向，并返回执行结果
    return self.apply(context, args.concat(args1))
  }
}
```
这种方式乍一看其实并没发现什么问题，但是对于一个函数来说它除了是一个普通函数外，有可能是一个构造函数，这种情况下当我们 **new** 的时候，你传入的 **context** 就会失效，但是你传入的其它参数还是会作为构造函数调用时候的参数。这种情况下上面的这种情况就满足不了需求了。因此我们需要针对构造函数以及普通函数的两种场景作一些额外处理，看看具体实现：

```javascript
Function.prototype.myBind = function (context, ...args) {
  const self = this
  // 声明一个空的构造函数
  let fNOP = function () {}
  // 这是需要返回的函数
  let fBound = function () {
    // 获取函数的参数并转成数组
    const args1 = Array.prototype.slice.call(arguments)
    // 判断 fNOP 的原型对象是否存在于 this （当前函数）的原型链之中，是的话就证明是构造函数返回 this， 不是就返回 context
    return self.apply(fNOP.prototype.isPrototypeOf(this) ? this : context, args.concat(args1))
  }
  // 如果这个函数有原型对象，就将该函数的原型对象赋值给 fNOP 的原型对象
  if (this.prototype) {
    fNOP.prototype = this.prototype
  }
  // 将 fBound 的原型对象赋值给 fNOP 的实例对象
  fBound.prototype = new fNOP()
  return fBound
}
```
看到这可能会有个疑问，就是为什么要声明一个空的构造函数，如果像下面这样不行么？

```javascript
fBound.prototype = this.prototype
```
为什么要多此一举呢，其实我们都知道对象是一个引用类型，当我们对象赋值后，改变其中一个对象的属性，这会导致这两个对象都会发生变化，就是相当于我改变 **fBound** 的原型对象的同时，原函数的原型对象也会跟着改变，这肯定是不合理的，所以就引入一个中间媒介。这样既能实现原有功能的同时还能保证原有函数的独立性。