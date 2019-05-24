Page({

  /**
   * 页面的初始数据
   */
  data: {
    log:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    var tableID = 31660;
    let query = new wx.BaaS.Query()
    console.log(uid)
    // 设置查询条件（比较、字符串包含、组合等）
    query.compare('created_by', '=', uid)
    let User = new wx.BaaS.TableObject(tableID)
    var plan1 = []
    var RoomName1 = []
    var totalDay1 = []
    var takeDay1 = []
    var needPay1 = []
    var availableCredit1 = []
    var startTime1 = []
    var endTime1 = []
    User.setQuery(query).find().then(res => {
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
      var that = this;
      for(var i = 0;i<RoomName1.length;i++){
        var param = {};
        var string = "log[" + i + "].RoomName";
        param[string] = RoomName1[i];
        that.setData(param);       //

        var string = "log[" + i + "].totalDay";
        param[string] = totalDay1[i];
        that.setData(param);       //

        var string = "log[" + i + "].takeDay";
        param[string] = takeDay1[i];
        that.setData(param);       //
        
        var string = "log[" + i + "].needPay";
        param[string] = needPay1[i];
        that.setData(param);       //
        var result = availableCredit1[i] - needPay1[i]
        var res;
        if (result > 0){
          res = "赚取了" + result+"。"
        } else if (result < 0){
          res = "亏损了" + (-result) + "。"
        }else{
          res = "没有盈亏。"
        }
        var string = "log[" + i + "].availableCredit";
        param[string] = res;
        that.setData(param);       //

        var string = "log[" + i + "].startTime";
        param[string] = startTime1[i];
        that.setData(param);       //

        var string = "log[" + i + "].endTime";
        param[string] = endTime1[i];
        that.setData(param);       //

      }

      console.log(log)
    })
  },

})