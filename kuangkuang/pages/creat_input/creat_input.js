//index.js
//获取应用实例

const app = getApp()

Page({
  data: {
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "98rpx",//输入框高度
      width: "604rpx",//输入框宽度
      see: true,//是否明文展示
      interval: true,//是否显示间隔格子
    }
  },

  // 当组件输入数字6位数时的自定义函数
  valueSix() {
   
    console.log('this.data.input_value');


  },

  onload: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
 
  },
  getRoomNumber: function () {


      var a1 = Math.floor(Math.random() * 10).toString()
      var a2 = Math.floor(Math.random() * 10).toString()
      var a3 = Math.floor(Math.random() * 10).toString()
      var a4 = Math.floor(Math.random() * 10).toString()
      var a5 = Math.floor(Math.random() * 10).toString()
      var a6 = Math.floor(Math.random() * 10).toString()
      var roomNumber = a1 + a2 + a3 + a4 + a5 + a6;
      console.log(roomNumber);
      var tableID = 32518;
      let query1 = new wx.BaaS.Query()
      // 设置查询条件（比较、字符串包含、组合等）
      query1.contains('RoomID', roomNumber)
      // 应用查询对象
      let Room = new wx.BaaS.TableObject(tableID)
      Room.setQuery(query1).find().then(res => {
        console.log(res.data);
        if (res.data.objects.length == 0) {
          wx.navigateTo({
            url: '../input/input?str=' + roomNumber
          });

        }else{
          this.getRoomNumber()
        }
      },err=>{
        console.log(sd)
      })
  },

})
