// 心跳检测机制-->如果设备网络断开，不会立刻触发websocket的任何事件
/**
 * 需要一直调用websocket.send()方法, 才会触发websocket.onclose事件
 */
export default {
  ws: null,
  isConnect: null, // 是否在重新连接
  timeout: 10 * 1000, // 间隔10s心跳检测
  timeoutObj: null,
  serverTimeout: 5000, // 服务器超时
  serverTimeoutObj: null,
  reset: function () {
    this.timeoutObj && clearInterval(this.timeoutObj)
    this.serverTimeoutObj && clearInterval(this.serverTimeoutObj)
    this.start()
  },
  start: function () {
    let _this = this
    _this.timeoutObj = setTimeout(() => { // 每x秒发送一次
      _this.ws.send('heartBeat')
      _this.serverTimeoutObj = setTimeout(() => { // 服务器间隔5000没有响应的话主动触发onclose
        // 执行ws.close()会触发onclose
        _this.ws.close()
      }, _this.serverTimeout)
    }, _this.timeout)
  },
  createSocket: function (url) {
    this.ws = new WebSocket(url)
    this.ws.onclose = this.onclose
    this.ws.onerror = this.onerror
    this.ws.onopen = this.onopen
    this.ws.onmessage = this.onmessage
  },
  onclose: function (e) { // 连接关闭
    // 重新连接
    console.log(e)
    if (e.reason === 'destroy') return
    this.reconnect()
  },
  onerror: function () { // 发生异常
    // 重新连接
    this.reconnect()
  },
  onopen: function () { // 连接开始
    // 心跳检测重置
    this.reset()
  },
  onmessage: function (data) { // 收到服务器信息
    // 接受到服务器任何信息 说明连接没有断开,ws重新开启心跳检测
    this.reset()
  },
  reconnect () {
    let that = this
    // 设置节流,避免重连请求重复
    if (this.isConnect) return
    this.isConnect = setTimeout(() => {
      that.createSocket()
      clearTimeout(that.isConnect)
      that.isConnect = null
    }, 4000)
  }
}
