# 闭包
## 一、闭包的含义

**闭包是指有权访问另一个函数作用域变量的函数，每一个函数都会生成自己的作用域，都有自己的作用域，当在自身作用域访问一个变量4，会先查找自身作用域中是否包含这个变量，没有的话就往父级作用域查找，直到全局作用域。这就形成了一个完整的作用域链。闭包的本质就是当前环境存在对父级作用域对引用。**

## 二、闭包的优势
- 可以生成私有变量（自执行函数），避免全局环境的污染
- 可以缓存变量（防抖节流）

## 三、闭包的劣势
- 由于存在对另外一个函数作用域变量的引用，导致另外一个函数执行完后被引用的变量不会被垃圾回收机制回收，过度使用容易造成内存泄露

## 四、使用场景
``` javascript
// 简单的防抖其实就是一个闭包, 返回的函数存在对timer的引用
function debounce(fn, delay) {
  let timer
  return function () {
    clearTimeout(timer)
    const context = this
    const args = arguments 
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
```