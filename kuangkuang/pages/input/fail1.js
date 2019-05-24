
Page({
  backHome: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  reload: function () {
    wx.navigateTo({
      url: '../creat_input/creat_input'
    })
  }
});