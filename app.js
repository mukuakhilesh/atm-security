var express = require('express');
var app= express();
const dgram = require('dgram');
const server = dgram.createSocket('udp4');  ///////importing udp socket and creating server
var ejs = require('ejs');
var socketio = require('socket.io');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect("mongodb://localhost:27017/atm-security", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("db connected");///use process.env.LOCALDB to connect to local mmongoDB server
}); 
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
app.use("/public",express.static(__dirname+'/public'));
var socket1=null;
server.bind(10000);                                      //////////binding udp port to 10000

var expresserver=app.listen(3000,()=>{
    console.log('listening to 3000');                  
})
var io=socketio(expresserver);                           //////connecting to the webpage via socket




server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});



server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});



// Import Schemas
var userModel = require('./Models/user_model');
var transactionModel = require("./Models/transaction_model");


//------------------------------------------------------------------------------------------------------------------------------------------------////////////////////////
var pin="";
var account_no="";     /////  user pin and password received from the user ////

app.get('/insert',(req,res)=>{
    userModel.find({},async(err,data)=>{
        if(err) console.log(err);
        else{
        console.log(data);                                               ////insert  atm card ..1st page 
     res.render('insert_card.ejs',{Users:data})
           
        }
    })
    
})
app.get('/home',(req,res)=>{
    console.log(req.query)                                               ////////// home page after card swipe//////////////
    res.render('home_option.ejs',{User:req.query})
})


app.get('/pinInput/:acc_no',(req,res)=>{
    console.log(req.params.acc_no)                                      ////////////render input pin page   ////
    account_no= req.params.acc_no;
    res.render('input_pin.ejs')
})

// app.get('/rcvpin',(req,res)=>{       ////input pin from python model using udp socket
//     server.on('message', (msg, rinfo) => {
//         console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
       
//       });  
//       server.send(Buffer.from("data received"), rinfo.port, rinfo.address, (err) => {
//         console.log(err);
//        });

// })


app.get('/pinConfirm',async(req,res)=>{
     if(account_no==""||pin=="")
       res.send("error dtected");
    else{
     userModel.findOne({acc_no:account_no},(err,user)=>{
         if(err) console.log(err)
         console.log(user.pin)
         hash =user.pin.toString();                                              ////////////confirm pin on clicking confirm button
         bcrypt.compare(pin,hash).then((result)=>{
            console.log(pin);
            console.log(account_no)
            if(result==true)
               res.render("/withdrawal");
           else 
           {
               console.log("invalid pin")
               account_no="";
               pin="";
            res.send("invalidPin")
           }
              
        
        })
    
     });
    }
})
app.get('/pincancel',(req,res)=>{
   pin="";
   account_no="";                            /////////////////// cancel pin when pin is cancelled

   res.redirect('/insert');
})





app.post('/adduser' , async (req , res)=> {
    try{
       const salt = await bcrypt.genSalt(10);
       var hash = await bcrypt.hash(req.body.pin,salt);
       req.body.pin = hash;
        userModel.create({
            name : req.body.name ,                                      /// add user to the database
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
app.get('/withdrawal',(req,res)=>{
    res.render('withdrawal.ejs',{acc_no:account_no})
})
app.post('/newtransaction',(req,res)=>{

    console.log("request is ");
    console.log(req.body);
    
    

try{
    userModel.findOne({acc_no:req.body.acc_no},(err,user)=>{
        if(err) {console.log(err); return ;}
        else{
           // console.log(user);
            if(user){
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
             res.redirect("/insert");
        }
        else return res.redirect('/insert');
        }
       
    });
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

    server.on('message', (msg, rinfo) => {
         console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
         pin+=msg;
         console.log("pin:",pin);
         socket1.emit('pin',pin);
       
    });  
//       server.send(Buffer.from("data received"), rinfo.port, rinfo.address, (err) => {
//         console.log(err);
//        });
/////////////////////       sokcet script///////////////////////////////////


io.on('connection',(socket)=>{
    console.log("socket is connected");
     socket1= socket;
    

     socket.on('getpin',(data)=>{
         console.log("here");
     server.send(Buffer.from("pin"),10000,"192.168.43.253", (err) => {
     console.log(err);
     })
     socket.on('disconnect',()=>{
         pin="";
         account_no="";
         socket.disconnect();
     })
   // socket1.emit('server_data',"this is the data");
})
})
//-------------------------run a python script from  node.js///////////////////
// var pp = require('child_process').spawn('python',['detector.py']);
// pp.stdout.on('data',(data)=>{
//     data = data.toString();
//     console.log(data);
//     pin=pin+data;
//     if(socket1!=null)
//      socket1.emit('server_data',pin);
//      console.log(pin )
     
// 
