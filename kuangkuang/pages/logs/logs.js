//logs.js
var Charts = require('../wxcharts.js');
Page({
  data: {
     plan : [],
     RoomName: [],
      totalDay: [],
      takeDay: [],
      needPay: [],
      availableCredit: [],
      startTime: [],
      endTime: [],
  },
  onLoad: function () {
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    var tableID = 31660;
    let query = new wx.BaaS.Query()
    console.log(uid)
    // 设置查询条件（比较、字符串包含、组合等）
    query.compare('created_by', '=', uid)
    let User = new wx.BaaS.TableObject(tableID)
    var plan1 = []
    var RoomName1= []
    var totalDay1= []
    var takeDay1= []
    var needPay1= []
    var availableCredit1= []
    var startTime1= []
    var endTime1= []
    User.setQuery(query).find().then(res => {
      console.log(res.data)
      if (res.data.objects[0].Log.length == 0){
        wx.showModal({
          title: '提示',
          content: '您还没有任何历史记录，快去和小伙伴一起打卡吧。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../index/test'
              })
            }
          }
        })
      }else{
        console.log(res.data)
        for (var i = 0; i < res.data.objects[0].Log.length; i++) {
          plan1 = res.data.objects[0].Log[i].split('&')
          console.log(plan1)
          RoomName1.push(plan1[0])
          totalDay1.push(parseInt(plan1[1]))
          takeDay1.push(parseInt(plan1[2]))
          needPay1.push(Number(plan1[3]))
          availableCredit1.push(Number(plan1[4]))
          startTime1.push(plan1[5])
          endTime1.push(plan1[6])
        }
        console.log(RoomName1)
        console.log(totalDay1)
        console.log(takeDay1)
        console.log(needPay1)
        console.log(availableCredit1)
        console.log(startTime1)
        console.log(endTime1)
        this.setData({
          plan: plan1,
          RoomName: RoomName1,
          totalDay: totalDay1,
          takeDay1: takeDay1,
          needPay: needPay1,
          availableCredit: availableCredit1,
          startTime: startTime1,
          endTime: endTime1
        })
        //==============================圆饼图=======================//
        var total = 0;
        var take = 0;
        var non = 0;
        for (var i = 0; i < totalDay1.length; i++) {
          total += totalDay1[i]
          take += takeDay1[i]
        }
        non = total - take;
        console.log(total)
        new Charts({
          canvasId: 'pieCanvas',
          type: 'ring',
          series: [{
            name: '未打卡天数',
            data: non,
          }, {
            name: '打卡天数',
            data: take,
          }],
          width: 320,
          height: 200,
          dataLabel: true
        })
        //==============================================//
        //==========================折线图========================//
        var row = []
        var need = []
        var avail = []
        if (RoomName1.length > 6) {
          for (var i = RoomName1.length - 6; i < RoomName1.length; i++) {
            row.push(RoomName1[i])
            need.push(needPay1[i])
            avail.push(availableCredit1[i])
          }

        } else {
          row = RoomName1;
          need = needPay1
          avail = availableCredit1
        }
        new Charts({
          canvasId: 'pieCanvas1',
          type: 'line',
          categories: row,
          series: [{
            name: '投入资金',
            data: need,
            format: function (val) {
              return val.toFixed(2);
            }
          }, {
            name: '获得金额',
            data: avail,
            format: function (val) {
              return val.toFixed(2);
            }
          }],
          yAxis: {
            title: '',
            format: function (val) {
              return val.toFixed(2);
            },
            min: 0
          },
          width: 320,
          height: 200
        });
      }
      
    })

  },
  displayAll: function(){
    wx.navigateTo({
      url: '../logAll/logAll'
    })
  }
})

