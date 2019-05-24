

let addRoom = (ctx) => {
  var uid = parseInt(wx.BaaS.storage.get('uid'))
  var app = getApp();
  var myDate = new Date();
  var month = myDate.getMonth() + 1;
  var dat = myDate.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (dat >= 1 && dat <= 9) {
    dat = "0" + dat;
  }
  let tableId = 32518,
    Rooms = new wx.BaaS.TableObject(tableId),
    Room = Rooms.create(),
    RoomID=String(ctx.data.RoomID),
    RoomName=String(ctx.data.RoomName),
    RoomEndTime=String(ctx.data.date +" "+ ctx.data.time),
    RoomRule=String(ctx.data.rule),
    RoomNeedPay = parseInt(ctx.data.NeedPay),
    RoomCanExsit=Boolean(ctx.data.RoomCanExit),
    RoomModel = 1,
    RoomAward = parseInt(ctx.data.NeedPay),
    RoomMemberName = [app.globalData.userInfo.nickName],
    RoomMemberAvatarUrl = [app.globalData.userInfo.avatarUrl],
    uidList = [uid],
    TotalRegister = 0,
    RoomStartTime = myDate.getFullYear() + "-" + month + "-" + dat + " " + myDate.getHours() + ":" + myDate.getMinutes()
  let data = {
    RoomID,
    RoomName,
    RoomEndTime,
    RoomRule,
    RoomNeedPay,
    RoomCanExsit,
    RoomAward,
    RoomModel,
    RoomStartTime,
    RoomMemberName,
    RoomMemberAvatarUrl,
    uidList,
    TotalRegister
  }

  Room.set(data)
    .save()

}
let addprojectofuserInfo = (ctx) => {
  var app = getApp();
  let tableId = 32680,
    ProjectOfUserInfos = new wx.BaaS.TableObject(tableId),
    ProjectOfUserInfo = ProjectOfUserInfos.create(),
    RoomID = String(ctx.data.RoomID),
    RoomModel = parseInt(ctx.data.RoomModel),
    userName = app.globalData.userInfo.nickName

  let data = {
    RoomID,
    RoomModel,
    userName,
    today:0,
    dakaInfo:[],
    register: [false, false],
  }

  ProjectOfUserInfo.set(data)
    .save().then(res => {
      // success
      //------------------------钱------------------//
      var uid = parseInt(wx.BaaS.storage.get('uid'))
      var tableID = 31660;
      let query = new wx.BaaS.Query()

      // 设置查询条件（比较、字符串包含、组合等）
      query.compare('created_by', '=', uid)
      let User = new wx.BaaS.TableObject(tableID)
      User.setQuery(query).find().then(res => {
        // success
        console.log(res.data)
        var recordIDr = res.data.objects[0].id;
        let user = User.getWithoutData(recordIDr)
        var credit = res.data.objects[0].credit
        console.log(ctx.data.NeedPay)


        user.set('credit', credit - ctx.data.NeedPay)
        user.update();
    }, err => {
      // err
    })

    
    
  }, err => {
    // err
    console.log("gg")
  })
}
let countdate = (st,et,ctx) =>{
  var sdate = st.split(" ");
  var edate = et.split(" ");
  var start_date = new Date(sdate[0].replace(/-/g, "/"));
  var end_date = new Date(edate[0].replace(/-/g, "/"));
  var days = end_date.getTime() - start_date.getTime();
  var day = parseInt(days / (1000 * 60 * 60 * 24));
  if (day > 0) {
    ctx.setData({
      totalDay: day,
    })
    console.log(day);
  } else {
    ctx.setData({
      totalDay: 1,
    })
  } 
}
let countdate1 = (st, et, ctx) => {
  var myDate = new Date();
  var time = new Array();
  var date = new Array();
  var sec = new Array();
  var stime = new Array();
  var sdate = new Array();
  var ssec = new Array();
  var totalday = 0;
  time = et.split(" ");
  date = time[0].split("/")
  sec = time[1].split(":")
  stime = st.split(" ");
  sdate = stime[0].split("/")
  ssec = stime[1].split(":")
  var yearp = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");
  var yearr = new Array("31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");
  var month = date[1];
  var dat = date[2];
  if (month >= 1 && month <= 9) {
    date[1] = "0" + month;
  }
  if (dat >= 1 && dat <= 9) {
    date[2] = "0" + dat;
  }
  if (date[0] > sdate[0]) {
    //---------------------开始年份--------------------------//
    if (sdate[0] % 4 == 0) {

      for (var i = sdate[1]; i < 12; i++) {
        totalday += parseInt(yearr[i]);
      }
      if (sdate[1] != 2) {
        if (sdate[1] != 4 && sdate[1] != 6 && sdate[1] != 9 && sdate[1] != 11) {
          totalday += (31 - sdate[2])
        } else {
          totalday += (30 - sdate[2])
        }
      } else {
        totalday += (29 - sdate[2])
      }
    } else {
      for (var i = sdate[1]; i < 12; i++) {
        totalday += parseInt(yearp[i]);
      }
      if (sdate[1] != 2) {
        if (sdate[1] != 4 && sdate[1] != 6 && sdate[1] != 9 && sdate[1] != 11) {
          totalday += (31 - sdate[2])
        } else {
          totalday += (30 - sdate[2])
        }
      } else {
        totalday += (28 - sdate[2])
      }
    }
    //----------------------------结束年份------------------------//
    var counter = 0;
    if (date[0] % 4 == 0) {

      for (var i = date[1]; i < 12; i++) {
        counter += parseInt(yearr[i]);
      }
      if (date[1] != 2) {
        if (date[1] != 4 && date[1] != 6 && date[1] != 9 && date[1] != 11) {
          counter += (31 - date[2])
        } else {
          counter += (30 - date[2])
        }
      } else {
        counter += (29 - date[2])
      }
      totalday += 366 - counter;
    } else {
      for (var i = date[1]; i < 12; i++) {
        counter += parseInt(yearp[i]);
      }
      if (date[1] != 2) {
        if (date[1] != 4 && date[1] != 6 && date[1] != 9 && date[1] != 11) {
          counter += (31 - date[2])
        } else {
          counter += (30 - date[2])
        }
      } else {
        counter += (28 - date[2])
      }
      totalday += 365 - counter
    }
    //-----------------------------间隔年份-----------------------------//
    var year1 = parseInt(sdate[0])
    var year2 = parseInt(date[0])
    while (year1 != year2 - 1) {
      if ((year1 + 1) % 4 == 0) {
        total += 366;
        year1++;
      } else {
        total += 365;
        year1++;
      }
    }
    totalday += 1;
    ctx.setData({
      goDay: totalday,
    })
    console.log(totalday);
    //----------------------间隔月份---------------------------------//

  } else if (date[0] == sdate[0]) {
    if (date[1] == sdate[1]) {
      totalday += date[2] - sdate[2]
      totalday += 1;
      ctx.setData({
        goDay: totalday,
      })
      console.log(totalday);
    } else {
    var month = date[1];
    if (sdate[0] % 4 == 0) {

      for (var i = sdate[1]; i < month - 1; i++) {
        totalday += parseInt(yearr[i]);
      }
      if (sdate[1] != 2) {
        if (sdate[1] != 4 && sdate[1] != 6 && sdate[1] != 9 && sdate[1] != 11) {
          totalday += (31 - sdate[2])
        } else {
          totalday += (30 - sdate[2])
        }
      } else {
        totalday += (29 - sdate[2])
      }
      if (date[1] != 2) {
        if (date[1] != 4 && date[1] != 6 && date[1] != 9 && date[1] != 11) {
          totalday += date[2]
        } else {
          totalday += date[2]
        }
      } else {
        totalday += sdate[2]
      }
    } else {
      for (var i = sdate[1]; i < month - 1; i++) {
        totalday += parseInt(yearp[i]);
      }
      if (sdate[1] != 2) {
        if (sdate[1] != 4 && sdate[1] != 6 && sdate[1] != 9 && sdate[1] != 11) {
          totalday += (31 - sdate[2])
        } else {
          totalday += (30 - sdate[2])
        }
      } else {
        totalday += (28 - sdate[2])
      }
      if (date[1] != 2) {
        if (date[1] != 4 && date[1] != 6 && date[1] != 9 && date[1] != 11) {
          totalday += parseInt(date[2])
        } else {
          totalday += parseInt(date[2])
        }
      } else {
        totalday += parseInt(date[2])
      }
    }
    totalday += 1;
    ctx.setData({
      goDay: totalday,
    })
    console.log(totalday);
    }
  } else {
    ctx.setData({
      goDay: 0,
    })
    console.log("输入错误");
  }


}
module.exports = {

  addRoom,
  addprojectofuserInfo,
  countdate,
  countdate1
}
