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
router.post('/work',(req,res)=>{
  var work_id=req.body.work_id;
  con.query('select * from works where work_id=?',[work_id],(err,result)=>{
    if(err){console.log(err.message)}
    else{
      res.json(result[0]);
    }
  })
})

router.post('/scan',(req,res)=>{
  var work_id=req.body.work_id;
 con.query('select scannum from works where work_id=?',[work_id],(err,result)=>{
      if(err){console.log(err.message)}
      else{
       // res.json(result[0]);
       var scannum=result[0].scannum+1;
       con.query('update works set scannum=? where work_id=?',[scannum,work_id]);
       res.json({'scannum':scannum});
      }
  })
})
router.post('/follow',(req,res)=>{
  var mei_id=req.body.mei_id;
  var isf=req.body.isfollow;
  var follownum;
  con.query('select follownum from users where mei_id=?',[mei_id],(err,result)=>{
    if(err){
         console.log(err.massege) 
    }else{
      follownum=result[0].follownum;
      if(isf==0){
        console.log(result)
        follownum=result[0].follownum+1;
        con.query('update users set follownum=? where mei_id=?',[follownum,mei_id]);
        console.log(follownum);
      }else if(isf==1){
        follownum=result[0].follownum-1;
        console.log(follownum);
        con.query('update users set follownum=? where mei_id=?',[follownum,mei_id])
      }
    }
  })
})

router.post('/like',(req,res)=>{
   var work_id=req.body.work_id;
   var isl=req.body.islike;
   let likenum=0;
   console.log(work_id,isl)
      con.query('select likenum from works where work_id=?',[work_id],(err,result)=>{
        console.log('result:',result);
        if(err){
            console.log(err.massege)
        }else{
            likenum=result[0].likenum;
            if(isl==0){
              // console.log(result)
              likenum=result[0].likenum+1;
              con.query('update works set likenum=? where work_id=?',[likenum,work_id]);
              con.query('select * from works where work_id=?',[work_id],(err,re)=>{
                if(err){console.log(err.message)}
                else{
                  res.json(re[0]);
                }
              })
              //console.log(likenum);       
            }else if(isl==1){
              likenum=result[0].likenum-1;
              // console.log(likenum);
              con.query('update works set likenum=? where work_id=?',[likenum,work_id]);
              con.query('select * from works where work_id=?',[work_id],(err,re)=>{
                  if(err){console.log(err.message)}
                  else{                           
                       res.json(re[0]);
                  }                
              })   
            }   
       }
     })
})

router.post('/star',(req,res)=>{
   var work_id=req.body.work_id;
   var iss=req.body.isstar;
   let starnum=0;
   console.log(work_id,iss)
   con.query('select starnum from works where work_id=?',[work_id],(err,result)=>{
     console.log('result:',result);
     if(err){
        console.log(err.massege)       
     }else{
       starnum=result[0].starnum;
       if(iss==0){
           // console.log(result)
           starnum=result[0].starnum+1;
           con.query('update works set starnum=? where work_id=?',[starnum,work_id]);
           con.query('select * from works where work_id=?',[work_id],(err,re)=>{
                 if(err){console.log(err.message)}
                 else{
                     res.json(re[0]);               
                 }           
           })
           //console.log(starnum);      
       }else if(iss==1){
           starnum=result[0].starnum-1;
           // console.log(likenum);
           con.query('update works set starnum=? where work_id=?',[starnum,work_id]);
           con.query('select * from works where work_id=?',[work_id],(err,re)=>{
               if(err){console.log(err.message)}
               else{
                  res.json(re[0]);             
               }              
           })          
       }
     }
   })
})

router.post('/creatework',(req,res)=>{
  var content=req.body.content;
  var mei_id=req.body.mei_id;
  var work_id='';
  var kind=req.body.kind;
  var title=req.body.title;
  var img=req.bodyimg || '../../assets/images/img22.jpg,../../assets/images/img24.jpg,../../assets/images/img26.jpg'
  con.query('select count(*) num from works where mei_id=?',[mei_id],(err,result)=>{
    if(err){console.log(console.log(err.message))}
    else{
      work_id=mei_id+(result[0].num+1);
      con.query('insert into works(work_id,title,content,img,kind,mei_id) values(?,?,?,?,?,?)',
        [work_id,title,content,img,kind,mei_id],(err,reslt)=>{
          if(err){console.log(err.message)}
          else{
            con.query('select * from works where work_id=?',[work_id],(err,re)=>{
              console.log(re);
              res.json(re[0]);
            })
          }
        })
    }
  })
})

module.exports = router;
