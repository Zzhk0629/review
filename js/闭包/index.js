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

function test() {
  console.log(1111)
}
const result = debounce(test, 200)
result()