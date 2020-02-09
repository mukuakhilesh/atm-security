var express = require('express');
var app= express();
var ejs = require('ejs');
var socketio = require('socket.io');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var transactionModel = require("./Models/transaction_model");
mongoose.connect("mongodb://localhost:27017/atm-security", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("db connected");///use process.env.LOCALDB to connect to local mmongoDB server
}); ///importing transaction model
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
app.use("/public",express.static(__dirname+'/public'));
var socket1=null;

// Import Schemas
var userModel = require('./Models/user_model');


var expresserver=app.listen(3000,()=>{
    console.log('listening to 3000');
})
var pin="1234";
var account_no="09856723451";
var io=socketio(expresserver);
app.get('/insert',(req,res)=>{
    userModel.find({},async(err,data)=>{
        if(err) console.log(err);
        else{
        console.log(data);
     res.render('insert_card.ejs',{Users:data})
           
        }
    })
    
})
app.get('/pinConfirm',async(req,res)=>{
     if(account_no==""||pin=="")
         res.send("error dtected");
     userModel.findOne({acc_no:account_no},(err,user)=>{
         if(err) console.log(err)
         console.log(user.pin)
         hash =user.pin.toString();
        bcrypt.compare(pin,hash).then((result)=>{
            console.log(pin);
            console.log(account_no)
            if(result==true)
               res.send("validpin");
           else 
               res.send("invalidPin")
        })
     });
 app.get('/testing',(req,res)=>{
     console.log(res.body);
 })
})
app.get('/pincancel',(req,res)=>{
   pin="";
   account_no="";

   res.redirect('/insert');
})
app.get('/pinInput/:acc_no',(req,res)=>{
    console.log(req.params.acc_no)

    res.render('input_pin.ejs')
})

app.post('/adduser' , async (req , res)=> {
    try{
       const salt = await bcrypt.genSalt(10);
       var hash = await bcrypt.hash(req.body.pin,salt);
       req.body.pin = hash;
        userModel.create({
            name : req.body.name , 
            acc_no : req.body.acc_no , 
            pin : req.body.pin , 
            finger_avail : req.body.finger_avail , 
        }).then((data,err) => {
           
            
                console.log("User created !!");
                console.log(data);
                res.send("sunccessful");
              
          
        })
    }catch(err) {
    console.log(err);
    res.send("unsuccessfull");
    }
})

app.post('/newtransaction',(req,res)=>{
    console.log(req.body);
try{
    userModel.findOne({acc_no:req.body.acc_no},(err,user)=>{
        if(err) console.log(err)
        else{
            console.log(user)
            user.transaction_report.push({
                acc_no:req.body.acc_no,
                fingerprint:req.body.fingerprint,
                transaction_id:req.body.transaction_id,
                amount:req.body.amount 
            });
            user.save().then((data,err)=>{
                if(err) console.log(err);
                else {console.log(data);
                    // res.send("transaction successful");
                }
            })
             res.send(user);
        }
       
    })
    // transactonModel.create({
    //     acc_no:req.body.accn_no,
    //     fingerprint:req.body.fingerprint,
    //     transaction_id:req.body.transaction_id,
    //     amount:req.body.amount
    // }).then(()=>{
    //     console.log("transaction sucessfull");
    // })
}catch(err){
    console.log(err);
}
})
app.get('/home',(req,res)=>{
    console.log(req.query)
    res.render('home_option.ejs',{User:req.query})
})
io.on('connection',(socket)=>{
    console.log("socket is connected");
     socket1= socket;
   // socket1.emit('server_data',"this is the data");
})


var pp = require('child_process').spawn('python',['detector.py']);
pp.stdout.on('data',(data)=>{
    data = data.toString();
    console.log(data);
    pin=pin+data;
    if(socket1!=null)
     socket1.emit('server_data',pin);
     console.log(pin )
     
})
