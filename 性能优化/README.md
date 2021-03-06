# 性能优化

## 一、请求优化

### 合理利用浏览器缓存

当我们加载一个页面的时候，如何有效的利用浏览器的缓存，对我们的用户体验尤为重要。高效的利用缓存可以缩短我们请求网络资源的时间，减少延迟，由于缓存文件得到了重复利用，也能有效减少带宽，降低网络负荷。

对于一个资源请求来说，主要分为发起资源请求，后端数据处理，浏览器响应三个步骤，浏览器的缓存可以帮助我们在第一步和第三步进行优化。发起请求直接使用缓存文件，或者发起请求，对于后端数据没有发生变化，这个时候就没必要将数据传回来，减少了响应时间。


### 缓存位置

浏览器的缓存位置主要分布在以下 4 个位置

- Service Worker
- Memory cache
- disk cache
- push cache （http/2 的内容）

**1.Service Worker**

Service Worker 是运行在浏览器背后的独立线程，可以用来实现缓存功能，使用它，有个前提条件就是传输协议必须是 https，因为它涉及到请求拦截，必须使用 https 来保证数据的安全。Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。当没有命中缓存的时候，需要调用 fetch 去请求数据，它存在一定的兼容性问题。

**2.Memory Cache**

Memory Cache 指的是存储在内存中的缓存，主要包含页面中已经抓取到一些数据，包括一些图片、样式、脚本等等。读取内存中的缓存肯定会比硬盘中的快，但是它的持续性较短，当我们关闭当前 tab 页的时候，内存也会跟着释放。由于内存的空间相对硬盘的空间小很多，所以并不能将所有的数据都放到内存中。内存缓存中有一块重要的缓存资源是 preload 和 prefetch 下载的资源。它可以一边解析js/css文件，一边网络请求下一个资源。preload 代表的预加载的方式，它指的是需要提前加载的资源，当真正被使用的使用，就会立即执行无需等待。prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源。

**3.Disk Cache**
Disk Cache 指的是存储在硬盘中的缓存，它相对于内存来说，优点就是时效性长以及可利用空间大。

浏览器如何分配 **Memory Cache** 和 **Disk Cache** ？

一般来说，对于那些大文件，大概率是不会存储到内存中；其次就是当前内存占用率高，就会优先缓存到硬盘中。

**4.Push Cache**

敬请期待


### 浏览器的缓存过程

- 第一步、浏览器第一次发起请求，经过浏览器缓存，判断没有缓存结果和缓存标识，并告知浏览器。
- 第二步、浏览器收到没有缓存的通知后，发起 http 请求，服务器将请求结果和缓存的规则发送给浏览器。
- 第三步、浏览器将请求结果及缓存的相关标识存储到浏览器缓存中。

### 缓存类型

根据是否需要向服务端发起请求，我们可以将缓存类型分为强缓存和协商缓存。两者都是通过设置 HTTP Header 的方式来实现的。

**强缓存**

强缓存不会向服务端发送请求，而是直接从浏览器的缓存中读取，强缓存主要是通过两种设置 HTTP Header 的形式：Expires 和 Cache-Control。

Expires 是响应头中的属性，指的是缓存的过期时间。如果 Cache-Control 设置了 max-age 或者 s-max-age， 则 Expires 会被忽略。它是 http1.0 的产物，目前大部分浏览器都使用 http1.1。

Cache-Control 也是响应头中的属性，指的是缓存的持续时间。比如说设置了 cache-control：max-age=120，表示的2分钟内再次请求的话都会直接走缓存。Cache-Control的取值主要有以下几种

|  属性  |  作用  |
|  ----  | ----  |
| public  | 所有内容都将被缓存（客户端和代理服务器都可缓存） |
| private  | 只有客户端才能缓存（代理服务器只能将请求分发给服务器，不会自己缓存数据） |
| max-age  | 缓存存在的最长时间，以秒为单位，超过这个时间则重新请求数据 |
| s-maxage  | 与 max-age 相似，但只针对代理服务器生效（CDN缓存） |
| no-store  | 不缓存任何数据 |
| no-cache  | 意思不是不缓存，是缓存需要通过协商缓存来验证决定 |
| max-stale  | 表示客户端愿意接收一个过期的资源，但不能超过指定时间 |
| min-fresh  | 表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应 |

强缓存主要是通过时间来决定是否缓存数据，它不在乎服务端返回的数据是否已更新，当我们需要知道服务端内容是否更新就需要用到协商缓存。

**协商缓存**

当强缓存失效后就会走协商缓存，浏览器将携带缓存标识发送给服务端，服务端根据这个缓存标识判断是否需要走缓存。协商缓存生效，则返回304和 Not Modified。协商缓存失效，则返回200和请求结果。

协商缓存设置的 HTTP Header 主要有两种形式，ETag 和 Last-Modified。

- Last-Modified 和 If-Modified-Since

当浏览器第一次请求资源的时候，服务端返回数据的同时会在响应头上增加一个 Last-Modified 字段，浏览器接收到响应后，会将当前的 Last-Modified 以及响应数据缓存起来，当再次发起请求时，浏览器会在请求头中增加一个 If-Modified-Since，即缓存的 Last-Modified，服务端收到请求后，会将文件的最后更改时间与 If-Modified-Since 进行对比，如果If-Modified-Since 早于当前文件修改的时间，就说明文件有修改，返回200和新的资源数据。如果 If-Modified-Since 和文件的修改时间没有变化，就返回304和空的响应头，直接从缓存读取。

- ETag 和 If-None-Match

Etag是服务端生成的一个资源唯一标识，当浏览器第一次请求资源当时候，服务端返回数据当同时会在响应头上增加一个 ETags 标识，当资源发生变化，这个 ETags 也会重新生成。当下一次发起请求的时候，浏览器会将缓存的 ETags 放到请求头中的 If-none-Match 字段中，服务端接收到请求后，跟将当前资源的 ETags 与浏览器传过来的 If-none-Match 的值进行对比，如果一样，则表示资源没有发生变化，返回304和空响应头，告诉浏览器从缓存中读取，当两个值不一样的时候，就说明资源有变动，返回200和新的资源数据。

- 两者对比

从精准度上来说，ETag 会优于 Last-Modified，当一个资源在短时间能更改多次，如果是 Last-Modified 其实并不一定会体现出修改来，而 ETag 的话，资源每次更改都会更新 ETag，从而确保了精度，如果是负载均衡的服务器，可能各个服务器生成的 Last-Modified 会不一样。

从性能上来说，Last-Modified 只是简单的生成一个时间，而 ETag 需要根据当前资源生成一个唯一标识，性能上 Last-Modified 优于 ETags 。

从优先级上来说，服务器对于 ETag 的优先级会高于 Last-Modified 。

## 一、渲染优化

### 浏览器渲染页面的整个过程

- 第一步，构建 DOM 树，从上到下解析 HTML 文档生成 DOM 节点树。
- 第二步、构建 CSSOM 树，加载解析样式生成 CSSOM 树。
- 第三步、执行 Javascript ，加载并执行 Javascript 代码，包含内联和外联的 Javascript 文件
- 第四步、构建渲染树、根据 DOM 树和 CSSOM 树，生成渲染树。
- 第五步、布局，可以称之为回流，通过渲染树中渲染对象的信息，计算出每一个渲染对象的位置和尺寸。
- 第六步、绘制，遍历渲染树绘制所有节点，为每个节点适用对应的样式，并调用呈现器的“paint”方法，将呈现器的内容显示在屏幕上。

### 注意点

Javascript 执行会阻塞渲染，这是因为对于浏览器来说，Javascript 执行线程和渲染线程是互斥的，为什么要这么设计呢，因为大家都知道 Javascript 也可以操作 DOM，当我们操作 DOM 与渲染 DOM 同时进行的话，整个流程就乱了。正是因为 Javascript 会阻塞渲染进程，所以一般都建议将 Javascript 脚本放到底部执行。

Javasript 文件不只是阻塞 DOM 的构建，它会导致 CSSOM 也阻塞DOM的构建。这是因为 JavaScript 不只是可以改 DOM ，它还可以更改样式，也就是它可以更改 CSSOM 。因为不完整的  CSSOM 是无法使用的，如果 JavaScript 想访问 CSSOM 并更改它，那么在执行 JavaScript 时，必须要能拿到完整的 CSSOM 。所以就导致了一个现象，如果浏览器尚未完成 CSSOM 的下载和构建，而我们却想在此时运行脚本，那么浏览器将延迟脚本执行和 DOM 构建，直至其完成 CSSOM 的下载和构建。也就是说，在这种情况下，浏览器会先下载和构建 CSSOM ，然后再执行 JavaScript ，最后在继续构建 DOM 。

### 优化点

- DOM 层级尽量不要太深
- 样式最好使用 class id ，层次尽量简单
- js 脚本尽量后放，或者使用 async 或 defer
- 减少使用 js 修改样式，尽量使用修改 class 的方式