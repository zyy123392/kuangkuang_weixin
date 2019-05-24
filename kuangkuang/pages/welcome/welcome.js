Page({
  data: {
    imgs: [
      "https://cloud-minapp-13144.cloud.ifanrusercontent.com/1fnOhJtbemrFecxD.png",
      "https://cloud-minapp-13144.cloud.ifanrusercontent.com/1fnOhFMqUKZNbhNK.png",
      "https://cloud-minapp-13144.cloud.ifanrusercontent.com/1fnOhMXwrmxbwnMi.png",
      "https://cloud-minapp-13144.cloud.ifanrusercontent.com/1fnOhQBhYghRxKqu.png",
      "https://cloud-minapp-13144.cloud.ifanrusercontent.com/1fnOhAFVUGTxfdTf.png",
    ],

    img: "http://img.kaiyanapp.com/7ff70fb62f596267ea863e1acb4fa484.jpeg",
  },

  start:function() {
    wx.reLaunch({
      url: '../index/index'
    })
  },


})