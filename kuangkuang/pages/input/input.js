import creat_input from "../../utils/creat_input.js"
Page({
  data: {
    RoomID: "",
    RoomName: "",
    NeedPay: "",
    date: "2016-09-01",
    time: "",
    rule: "",
    RoomCanExit: {},
    today:{},
    RoomModel: 1

  },
  onLoad: function (options) {
    var today = new Date();
    var month = today.getMonth() + 1;
    var dat = today.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (dat >= 1 && dat <= 9) {
      dat = "0" + dat;
    }
    this.data.date = today.getFullYear() + "-" + month + "-" + dat;
    var hour = today.getHours();
    var minutes = today.getMinutes();
    if (hour >= 1 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 1 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    this.data.time = hour + ":" + minutes
    var tableID = 32518;
    let query1 = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query1.contains('RoomID', options.str)
    // 应用查询对象
    let Room = new wx.BaaS.TableObject(tableID)
    Room.setQuery(query1).find().then(res => {
      if (res.data.objects.length == 0){
        this.setData({
          RoomID: options.str,
          date: this.data.date,
          time:this.data.time
        })
      }else{
        wx.navigateTo({
          url: '../input/fail1'
        })
      }
    })
   
    

  },
  bindTitleChange: function (e) {
    this.setData({
      RoomName: e.detail.value
    })

  },
  bindPayChange: function (e) {
    this.setData({
      NeedPay: e.detail.value
    })

  },
  bindRuleChange: function (e) {
    this.setData({
      rule: e.detail.value
    })

  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCanExitChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      RoomCanExit: e.detail.value
    })
  },

  showTopTips: function () {
    if (this.data.RoomName == ""){
      wx.showModal({
        title: '提示',
        content: '房间名不得为空',

        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (this.data.NeedPay == ""){
      wx.showModal({
        title: '提示',
        content: '请填写金额',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }else if (this.data.time == "") {
      wx.showModal({
        title: '提示',
        content: '请填写时间',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (parseInt(this.data.NeedPay) < 1 || parseInt(this.data.NeedPay) > 100) {
      wx.showModal({
        title: '提示',
        content: '金额超出范围',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else{
      console.log(parseInt(this.data.NeedPay))
      creat_input.addRoom(this)
      creat_input.addprojectofuserInfo(this)
      wx.reLaunch({
        url: '../index/index'
      }),
        wx.showToast({
          title: '已创建',
          icon: 'success',
          duration: 3000
        })
    }
   
  },
})