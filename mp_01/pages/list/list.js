Page({
 /* onShareAppMessage() {
    return {
      title: 'radio',
      path: 'page/component/pages/radio/radio'
    }
  },*/

  data: {
    items: [
      {value: '会议室一', name: '会议室一',checked:true},
      {value: '会议室二', name: '会议室二',checked:false},
      {value: '会议室三', name: '会议室三',checked:false},
      {value: '会议室四', name: '会议室四',checked:false},
      {value: '会议室五', name: '会议室五',checked:false},
      {value: '会议室六', name: '会议室六',checked:false},
    ],
    room:"会议室一",
    start:null,
    end:null,
    name1:null,
    url:"http://192.168.43.160:80/",
  },


  radioChange(e) {//选择单选后触发
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    
    this.data.room=e.detail.value
    console.log(this.data.room);

    this.setData({
      
    })
  },
  input1:function (e) {//起始时间输入框输入后触发
    let val=e.detail.value;
    console.log("起始时间为",val);
    
    this.setData({
      start:e.detail.value
    })
  },
  input2: function(e) {//结束时间输入框输入后触发
    console.log("结束时间为",e.detail.value);
   
    this.setData({
      end:e.detail.value
    })
  },
  input3:function(e) {//姓名输入框输入后触发
    console.log("姓名为",e.detail.value);
   
    this.setData({
      name1:e.detail.value
    })
  },
  submit: function (e) {//预定按钮按下后触发
    console.log("预定按钮按下");
    if (this.data.room==null || this.data.name1==null || this.data.start==null || this.data.end==null ){//若有框未填写
    console.log("请填写完整信息！")//设置tabbar显示信息
    if (this.data.room==null)
    wx.showModal({
      title:"提示",
      content:"请重新选择会议室!"
    })
    if (this.data.name1==null)
    wx.showModal({
      title:"提示",
      content:"请重新输入姓名!"
    })
    if (this.data.start==null)
    wx.showModal({
      title:"提示",
      content:"请重新输入开始使用时间!"
    })
    if (this.data.end==null)
    wx.showModal({
      title:"提示",
      content:"请重新输入结束使用时间!"
    })
    }
    else{
      const start=parseInt(this.data.start);
      const end=parseInt(this.data.end);
      if (this.data.name1==`` || start<8 || start>18|| end<8 || end>18 || start>=end )//检查填写是否规范
    {
      wx.showModal({
        title:"提示",
        content:"请按规范输入!"
        
      })
     // console.log(this.data.name1,this.data.start,this.data.end,this.data.room)
    }
      else{//都填写了，并且规范
    var json=JSON.stringify({"name":this.data.name1,"room":this.data.room,"start":this.data.start,"end":this.data.end})
    //发送json到服务器
    wx.request({
      url:this.data.url+"insert",
      data:json,
      method:"POST",
      success(res){
        //返回信息设置跳转页面
        console.log(res.data)
        wx.navigateTo({
          url: '../show/show?content='+JSON.stringify(res.data),
        })
      },
      fail(err){
        console.log(err)
      }
    
    })
  }
    
    this.setData({
      
    })
  }
  },
  show: function (e) {//查询按钮按下后触发
    console.log("查询按钮按下");
    //发送get消息到服务器
    wx.request({
      url:this.data.url+"show",
      method:"GET",
      success(res){
        console.log(res.data)
         //返回信息设置跳转页面
        wx.navigateTo({
          url: '../show/show?content='+JSON.stringify(res.data),
        })
      }
    })
   
   
    this.setData({
      
    })
  },

  detail_show: function (e) {//详细查询按钮按下后触发
    console.log("详细查询按钮按下");
    //发送get消息到服务器
    wx.request({
      url:this.data.url+"show/who",
      method:"GET",
      success(res){
        console.log(res.data)
         //返回信息设置跳转页面
        wx.navigateTo({
          url: '../show/show?content='+JSON.stringify(res.data),
        })
      }
    })
    this.setData({
      
    })
  },
})
