
let chooseYear = null;
let chooseMonth = null;
let registerarray = new Array();
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    starttime: {},
    register: [],
  },
  onLoad(option) {
    const uid = option.allid;
    const Rid = option.Rid;
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const weeksCh = [ '日', '一', '二', '三', '四', '五', '六' ];
    this.calculateEmptyGrids(curYear, curMonth);
    this.calculateDays(curYear, curMonth);
    this.setData({
      curYear,
      curMonth,
      weeksCh,
      Rid,
      uid,
      starttime: option.starttime,
    });
    this.tapDayItem();
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false
      });
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    if (handle === 'prev') {
      let newMonth = curMonth - 1;
      let newYear = curYear;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
      this.anoDayItem();
    } else {
      let newMonth = curMonth + 1;
      let newYear = curYear;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
      this.anoDayItem();
    }
  },
  anoDayItem() {
    const days = this.data.days;
    var curYear = this.data.curYear;
    var curMonth = this.data.curMonth;
    var dlength = days.length;
    var f = this.data.starttime.split(" ");
    var s = new Date(f[0].replace(/-/g, "/"));
    var e_1 = new Date(s).getTime();
    var myDate = new Date(curYear,curMonth-1,dlength);
    var e_2 = new Date(myDate.toLocaleDateString()).getTime();
    var gedays = e_2 - e_1;
    var day = parseInt(gedays / (1000 * 60 * 60 * 24)) + 1;//当前到房间开始的天数
   
    var fir = new Date(curYear, curMonth - 1, 1).getTime();
    var permonthfir = parseInt((fir - e_1) / (1000 * 60 * 60 * 24));//每月一号到房间开始的天数
    var permonth = parseInt((e_2 - fir) / (1000 * 60 * 60 * 24)) + 1;//当前到每月一号的天数
    if (s.getMonth() == myDate.getMonth()) {
      var needregisterday = dlength - s.getDate() + 1;
      var min;
      if (registerarray.length <= needregisterday) {
        min = registerarray.length
      } else {
        min = needregisterday
      }
      for (var i = 0; i < min; i++) {
        if (registerarray[i]) {
          days[i + s.getDate() - 1].choosed = !days[i + s.getDate() - 1].choosed;
        }
      }

      this.setData({
        days,
      });
    } else {
      if (day <= registerarray.length) {
        for (var i = 0; i <= permonth; i++) {
          if (registerarray[i + permonthfir]) {
            days[i].choosed = !days[i].choosed;
          }
        }
        this.setData({
          days,
        });
      }
    }
  },
  tapDayItem() {
    //const idx = e.currentTarget.dataset.idx;
    const days = this.data.days;
    var dlength = days.length;
    var tableid = 32680;
    let query = new wx.BaaS.Query();
    let query1 = new wx.BaaS.Query();
    // 设置查询条件（比较、字符串包含、组合等）
    query.contains('RoomID', this.data.Rid);
    query1.compare('created_by', '=', Number(this.data.uid))
    let andQuery = wx.BaaS.Query.and(query, query1);
    let ProjectOfUserInfo = new wx.BaaS.TableObject(tableid);
    ProjectOfUserInfo.setQuery(andQuery).find().then(res => {
      
      registerarray=[].concat(res.data.objects[0].register);
      var f = this.data.starttime.split(" ");
      var s = new Date(f[0].replace(/-/g, "/"));
      var e_1 = new Date(s).getTime();
      var myDate = new Date();
      var e_2 = new Date(myDate.toLocaleDateString()).getTime();
      var gedays = e_2 - e_1;
      var day = parseInt(gedays / (1000 * 60 * 60 * 24)) + 1;//当前到房间开始的天数
      var curYear = this.data.curYear;
      var curMonth = this.data.curMonth;
      var fir = new Date(curYear, curMonth - 1, 1).getTime();
      var permonthfir = parseInt((fir-e_1) / (1000 * 60 * 60 * 24));//每月一号到房间开始的天数
      var permonth = parseInt((e_2 - fir)/ (1000 * 60 * 60 * 24)) + 1;//当前到每月一号的天数
      if (s.getMonth() == myDate.getMonth()) {
        var needregisterday = dlength - s.getDate() + 1;
        var min;
        if (registerarray.length <= needregisterday) {
          min = registerarray.length
        } else {
          min = needregisterday
        }
        for (var i = 0; i < min; i++) {
          if (registerarray[i]) {
            days[i + s.getDate() - 1].choosed = !days[i + s.getDate() - 1].choosed;
          }
        }
        
        this.setData({
          days,
        });
      }else{
        if(day<=registerarray.length){
          for(var i = 0;i<=permonth;i++){
            if (registerarray[i+permonthfir]) {
              days[i].choosed = !days[i].choosed;
            }
          }
          this.setData({
            days,
          });
        }
      }
      // success
    }, err => {
      // err
    })
    
   
    
  },

  pickerChange(e) {
    const val = e.detail.value;
    chooseYear = this.data.pickerYear[val[0]];
    chooseMonth = this.data.pickerMonth[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.curYear = chooseYear;
      o.curMonth = chooseMonth;
      this.calculateEmptyGrids(chooseYear, chooseMonth);
      this.calculateDays(chooseYear, chooseMonth);
    }

    this.setData(o);
    this.anoDayItem();
  },

};

Page(conf);
