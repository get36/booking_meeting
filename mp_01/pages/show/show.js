Page({
  data:{
    text:{}
  },
  onLoad(opt){
    console.log(JSON.parse(opt.content))
    this.setData({
      text:JSON.parse(opt.content)
    })
  }

})