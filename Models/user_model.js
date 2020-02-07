const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true
    } , 
    acc_no : {
        type : String , 
        required : true
    } , 
    pin : {
        type : String , 
        required : true
        //Encrypted
    } , 
    phone : {
        type : String , 
        required : false
    } , 
    fingerprint : {
        type : String , 
        required : false
        // Encrypted
    } , 
    finger_avail : {
        type : Boolean , 
        required : true
    } , 
    reg_mail : {
        type : String , 
        required : false
    } , 
    transcation_report : [{
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'Transaction' , 
        // info of last 10 transactions
    }]
});

module.exports = mongoose.model('User' , userSchema);



//name accnt-numer pin-encrypted fingerprint isavailed_fingerprint mail