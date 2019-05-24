//app.js
App({
  onLaunch: function () {
    // 引入 SDK
    require('./sdk-v1.5.0')

    // 初始化 SDK
    let clientID = 'b7e79c71ad124d75041f'
    wx.BaaS.init(clientID)

    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    
    // 登录
    wx.BaaS.login(false).then(res => {
      // 登录成功
    }, res => {
      // 登录失败
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
 
  },
  globalData: {
    userInfo: null,
    uid:null
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.personInfo) {
      typeof cb == "function" && cb(this.globalData.personInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.personInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.personInfo)
            }
          })
        }
      })
    }
  }
})