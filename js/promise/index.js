// 手写Promise.all
function promiseAll (promiseArr) {
  if (!Array.isArray(promiseArr)) {
    throw new Error('传入的参数必须是数组！')
  }
  return new Promise((resolve, reject) => {
    const len = promiseArr.length
    const arr = new Array(len)
    let count = 0
    for (let i = 0; i < len; i++) {
      Promise.resolve(promiseArr[i]).then(value => {
        arr[i] = value
        count++
        if (count === len) {
          resolve(arr)
        }
      }, err => {
        reject(err)
      })
    }
  })
}

// 手写Promise.race
function promiseRace (promiseArr) {
  if (!Array.isArray(promiseArr)) {
    throw new Error('传入的参数必须是数组！')
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseArr.length; i++) {
      Promise.resolve(promiseArr[i]).then(value => {
        resolve(value)
      }, err => {
        reject(err)
      })
    }
  })
}

// 手写Promise.allSettled
function promiseAllSettled (promiseArr) {
  if (!Array.isArray(promiseArr)) {
    throw new Error('传入的参数必须是数组！')
  }
  return new Promise((resolve, reject) => {
    const len = promiseArr.length
    const arr = new Array(len)
    let count = 0
    for (let i = 0; i < len; i++) {
      Promise.resolve(promiseArr[i]).then(value => {
        arr[i] = {
          status: 'fulfilled',
          value: value
        }
      }, reason => {
        arr[i] = {
          status: 'rejected',
          reason: reason
        }
      }).finally(() => {
        count++
        if (count === len) {
          resolve(arr)
        }
      })
    }
  })
}

// 手写Promise.any
function promiseAny (promiseArr) {
  if (!Array.isArray(promiseArr)) {
    throw new Error('传入的参数必须是数组！')
  }
  return new Promise((resolve, reject) => {
    const len = promiseArr.length
    const arr = new Array(len)
    let count = 0
    for (let i = 0; i < len; i++) {
      Promise.resolve(promiseArr[i]).then(value => {
        resolve(value)
      }, reason => {
        count++
        arr[i] = reason
      }).finally(() => {
        if (count === len) {
          reject(arr)
        }
      })
    }
  })
}

let test1 = Promise.resolve('test1')
let test2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('test2')
  }, 2000)
})
let test3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('test3')
  }, 1000)
})
let test4 = Promise.reject('test4 ===> error')
let test5 = Promise.reject('test5 ===> error')
let test6 = Promise.reject('test6 ===> error')

promiseAll([test1, test2, test3, test4]).then(data => {
  console.log('[Promise.all]: fulfilled ', data)
}).catch(err => {
  console.log('[Promise.all]: reject ', err)
})
promiseRace([test1, test2, test3, test4]).then(data => {
  console.log('[Promise.race]: fulfilled ', data)
}).catch(err => {
  console.log('[Promise.race]: reject ', err)
})
promiseAllSettled([test1, test2, test3, test4]).then(data => {
  console.log('[Promise.allSettled]: fulfilled ', data)
}).catch(err => {
  console.log('[Promise.allSettled]: reject ', err)
})
promiseAny([test1, test4, test5, test6]).then(data => {
  console.log('[Promise.any]: fulfilled ', data)
}).catch(err => {
  console.log('[Promise.any]: reject ', err)
})