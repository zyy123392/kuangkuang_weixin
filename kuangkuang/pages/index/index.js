//index.js
//获取应用实例
var app = getApp()
var a = [];
var b = [];
Page({
  data: {
    credit:{},
    name: 'ff',
    userInfo: {},
    projects: [],
    RoomID : [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userPwd: "",
    projects: [],
    showView: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goset: function () {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },
  bindViewTap1: function () {
    wx.navigateTo({
      url: '../planList/planList'
    })
  },
  onLoad: function () {
    var status = wx.getStorageSync('status')
    console.log(status)
    if (status == false){
      wx.setStorageSync('status', true)
      wx.navigateTo({
        url: '/pages/welcome/welcome'
      })
    }
    this.setData({
      showView :false
    })
    console.log(this.data.showView)
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
      if (res.data.objects.length == 0){
        this.setData({
          showView : true,
        })
      }
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

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true

          })

        }
      })
    }
    /**********添加用户到User****************/
    var uid;
    wx.BaaS.login(false).then(res => {
      // 登录成功
      uid = res.id;
      var tableID = 31660;
      let query = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query.compare('created_by', '=', uid)
      let User = new wx.BaaS.TableObject(tableID)
      User.setQuery(query).find().then(res => {
        // success
        console.log(res.data)
        if (res.data.objects.length == 0) {
          this.setData({
            credit: 1000
          })
          if (!app.globalData.userInfo) {

          } else {
            var that = this;
            wx.showModal({
              title: '划重点！！！！！！',
              content: '许多用户在初次使用本软件可能会摸不着头脑，本打卡软件的机制是相互打卡，即不是你自己为自己打卡，而是完成任务后你的参加此计划的其他用户帮你打卡，也就是说房间里只有一个人是无法完成打卡的。并且只有房间里一半人以上为你打卡才算你今天打卡成功哦。快来邀请你的好友一起打卡吧。ˇ▽ˇ',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.showDialogBtn();
                }
                let users = User.create()
                let user = {
                  name: app.globalData.userInfo.nickName,
                  avatar: app.globalData.userInfo.avatarUrl,
                  credit: 1000,
                  Log:[]
                }
                users.set(user).save()
              }

            })
          }



        } else {
          this.setData({
            credit: res.data.objects[0].credit
          })
        }

      }, err => {
        // err
        console.log("gg")
      })
    }, res => {
      // 登录失败
    })

    uid = wx.BaaS.storage.get('uid')
    /********************/
  
  },
  showList: function (e) {

    wx.navigateTo({
      url: '../detail_info/detail_info?RoomID=' + e.currentTarget.dataset.allid
    })
  },
  onShow: function () {
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    var tableID = 31660;
    let query = new wx.BaaS.Query()
    // 设置查询条件（比较、字符串包含、组合等）
    query.compare('created_by', '=', uid)
    let User = new wx.BaaS.TableObject(tableID)
    User.setQuery(query).find().then(res => {
      if (res.data.objects.length == 0) {
        var that = this;
        if (!app.globalData.userInfo) {

        } else {
        wx.showModal({
          title: '哐哐打卡用户协议',
          content: '在使用本软件的所有功能之前，请您务必仔细阅读并透彻理解本协议。\r\n一.“奖励金”分配机制：“奖池”中资金的数额是本计划所有参与者投入的资金总和，您获得的“奖励金”数额由您完成打卡数量在所有参与者完成打卡数量的占比决定。如果您的完成打卡情况少于打卡计划的10%（若打卡计划的10%不足1天则取1天），则系统扣除您10%的“奖励金”数额。\r\n二.惩罚机制：创建涉及“黄赌毒”内容计划的使用者: 永久封禁该用户的“哐哐打卡”账号，并向微信举报与该账号绑定的微信账号。 恶意拒绝为其他参与者完成打卡 :一经核实，将该账号本次计划的投入资金50%扣除，剩余资金平分给其他参与者。累计三次，永久封禁该账号。通过各种途径对其他参与者进行人身攻击 :一经核实，将该账号本次计划的投入资金50%扣除，剩余资金平分给其他参与者。累计三次，永久封禁该账号。 利用平台进行不正当行为（包括打赌等）:一经发现，立马删除计划，对计划参与者进行警告。累计三次，永久封禁该账号。其他恶意行为 :根据情况决定采取删除计划、警告、短期封禁帐号、永久封禁帐号等惩罚措施。\r\n 三.免责声明：如果因用户本身使用问题出现资金损失等不良后果，本软件不承担任何法律责任。最终解释权归“哐哐打卡”工作室所有。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.showDialogBtn();
            }
            let users = User.create()
            let user = {
              name: app.globalData.userInfo.nickName,
              avatar: app.globalData.userInfo.avatarUrl,
              credit: 1000,
              Log: []
            }
            users.set(user).save()
          }

        })
        }
      }
      this.setData({
        credit: res.data.objects[0].credit
      })
    })
  },
  test : function(e){
    wx.navigateTo({
      url: '../index/1'
    })
  },
  getUserInfo: function(e) {
    var that = this;
    wx.BaaS.handleUserInfo(e).then(res => {
      // res 包含用户完整信息，详见下方描述
      console.log('登录成功！')
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
      that.onLoad();
    }, res => {

    })

  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  //---------------------自定义模态框----------------------//
  inputChange: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  onCancel: function () {
    this.hideModal();
  },
  onConfirm: function (e) {
    if (this.data.userPwd == ""){
      wx.showModal({
        title: '提示',
        content: '密码不能为空，此密码在以后在您打卡时，很重要请认真填写。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {}
        }
        })
    }else{
      var usertableID = 31660;
      var uid = parseInt(wx.BaaS.storage.get('uid'))
      let query1 = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query1.compare('created_by', '=', uid)
      console.log(this.data.userPwd);
      // 应用查询对象
      let User = new wx.BaaS.TableObject(usertableID)
      User.setQuery(query1).find().then(res => {
        console.log(this.data.userPwd);
        console.log(res.data);
        var recordIDu = res.data.objects[0].id;
        let user = User.getWithoutData(recordIDu)
        user.set('password', this.data.userPwd)
        user.update();
      })
      this.hideModal();
    }
    
  },
  joinRoom: function () {
    var uid;
    wx.BaaS.login(false).then(res => {
      // 登录成功
      uid = res.id;
      var tableID = 31660;
      let query = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query.compare('created_by', '=', uid)
      let User = new wx.BaaS.TableObject(tableID)
      User.setQuery(query).find().then(res => {
        // success
        console.log(res.data)
        if (res.data.objects.length == 0) {
          if (!app.globalData.userInfo) {
            wx.showModal({
              title: '提示',
              content: '请先登录。登录后请下拉刷新。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          }
        } else {
          wx.navigateTo({
            url: '../join_input/join_input'
          })
        }
      })
    })
   
  },
  createRoom: function () {
    var uid;
    wx.BaaS.login(false).then(res => {
      // 登录成功
      uid = res.id;
      var tableID = 31660;
      let query = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query.compare('created_by', '=', uid)
      let User = new wx.BaaS.TableObject(tableID)
      User.setQuery(query).find().then(res => {
        // success
        console.log(res.data)
        if (res.data.objects.length == 0) {
          if (!app.globalData.userInfo) {
            wx.showModal({
              title: '提示',
              content: '请先登录。登录后请下拉刷新。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          }
        } else {
          wx.navigateTo({
            url: '../creat_input/creat_input'
          })
        }
      })
    })
   
  },
  //----------------------------------------//
})

