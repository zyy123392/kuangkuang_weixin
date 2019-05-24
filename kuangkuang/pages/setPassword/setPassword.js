// pages/setPassword/setPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    confirmPassword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  bindPasswordChange: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  confirmChange: function (e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },
  confirm: function(){
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    if (this.data.password == this.data.confirmPassword && this.data.password !=''){
     var tableIDm = 31660;
     let querym = new wx.BaaS.Query()

     // 设置查询条件（比较、字符串包含、组合等）
     querym.compare('created_by', '=', uid)
     let User = new wx.BaaS.TableObject(tableIDm)
     console.log("fsdds")
     User.setQuery(querym).find().then(res => {
       // success
       console.log(res.data)
       var recordIDm = res.data.objects[0].id;
       let user = User.getWithoutData(recordIDm)
       user.set('password', this.data.password)
       user.update().then(res => {
         // success
         wx.showModal({
           title: '提示',
           content: '密码修改成功！',
           showCancel: false,
           success: function (res) {
             if (res.confirm) {
               wx.reLaunch({
                 url: '../index/index'
               })
           }
          }
         })
       }, err => {
         // err
       });

     })
    } else if (this.data.password == ''){
      wx.showModal({
        title: '提示',
        content: '密码不得为空。',
        showCancel: false,
      })
     }else{
     wx.showModal({
       title: '提示',
       content: '您前后的密码不一致，请重新输入',
       showCancel: false,
     })
   }
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
  
  }
})