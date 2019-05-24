//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "98rpx",//输入框高度
      width: "604rpx",//输入框宽度
      see: true,//是否明文展示
      interval: true,//是否显示间隔格子
    }
  },

  // 当组件输入数字6位数时的自定义函数
  valueSix() {
   
    // 模态交互效果
    
    
  },

  onload: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
    var uid;
    wx.BaaS.login(false).then(res => {
      // 登录成功
      uid = res.id;
      var tableID = 31660;
      let query = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query.compare('created_by', '=', uid)
      let User = new wx.BaaS.TableObject(tableID)
      User.setQuery(query).find().then(res => {
        // success
        console.log(res.data)
        if (res.data.objects.length == 0) {
          if (!app.globalData.userInfo) {
            wx.showModal({
              title: '提示',
              content: '请先登录。登录后请下拉刷新。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index'
                  })
                }
              }
            })
          }
        }
      })
    })
  }

})
