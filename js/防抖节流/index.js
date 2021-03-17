// 防抖 指的是在频繁触发事件中只有当触发事件一定时间没有再次触发的时候执行，如果一定时间内再次触发，则重新计时
function debounce (fn, delay) {
  let timer
  return function () {
    const context = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

// 节流 指的是在频繁触发事件中每过一定时间执行一次事件
// 版本1 (首次触发事件立即执行， 最后一次不一定执行)
function throttle1(fn, delay) {
  let prevTime = 0
  return function () {
    const currentTime = Date.now()
    if (currentTime - prevTime >= delay) {
      fn.apply(this, arguments)
      prevTime = currentTime
    }
  }
}
// 版本二 （首次触发事件延迟执行，最后一次也是延迟执行）
function throttle2(fn, delay) {
  let timer
  return function () {
    const context = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(function () {
        fn.apply(context, args)
        clearTimeout(timer)
        timer = null
      }, delay)
    }
  }
}
// 版本三 （首次立即执行，最后一次也是延迟执行)
function throttle3(fn, delay) {
  let prevTime = Date.now()
  let timer
  return function () {
    const context = this
    const args = arguments
    const currentTime = Date.now()
    const remain = delay - (currentTime - prevTime)
    clearTimeout(timer)
    if (remain <= 0) {
      fn.apply(context, args)
      prevTime = Date.now()
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay);
    }
  }
}