Page({
  backHome: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  reload: function () {
    wx.navigateTo({
      url: '../join_input/join_input'
    })
  }
});