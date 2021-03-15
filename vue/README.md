# Vue源码阅读笔记

## Vue是什么？

当我们在使用 **Vue** 的时候，都是通过 **new Vue({...})** 进行初始化的，所以对于我们来说，**Vue** 就是一个简简单单的构造函数，就是我们平常使用 **class** 或者普通构造函数定义的函数。**Vue** 被定义的位置：
```javascript
// src/instance/index.js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
当我们在 **new** 的时候，其实就只是调用了 **this._init(options)** 方法，并传入初始化的参数。

在这之前，其实 **Vue** 还做了一些工作，定义了一些 **Vue** 的原型方法以及静态方法。具体如下：
```javascript
// 给Vue原型添加_init方法
initMixin(Vue)
// 给Vue原型添加$data、$props属性（使用Object.defineProperty），添加$set、$delete、$watch方法
stateMixin(Vue)
// 给Vue原型添加事件的发布以及订阅等等（$on、$once、$off、$emit），采用发布订阅的设计模式
eventsMixin(Vue)
// 给Vue原型添加更新、强制更新、销毁事件（_update、$forceUpdate、$destroy）
lifecycleMixin(Vue)
// 给Vue原型添加异步更新队列函数（$nextTick）、渲染生成vnode函数（_render）
renderMixin(Vue)
```
通过上面的代码我们也能知道为什么 **Vue** 采用普通的沟通函数实现，而不是 **ES6** 提供的 **class** 。当我们使用 **class** 是做不到将 **Vue** 的功能拆分到不同的目录和模块中分别处理，使用普通的构造函数能让我们的代码结构更加清晰，也有利于后期的维护。

当上述的这些方法执行完后，**Vue** 还定义了一些全局的静态方法和全局组件。
```javascript
export function initGlobalAPI (Vue: GlobalAPI) {
  ...
  ...
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 初始化 options 对象
  Vue.options = Object.create(null)
  // 初始化全局的component、directive、filter
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  Vue.options._base = Vue
  // 注册内置的全局组件（keep-alive）
  extend(Vue.options.components, builtInComponents)
  // 定义 Vue.use 方法
  initUse(Vue)
  // 定义 Vue.mixin 方法
  initMixin(Vue)
  // 定义 Vue.extend 方法
  initExtend(Vue)
  // 定义 Vue.component、directive、filter 方法
  initAssetRegisters(Vue)
}
```