// pages/detail_info/contect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: ['https://cloud-minapp-13144.cloud.ifanrusercontent.com/1fYvGLQelBHjZGTd.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  previewImage: function (e) {

    wx.previewImage({
 
      urls: this.data.scene,
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  }
})