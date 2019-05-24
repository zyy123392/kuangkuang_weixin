Page({

  /**
   * 页面的初始数据
   */
  data: {
    projects: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var uid = wx.BaaS.storage.get('uid')
    /*****************迭代用户计划列表 *******************/
    //在ProjectOfUser中查询
    var tableID = 32680;
    let query1 = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query1.compare('created_by', '=', uid)

    // 应用查询对象
    let Project = new wx.BaaS.TableObject(tableID)
    Project.setQuery(query1).find().then(res => {
      // success
      console.log(res.data)
      var that = this;
      var plength = res.data.objects.length;
      var j = 0;
      for (var i = 0; i < res.data.objects.length; i++) {
        var tableID1 = 32518;
        let query2 = new wx.BaaS.Query()
        // 设置查询条件（比较、字符串包含、组合等）
        query2.contains('RoomID', res.data.objects[i].RoomID)
        console.log(i)
        // 应用查询对象
        let Room = new wx.BaaS.TableObject(tableID1);


        Room.setQuery(query2).find().then(res1 => {
          // success

          if (j < plength) {
            var param = {};
            var string = "projects[" + j + "].ID";
            param[string] = res1.data.objects[0].RoomID;
            that.setData(param);       //

            var string = "projects[" + j + "].RoomName";
            param[string] = res1.data.objects[0].RoomName;
            that.setData(param);       //
            j++;
          }

          console.log(res1.data)                           //                                //
        }, err => {
          // err
          console.log("gg")
        })
      }

      console.log(that.data.projects);
    }, err => {
      // err
      console.log("gg")
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