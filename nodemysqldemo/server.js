const express=require('express')
const bodyParser =require('body-parser')
const app=express()
const mysql = require('mysql')
const number=6 //会议室个数
app.use(bodyParser.json())
function Array_2(nRow,nColumn){//定义二维数组matrix，nRow为会议室个数，nColumn为24，代表24个小时
  var array1=new Array(); //定义一维数组
  for(let i=0;i<nRow;i++)
  {
      array1[i]=new Array(); //将每一个子元素又定义为数组
      for(let n=0;n<nColumn;n++)
      {
          array1[i][n]=0; //此时aa[i][n]可以看作是一个二级数组
      }
  }
  return array1;
}
function convert(room){//会议室的中文字符串转换为数字
  if (room=='会议室一')
  return 0;
  if (room=='会议室二')
  return 1;
  if (room=='会议室三')
  return 2;
  if (room=='会议室四')
  return 3;
  if (room=='会议室五')
  return 4;
  if (room=='会议室六')
  return 5;  
}
function matrix_sum(num,start,end){//判断num会议室的start至end时间是否被占用，返回值＞0代表已占用
  let total=0;
  for (let j=start;j<end; j++){ 
    total=total+matrix[num][j];
  }
return total;

}
function matrix_set(num,start,end){//将num会议室的start至end时间都置为已占用
  let total=0;
  for (let j=start;j<end; j++){ 
    matrix[num][j]=1;
  }
return total;

}
function show_text(nrow,ncolumn){//根据matrix数据得到当前所有已占用的会议室及占用时间
  var str=``;
  for (let i=0;i<nrow;i++){
    if (matrix_sum(i,0,ncolumn)>0){
    str=str+`会议室${i+1}已被占用，时间为:`;
    for (let j=0;j<ncolumn;j++){
      //console.log(i,j);
    if (matrix[i][j]>0)
    str=str+`'${j}:00-${j+1}:00' `;
    }
    str=str+`\n`;
  }
  }
  return str;
}
function matrix_init(){//根据数据库数据初始化matrix
  var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'bookstore2'
  })
  connection.connect();//连接数据库
  connection.query("select * from meeting ",function(error,results){
    if (error) throw console.error;
    //console.log(results.length)
    for (let num=0;num<results.length;num++){
      let n_room=convert(results[num].room);
      let n_start=results[num].start;
      let n_end=results[num].end;
      matrix_set(n_room,n_start,n_end);
    }
  })
  connection.end();

}
function str1_init(){//查询数据库所有数据
  
  var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'bookstore2'
  })
  connection.connect();//连接数据库
  connection.query("select * from meeting ",function(error,results){
    if (error) throw console.error;
    //console.log(results);
    for (let num=0;num<results.length;num++){
      //console.log(str)
      str1=str1+results[num].room+' '+results[num].name+' '+results[num].start.toString()+' '+results[num].end.toString()+'\n';
    } 
   
  })
  
  connection.end();
  

}
matrix=Array_2(number,24);//记录number个会议室，24小时的预定情况
matrix_init();
str1=``;//返回详细信息
str1_init();
//处理插入数据的post请求
app.post('/insert',(req,res) => {
  var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'bookstore2'
  })
  connection.connect();//连接数据库
  //console.log('结果是',req.body);
  const req_name=req.body['name']
  const req_room=req.body['room']
  const req_start=Math.floor(req.body['start'])
  const req_end=Math.floor(req.body['end'])
  //console.log('值',req_name,req_room,req_start,req_end);//得到预订人姓名，会议室号，开始时间，结束时间
  let num_room=convert(req_room);
  //console.log('会议室号',num_room);//转换会议号为数字
  if (matrix_sum(num_room,req_start,req_end)>0) {//若该会议室的该时间段已被预订，
  var str=show_text(number,24);
  res.json(str);//则返回该时间段已被预订
  console.log(str);
  }
  else{
  matrix_set(num_room,req_start,req_end);
  str1=str1+req_room+' '+req_name+' '+req_start.toString()+' '+req_end.toString()+'\n';
  //console.log(matrix)
  let sqlstr=`insert into meeting (name,room,start,end) values ('${req_name}','${req_room}',${req_start},${req_end});`
  console.log('sql插入语句',sqlstr);
  connection.query(sqlstr,function(error,results){
    if (error) throw console.error;
    res.json("预订成功！")
    console.log(results)
    
  })//若会议室不冲突，则预定
}
  connection.end();
})

app.post('/init',(req,res)=>{//全部清除数据
  console.log(req.body.name)
  const a=req.body.name
  var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'bookstore2'
  })
  connection.connect();
  connection.query("truncate table meeting ",function(error,results){
    if (error) throw console.error;
    res.json(results)
    console.log(results)
    
  })
  matrix=Array_2(number,24);
  str1=``;
  connection.end();
  
})

app.get('/show',(req,res)=>{//查询

  var str=show_text(number,24);
  res.json(str);//若该会议室的该时间段已被预订，则返回该时间段已被预订
  console.log(str);
})

app.get('/show/who',(req,res)=>{//详细查询

  console.log(str1);
  res.json(str1);//若该会议室的该时间段已被预订，则返回该时间段已被预订
  
})

app.listen(80,'192.168.43.160',()=>{
  console.log('server running at http://192.168.43.160:80')
})