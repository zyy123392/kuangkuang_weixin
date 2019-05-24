import creat_input from "../../utils/creat_input.js"
var app = getApp()
var util = require('../../utils/util.js')
var ID;
var dt;

var endTime;
var roomid;
Page({
  data: {
    RoomID: {},
    RoomName: {},
    userInfo: {},
    friendsUrl: {},
    RoomMemberName: [{}],
    RoomRule: {},
    RoomStartTime: {},
    RoomEndTime: {},
    availableCredit: {},
    RoomAward: {},
    RoomModel: {},
    RoomCanExsit: false,
    register: {},
    totalDay: {},
    takeDay: {},
    goDay: {},
    friendList: [],
    allList: [],
    friendregister: {},
    disabled: false,
    pay: {},
    totalRE: {},
    userPwd: "",
    showView: {},
    available: false,
    availableCondition: '禁止其它用户进入',
    uidList: [],
    showView1: false,
    /*--------------------------------------*/
    isfingerPrint: false,    //可否使用指纹识别  默认false
    showModal: false,
  },

  onLoad: function (options) {
    //-------------------------------------------------//
    var that = this
    //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        for (var i in res.supportMode) {
          if (res.supportMode[i] == 'fingerPrint') {
            console.log("支持指纹识别", res.supportMode[i]);
            that.setData({
              isfingerPrint: true
            })
          } else {
            that.setData({
              isfingerPrint: false
            })
          }
        }
      }
    })

    //---------------在ProjectOfUserInfo中查询---------------------------//
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    this.setData({
      RoomID: options.RoomID,
    })
    roomid = options.RoomID;
    let tableID = 32680;
    let query = new wx.BaaS.Query()
    let query4 = new wx.BaaS.Query()
    console.log(this.data.RoomID)
    // 设置查询条件（比较、字符串包含、组合等）
    query.contains('RoomID', this.data.RoomID)
    query4.compare('created_by', '=', uid)
    let andQuery = wx.BaaS.Query.and(query, query4)
    // 应用查询对象
    let ProjectOfUserInfo = new wx.BaaS.TableObject(tableID)
    ProjectOfUserInfo.setQuery(andQuery).find().then(res => {
      // success
      var recordIDp = res.data.objects[0].id;
      var lenth = res.data.objects[0].register.length;
      this.setData({
        register: res.data.objects[0].register
      })

      console.log(res.data.objects[0].dakaInfo)

      var a = 0; //接收打卡天数



      for (var i = 0; i < lenth; i++) {
        if (this.data.register[i]) {
          a++;
        }
      }
      //---------------------房间模式---------------//
      var c = res.data.objects[0].RoomModel;



      if (c == 0) {
        this.setData({
          RoomModel: "一次性",

        })
      } else {
        this.setData({
          RoomModel: "打卡模式",
        })
      }
      //---------------在Room中查询------------------------//
      tableID = 32518;
      let query1 = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query1.contains('RoomID', this.data.RoomID)
      // 应用查询对象
      let Room = new wx.BaaS.TableObject(tableID)
      Room.setQuery(query1).find().then(res => {
        // success
        console.log(res.data)
        if (res.data.objects[0].created_by == uid) {
          that.setData({
            showView: true,
          })
        }
        if (res.data.objects[0].roomAvailable == false) {
          this.setData({
            available: true,
            availableCondition: '已禁止'
          })
        }

        //-------------------------------money-------------------------//
        var length = res.data.objects[0].RoomMemberName.length
        this.data.pay = res.data.objects[0].RoomNeedPay
        this.data.RoomAward = res.data.objects[0].RoomAward
        this.data.totalRE = res.data.objects[0].TotalRegister
        console.log(a)
        console.log(this.data.totalRE)
        console.log(this.data.RoomAward)
        if (this.data.totalRE == 0) {
          this.data.availableCredit = this.data.pay
        } else {
          this.data.availableCredit = Number(((a / this.data.totalRE) * this.data.RoomAward).toFixed(2))
        }
        console.log(this.data.availableCredit)
        let tableID6 = 32680;
        let query7 = new wx.BaaS.Query()
        let query8 = new wx.BaaS.Query()
        // 设置查询条件（比较、字符串包含、组合等）
        query7.contains('RoomID', this.data.RoomID)
        query8.compare('created_by', '=', uid)
        let andQuery2 = wx.BaaS.Query.and(query7, query8)
        let ProjectOfUserInfo2 = new wx.BaaS.TableObject(tableID6)
        ProjectOfUserInfo2.setQuery(andQuery2).find().then(res => {
          var recordIDr = res.data.objects[0].id;
          let pro = ProjectOfUserInfo2.getWithoutData(recordIDr)
          pro.set('availableCredit', this.data.availableCredit)
          pro.update();
        })
        //--------------------------------------------------------------//
        endTime = res.data.objects[0].RoomEndTime;
        this.setData({
          RoomCanExsit: res.data.objects[0].RoomCanExsit,
          RoomAward: res.data.objects[0].RoomAward,
          RoomID: res.data.objects[0].RoomID,
          RoomRule: res.data.objects[0].RoomRule,
          RoomStartTime: res.data.objects[0].RoomStartTime,
          RoomEndTime: res.data.objects[0].RoomEndTime,
          availableCredit: this.data.availableCredit,
          RoomMemberName: res.data.objects[0].RoomMemberName,
          uidList: res.data.objects[0].uidList,
          RoomName: res.data.objects[0].RoomName
        })
        //----------------- 结束----------------------//
        var myDate = new Date();
        var TheTime = myDate.getFullYear() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + "00";
        var f = endTime + ":" + "00";
        var s = f.replace(/\-/g, "/");
        var e_1 = new Date(s).getTime();
        var e_2 = new Date(TheTime).getTime();

        if (e_2 >= e_1) {
          let UsersT = 31660;
          let queryLog = new wx.BaaS.Query()
          queryLog.compare('created_by', '=', uid)
          let Users = new wx.BaaS.TableObject(UsersT)
          Users.setQuery(queryLog).find().then(res => {
            var logid = res.data.objects[0].id;
            let userlog = Users.getWithoutData(logid)
            var log = this.data.RoomName + '&' + this.data.totalDay + '&' + this.data.takeDay + '&' + this.data.pay + '&' + this.data.availableCredit + '&' + this.data.RoomStartTime + '&' + this.data.RoomEndTime;
            console.log(log)
            userlog.append('Log', log)
            userlog.update();
          })

          var removeTable = 32680;
          let query10 = new wx.BaaS.Query()
          let query11 = new wx.BaaS.Query()
          // 设置查询条件（比较、字符串包含、组合等）
          query10.contains('RoomID', this.data.RoomID)
          query11.compare('created_by', '=', uid)
          let andQuery1 = wx.BaaS.Query.and(query10, query11)
          let ProjectOfUserInfo4 = new wx.BaaS.TableObject(removeTable)
          var m;           //可得金额
          ProjectOfUserInfo4.setQuery(andQuery1).find().then(res => {
            console.log(res.data)
            var recordIDp = res.data.objects[0].id;
            m = res.data.objects[0].availableCredit
            console.log(m);
            ProjectOfUserInfo4.delete(recordIDp).then(res => {
              // success
              wx.showModal({
                title: '提示',
                content: '此次打赌结束，您获得' + this.data.availableCredit,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    var tableIDm = 31660;
                    let querym = new wx.BaaS.Query()

                    // 设置查询条件（比较、字符串包含、组合等）
                    querym.compare('created_by', '=', uid)
                    let User = new wx.BaaS.TableObject(tableIDm)
                    User.setQuery(querym).find().then(res => {
                      // success
                      console.log(res.data)
                      var recordIDm = res.data.objects[0].id;
                      let user = User.getWithoutData(recordIDm)
                      var credit = res.data.objects[0].credit
                      console.log(m)
                      console.log(credit)
                      user.set('credit', credit + that.data.availableCredit)
                      user.update();


                    }, err => {
                      // err
                      console.log("gg")
                    })
                    var rtid = 32518;
                    let query12 = new wx.BaaS.Query()
                    let Room12 = new wx.BaaS.TableObject(rtid)
                    query12.contains('RoomID', that.data.RoomID)
                    Room12.setQuery(query12).find().then(res => {
                      var recordIDr = res.data.objects[0].id;
                      let room12 = Room12.getWithoutData(recordIDr)
                      room12.remove('uidList', uid)
                      room12.update();
                      var length2 = res.data.objects[0].uidList.length - 1
                      console.log(length2)
                      if (length2 == 0) {
                        Room12.delete(recordIDr).then(res => { })
                      }
                    })


                    wx.reLaunch({
                      url: '../index/index'
                    })
                  }
                }
              })
            }, err => {
              // err
            })
          })

        }


        //-------------------------------------------------------------//
        console.log(this.data.uidList)
        var j = 0
        for (var i = 0; i < this.data.uidList.length; i++) {
          if (this.data.uidList.length - 1 == 0){
            this.setData({
              showView1: true,
            })
          }
          var tableID21 = 31660;
          let query22 = new wx.BaaS.Query()
          let User23 = new wx.BaaS.TableObject(tableID21)
          query22.compare('created_by', '=', this.data.uidList[i])
          User23.setQuery(query22).find().then(res => {
            // success
            console.log(res.data)
            if (res.data.objects[0].created_by != uid) {
              var param = {};
              var string = "friendList[" + j + "].name";
              param[string] = res.data.objects[0].name;
              this.setData(param);       //

              var string = "friendList[" + j + "].avatar";
              param[string] = res.data.objects[0].avatar;

              this.setData(param);       //

              var string = "friendList[" + j + "].id";
              param[string] = res.data.objects[0].created_by;

              this.setData(param);       //
              j++;
              var params = {};
              var string = "allList[" + j + "].name";
              params[string] = res.data.objects[0].name;
              this.setData(params);       //

              var string = "allList[" + j + "].avatar";
              params[string] = res.data.objects[0].avatar;
              this.setData(params);       //

              var string = "allList[" + j + "].id";
              params[string] = res.data.objects[0].created_by;
              this.setData(params);       //
            }
          }, err => {
            // err
            console.log("gg")
          })
        }
        var me = [{
          name: app.globalData.userInfo.nickName,
          avatar: app.globalData.userInfo.avatarUrl,
          id: uid
        }]
        this.data.allList = this.data.allList.concat(me)
        this.setData({
          allList: this.data.allList
        })

        // -------计算时间-----//
        if (c == 0) {
          this.setData({
            totalDay: 1,
          })
        } else {
          creat_input.countdate(this.data.RoomStartTime, this.data.RoomEndTime, this)
        }
        let projectOfUserInfo = ProjectOfUserInfo.getWithoutData(recordIDp)
        if (this.data.RoomModel == "打卡模式") {
          for (var i = 0; i < this.data.totalDay && lenth < this.data.totalDay; i++) {
            projectOfUserInfo.append('register', [false])
            projectOfUserInfo.update();
          }
        } else {
          if ((!this.data.register[0]) && lenth != 1) {
            projectOfUserInfo.append('register', false)
            projectOfUserInfo.update();
          }
        }
      }, err => {
        // err
        console.log("gg")
      })

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        friendsUrl: app.globalData.userInfo.avatarUrl,
        takeDay: a,
        loadingHidden: true
      })

    }, err => {
      // err
    })
    var tableid = 32680;
    var Product = new wx.BaaS.TableObject(tableid)

    let query19 = new wx.BaaS.Query();
    // 设置查询条件（比较、字符串包含、组合等）
    query19.contains('RoomID', this.data.RoomID);
    var query43 = new wx.BaaS.Query()
    query43.compare('availableCredit', '>=', 0)
    let andQuery4 = wx.BaaS.Query.and(query43, query19);
    Product.setQuery(andQuery4).orderBy('-availableCredit').find().then(res => {
      console.log(res.data)

      console.log(this.data.rangeList)
      var that = this;
      var plength = res.data.objects.length;
      var j = 0;
      for (var i = 0; i < res.data.objects.length; i++) {
        if (j < plength) {
          var param = {};
          var string = "rangeList[" + j + "].name";
          param[string] = res.data.objects[i].userName;
          that.setData(param);       //

          var string = "rangeList[" + j + "].availableCredit";
          param[string] = res.data.objects[i].availableCredit;
          that.setData(param);       //
          j++;
        }

      }
    })


  },
  toggle(e) {
    console.log(e.currentTarget.dataset.index);
    if (this.data._num === e.currentTarget.dataset.index) {
      return false;
    } else {
      this.setData({
        _num: e.currentTarget.dataset.index
      })
    }
  },


  bindChange: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      _num: e.detail.current
    });
    switch (e.detail.current) {
      case 0:
        that.data.state = 0
        break;
      case 1:
        that.data.state = 1
        break;
      case 2:
        that.data.state = 2
        break;
    }

  },
  calendar: function (e) {

    wx.navigateTo({
      url: '../calendar/index?Rid=' + this.data.RoomID + '&allid=' + e.currentTarget.dataset.allid + '&starttime=' + this.data.RoomStartTime
    })
  },
  
  registers: function (e) {
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    if (this.data.RoomModel == "打卡模式") {
      var myDate = new Date();

      var TheTime = myDate.getFullYear() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + "00";
      var f = this.data.RoomStartTime + ":" + "00";
      var s = f.replace(/\-/g, "/");
      var e_1 = new Date(s).getTime();

      var e_2 = new Date(TheTime).getTime();
      console.log(e_1)
      console.log(e_2)
      if (e_2 > e_1) {
        creat_input.countdate1(s, TheTime, this)
        var tableIDw = 32680;
        let query1 = new wx.BaaS.Query()
        let query2 = new wx.BaaS.Query()
        // 设置查询条件（比较、字符串包含、组合等）
        query1.contains('RoomID', this.data.RoomID)
        query2.compare('created_by', '=', e.currentTarget.dataset.friendid)
        let andQuery1 = wx.BaaS.Query.and(query1, query2)
        // 应用查询对象
        let ProjectOfUserInfo = new wx.BaaS.TableObject(tableIDw)

        ProjectOfUserInfo.setQuery(andQuery1).find().then(res => {
          var recordIDp = res.data.objects[0].id;
          console.log(recordIDp);
          var length = res.data.objects[0].register.length;
          this.setData({
            friendregister: res.data.objects[0].register
          })
          console.log(this.data.friendregister);
          console.log(this.data.goDay);
          var tip = 0;
          console.log(res.data.objects[0])
          console.log(res.data.objects[0].dakaInfo)
          for (var i = 0; i < res.data.objects[0].dakaInfo.length; i++) {
            if (res.data.objects[0].dakaInfo[i] == uid) {
              tip++;
            }
          }
          if ((res.data.objects[0].today < this.data.goDay || tip == 0) && this.data.takeDay != this.data.totalDay) {
            if (res.data.objects[0].today < this.data.goDay) {
              let projectOfUserInfo1 = ProjectOfUserInfo.getWithoutData(recordIDp)

              projectOfUserInfo1.set('today', this.data.goDay);
              projectOfUserInfo1.update().then(res1 => {
                // success
                let projectOfUserInfo2 = ProjectOfUserInfo.getWithoutData(recordIDp)
                projectOfUserInfo2.set('dakaInfo', [uid])
                projectOfUserInfo2.update().then(res2 => {
                  // success
                  var Rlength = res.data.objects[0].dakaInfo.length + 1
                  console.log(Rlength / this.data.allList.length);
                  if (Rlength / this.data.allList.length >= 0.5) {
                    if (!this.data.friendregister[this.data.goDay - 1]) {
                      this.data.friendregister[this.data.goDay - 1] = true;
                      console.log(this.data.friendregister)
                      let projectOfUserInfo = ProjectOfUserInfo.getWithoutData(recordIDp)

                      projectOfUserInfo.set('register', this.data.friendregister);
                      projectOfUserInfo.update().then(res => {
                        // success
                        let tableID1 = 32518;
                        let query1 = new wx.BaaS.Query()
                        query1.contains('RoomID', this.data.RoomID)
                        let Room = new wx.BaaS.TableObject(tableID1)
                        Room.setQuery(query1).find().then(res => {
                          var recordIDr = res.data.objects[0].id;
                          let room = Room.getWithoutData(recordIDr)
                          var day = res.data.objects[0].TotalRegister
                          console.log(day)
                          room.set('TotalRegister', day + 1)
                          room.update();
                        })
                      }, err => {
                        // err
                      });
                      wx.showToast({
                        title: '打卡成功',
                        icon: 'success',
                        duration: 1000
                      })



                    }
                  } else if (this.data.takeDay == this.data.totalDay) {
                    wx.showToast({
                      title: '此用户已完成此次打卡计划',
                      icon: 'success',
                      duration: 1000
                    })
                  } else {
                    wx.showToast({
                      title: '今日成功帮助好友打卡',
                      icon: 'success',
                      duration: 1000
                    })
                  }
                }, err => {
                  // err
                })
              }, err => {
                // err
              });
            } else {
              let projectOfUserInfo3 = ProjectOfUserInfo.getWithoutData(recordIDp)
              projectOfUserInfo3.append('dakaInfo', [uid])
              projectOfUserInfo3.update().then(res4 => {
                // success
                var Rlength = res.data.objects[0].dakaInfo.length + 1
                console.log(Rlength)
                if (Rlength / this.data.allList.length >= 0.5) {
                  if (!this.data.friendregister[this.data.goDay - 1]) {
                    this.data.friendregister[this.data.goDay - 1] = true;
                    console.log(this.data.friendregister)
                    let projectOfUserInfo = ProjectOfUserInfo.getWithoutData(recordIDp)

                    projectOfUserInfo.set('register', this.data.friendregister);
                    projectOfUserInfo.update();
                    wx.showToast({
                      title: '打卡成功',
                      icon: 'success',
                      duration: 1000
                    })

                    let tableID1 = 32518;
                    let query1 = new wx.BaaS.Query()
                    query1.contains('RoomID', this.data.RoomID)
                    let Room = new wx.BaaS.TableObject(tableID1)
                    Room.setQuery(query1).find().then(res => {
                      var recordIDr = res.data.objects[0].id;
                      let room = Room.getWithoutData(recordIDr)
                      var day = res.data.objects[0].TotalRegister
                      console.log(day)
                      room.set('TotalRegister', day + 1)
                      room.update();
                    })

                  }
                } else {
                  wx.showToast({
                    title: '今日成功帮好友打卡',
                    icon: 'success',
                    duration: 3000
                  })
                }
              }, err => {
                // err
              })
            }

          } else {
            var that = this;
            wx.showToast({
              title: '今日已帮此好友打卡',
              icon: 'success',
              duration: 3000
            })
          }
        })

      }

    }
  },


  //-----------------------------------------------------------------------//
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  //----------------------------------------//
  roomAvailable: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '如果禁止其他用户将无法进入，确定要执行此操作吗？',
      success: function (res) {
        if (res.confirm) {
          var roomtableID = 32518;
          let query1 = new wx.BaaS.Query()
          // 设置查询条件（比较、字符串包含、组合等）
          query1.contains('RoomID', that.data.RoomID)
          // 应用查询对象
          let Room = new wx.BaaS.TableObject(roomtableID)
          Room.setQuery(query1).find().then(res => {
            var recordIDu = res.data.objects[0].id;
            let room = Room.getWithoutData(recordIDu)
            room.set('roomAvailable', false)
            room.update();
            that.setData({
              available: true,
              availableCondition: '已禁止'
            })
          })
        }
      }
    })

  },
  exists: function () {
    var uid = parseInt(wx.BaaS.storage.get('uid'))
    var that = this;
    wx.showModal({
      title: '提示',
      content: '真的要退出吗？你只能获得当前的信誉值。',
      success: function (res) {
        if (res.confirm) {
          let UsersT = 31660;
          let queryLog = new wx.BaaS.Query()
          queryLog.compare('created_by', '=', uid)
          let Users = new wx.BaaS.TableObject(UsersT)
          Users.setQuery(queryLog).find().then(res => {
            var logid = res.data.objects[0].id;
            let userlog = Users.getWithoutData(logid)
            var log = that.data.RoomName + '&' + that.data.totalDay + '&' + that.data.takeDay + '&' + that.data.pay + '&' + that.data.availableCredit + '&' + that.data.RoomStartTime + '&' + that.data.RoomEndTime;
            console.log(log)
            userlog.append('Log', log)
            userlog.update();
          })
          var removeTable = 32680;
          let query10 = new wx.BaaS.Query()
          let query11 = new wx.BaaS.Query()
          // 设置查询条件（比较、字符串包含、组合等）
          query10.contains('RoomID', that.data.RoomID)
          query11.contains('userName', app.globalData.userInfo.nickName)
          let andQuery1 = wx.BaaS.Query.and(query10, query11)
          let ProjectOfUserInfo4 = new wx.BaaS.TableObject(removeTable)
          var m;           //可得金额
          ProjectOfUserInfo4.setQuery(andQuery1).find().then(res => {
            console.log(res.data)
            var recordIDp = res.data.objects[0].id;
            m = res.data.objects[0].availableCredit
            console.log(m);
            ProjectOfUserInfo4.delete(recordIDp).then(res => {
              // success
              wx.showModal({
                title: '提示',
                content: '此次打赌结束，您获得' + that.data.availableCredit,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
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
                      var credit = res.data.objects[0].credit
                      console.log(m)
                      console.log(credit)
                      user.set('credit', credit + that.data.availableCredit)
                      user.update();


                    }, err => {
                      // err
                      console.log("gg")
                    })
                    var rtid = 32518;
                    let query12 = new wx.BaaS.Query()
                    let Room12 = new wx.BaaS.TableObject(rtid)
                    query12.contains('RoomID', that.data.RoomID)
                    Room12.setQuery(query12).find().then(res => {
                      var recordIDr = res.data.objects[0].id;
                      let room12 = Room12.getWithoutData(recordIDr)
                      room12.remove('uidList', [uid])
                      room12.update().then(res1 => {
                        // success
                        console.log(res);
                        let table = 32518;
                        let Room13 = new wx.BaaS.TableObject(table)
                        var recordIDr1 = res.data.objects[0].id;
                        let room13 = Room13.getWithoutData(recordIDr1)
                        var rest = res.data.objects[0].RoomAward - that.data.availableCredit;
                        room13.set('RoomAward', rest)
                        room13.update().then(res2 => {
                          let table1 = 32518;
                          let Room14 = new wx.BaaS.TableObject(table1)
                          let room14 = Room14.getWithoutData(recordIDr1)
                          room14.set('TotalRegister', res.data.objects[0].TotalRegister - that.data.takeDay)
                          room14.update().then(res4 => {
                            // success
                            console.log(Tregister)
                          }, err => {
                            // err
                          });



                        }, err => { console.log("dd") });
                      }, err => {
                        // err
                        console.log("ss")
                      })
                      var length2 = res.data.objects[0].uidList.length - 1
                      console.log(length2)
                      if (length2 == 0) {
                        Room12.delete(recordIDr).then(res => { })
                      }

                    })

                    wx.reLaunch({
                      url: '../index/index'
                    })
                  }
                }
              })
            }, err => {
              // err
            })
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.userInfo.nickName+'邀你加入计划,房间号：'+this.data.RoomID,
      path: '/pages/index/index',
      imageUrl:'https://cloud-minapp-13144.cloud.ifanrusercontent.com/1fnjWKPrHbdMjmPw.png'
    }
  }
})

