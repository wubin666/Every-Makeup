var express=require('express');
var bodyParser=require('body-parser');
var json=bodyParser.json
var router=express.Router();

var mysql=require('mysql');
const con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123',
  database:'Makeup'
});

//router.use(function(req,res){
  //res.end('end use');
//})
router.post('/',function(req,res){
  //console.log('hello login');
 
 console.log(req.body);
 var user_id=req.body.user_id;
 var user_pwd=req.body.user_pwd;
 //res.json({a:12,b:13});
 con.query('select * from users', (err, results) => {
   if(err) {
     console.log(err.message);
     process.exit(1);   
   }else{
      //console.log(results);
      console.log(results.length);
      for(var i=0;i<results.length;i++){
        //console.log(i);
        if((results[i].mei_id==user_id || results[i].email==user_id || results[i].phone==user_id)&& results[i].pwd==user_pwd){
          if(results[i].status==0){//判断用户状态，是否已登录，status=0表示未登录
            con.query('update users set status = ? where mei_id = ?',[1,results[i].mei_id],(err,result)=>{
              if(err){
                 console.log(err.message);
                 process.exit(1);
              }else{
                con.query('select * from users where mei_id=?',[results[i].mei_id],(err,re)=>{
                  if(err){
                    console.log(err.message);
                  }else{
                    console.log(re)
                    res.json(re[0]);
                  }
                })
                 console.log('login success');
               }
            });
            break;
          }else if(results[i].status==1){
            console.log('该用户已被登录')
            res.json({'status':-2});
          }
        }else{
          if(i<results.length-1){
            //console.log(123,i);
            continue;
          }else{
            console.log('用户未注册');
            res.json({'status':-1});//status=-1表示该用户未注册；
          }
        }
      }
      //res.json(results);
    }
  });
});

router.post('/status',function(req,res){
  console.log(req.body);
  var status=req.body.status;
  var mei_id=req.body.mei_id;
  con.query('update users set status=? where mei_id=?',[0,mei_id],(err,result)=>{
    if(err){
      console.log(err.message);
    }else{
      console.log(result);
      con.query('select * from users where mei_id=?',[mei_id],(err,re)=>{
        console.log(re);
        if(err){
          console.log(err.message);
          process.exit(1);
        }else{
          res.json(re[0]);
          console.log('退出登录成功');
        }
      })
  }})
})

module.exports = router;