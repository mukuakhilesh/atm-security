var express = require('express');
var app= express();
var bodyparser= require('body-parser');
var ejs = require('ejs');
var socketio = require('socket.io');


var transactonModel = require("./Models/transaction_model"); ///importing transaction model
app.use("/public",express.static(__dirname+'/public'));
var socket1=null;

// Import Schemas
var userModel = require('./Models/user_model');


var expresserver=app.listen(3000,()=>{
    console.log('listening to 3000');
})


var io=socketio(expresserver);
app.get('/insert',(req,res)=>{
    res.render('insert_card.ejs')
})
app.get('/home',(req,res)=>{
    res.render('home_option.ejs')
})
app.get('/pinInput',(req,res)=>{
    res.render('input_pin.ejs')
})

app.post('/adduser' , (req , res)=> {
    try{
        userModel.create({
            name : req.body.name , 
            acc_no : req.body.acc_no , 
            pin : req.body.pin , 
            finger_avail : req.body.finger_avail , 
        }).then(() => {
            console.log("User created !!");
        })
    }catch(err) {
    console.log(err);
    }
})

app.post('/transaction',(req,res)=>{
try{
    transactonModel.create({
        acc_no:req.body.accn_no,
        fingerprint:req.body.fingerprint,
        transaction_id:req.body.transaction_id,
        amount:req.body.amount
    }).then(()=>{
        console.log("transaction successfull");
    })
}catch(err){
    console.log(err);
}
})
io.on('connection',(socket)=>{
    console.log("socket is connected");
     socket1= socket;
   // socket1.emit('server_data',"this is the data");
})
var pin="";
var pp = require('child_process').spawn('python',['detector.py']);
pp.stdout.on('data',(data)=>{
    data = data.toString();
    console.log(data);
    pin=pin+data;
    if(socket1!=null)
     socket1.emit('server_data',pin);
     console.log(pin )
     
})
