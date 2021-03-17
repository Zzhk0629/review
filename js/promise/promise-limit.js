const urls = [
  {
    info: 'link1',
    time: 3000
  },
  {
    info: 'link2',
    time: 1000
  },
  {
    info: 'link3',
    time: 2000
  },
  {
    info: 'link4',
    time: 2500
  },
  {
    info: 'link5',
    time: 1200
  },
  {
    info: 'link6',
    time: 3000
  },
  {
    info: 'link7',
    time: 2200
  },
  {
    info: 'link8',
    time: 1600
  },
  {
    info: 'link9',
    time: 5000
  },
  {
    info: 'link10',
    time: 2000
  },
  {
    info: 'link11',
    time: 1400
  },
  {
    info: 'link12',
    time: 1800
  }
]

function loadImg(url) {
  return new Promise((resolve, reject) => {
    console.log('-----' + url.info + 'start!!')
    setTimeout(() => {
      console.log(url.info + '  已完成！！')
      resolve()
    }, url.time)
  })
}
// 并发控制
function limitLoad(urls, handler, limit) {
  const shallowUrls = [].concat(urls)
  let promises = shallowUrls.splice(0, limit).map((item, index) => {
    return handler(item).then(() => {
      return index
    })
  })
  let p = Promise.race(promises)
  for (let i = 0; i < shallowUrls.length; i++) {
    p = p.then((idx) => {
      promises[idx] = handler(shallowUrls[i]).then(() => {
        return idx
      })
      return Promise.race(promises)
    })
    
  }
  
}
limitLoad(urls, loadImg, 3)