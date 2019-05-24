const app = getApp();

Page({
  data: {
    src: "",

  },
  joinRoom: function () {
    wx.navigateTo({
      url: '../join_input/join_input'
    })
  },
  createRoom: function () {
    wx.navigateTo({
      url: '../creat_input/creat_input'
    })
  },
  onLoad: function (){
    
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    /**********添加用户到User****************/
    var tableID = 31660;
    let query = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query.compare('created_by', '=', uid)
    let User = new wx.BaaS.TableObject(tableID)
    User.setQuery(query).find().then(res => {
      // success
      if (res.data.objects[0].name != app.globalData.userInfo.nickName) {
        var recordIDr = res.data.objects[0].id;
        let user = User.getWithoutData(recordIDr)
        user.set('name', app.globalData.userInfo.nickName)
        user.update();
        console.log("昵称")

      } else if (res.data.objects[0].avatar != app.globalData.userInfo.avatarUrl){
        var recordIDr = res.data.objects[0].id;
        let user = User.getWithoutData(recordIDr)
        user.set('avatar', app.globalData.userInfo.avatarUrl)
        user.update();
        console.log("头像")

      }
        

    }, err => {
      // err
      console.log("gg")
    })
    /********************/
  },
 
 
})