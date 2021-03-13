# new

## **new** 的过程做了什么？
1. 创建一个对象
2. 将这个对象的原型指向对应构造函数的原型对象
3. 将构造函数中的 **this** 指向这个对象，并执行构造函数
4. 判断函数执行的返回值是否是一个对象，如果是返回函数执行的返回值，如果不是，返回创建的这个对象

那我们知道了这个 **new** 的整个过程，其实我们也可以自己实现一个 **new**，大体的思路就是上面的 **4** 个步骤，具体代码如下
```javascript
function myNew (Fn, ...args) {
  // 创建一个对象
  let result = {}
  // 将这个对象的原型指向对应构造函数的原型对象
  Object.setPrototypeOf(result, Fn.prototype)
  // 将构造函数中的 this 指向这个对象，并执行构造函数
  const returnData = Fn.apply(result, args)
  // 判断函数执行的返回值是否是一个对象
  if ((typeof returnData === 'object' || typeof returnData === 'function') && returnData !== null) {
    // 是返回这个对象
    return returnData
  }
  // 不是返回创建的这个对象
  return result
}
```