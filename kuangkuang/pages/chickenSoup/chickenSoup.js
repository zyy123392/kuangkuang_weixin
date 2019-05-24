// pages/chickenSoup/chickenSoup.js
let wxParser = require('../../wxParser/index');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
   picture:'',
   content:'',
   time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var myDate = new Date();
    var TheTime = myDate.getFullYear() + "年" + (myDate.getMonth() + 1) + "月" + myDate.getDate() + "日";
    this.setData({
      time : TheTime
    })
    var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
    console.log(str);
    let MyContentGroup = new wx.BaaS.ContentGroup(1532498958042830)
    let query = new wx.BaaS.Query()
    query.contains('description', str)
    MyContentGroup.setQuery(query).find().then(res => {
      // success
      MyContentGroup.getContent(res.data.objects[0].id).then(res => {
        // success
        console.log(res.data.content)
        this.setData({
          picture: res.data.cover,
          content: res.data.content
        })
        let html = res.data.content;
       var that = this;
        wxParser.parse({
          bind: 'richText',
          html: html,
          target: that,
        });
        console.log()
      }, err => {
        // err
      })
    }, err => {
      // err
    })

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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
  
  }
})