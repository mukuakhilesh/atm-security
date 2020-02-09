const mongoose = require("mongoose")
const {transactionSchema}= require("./transaction_model")
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
    transaction_report : [transactionSchema]
});

module.exports = mongoose.model('User' , userSchema);



//name accnt-numer pin-encrypted fingerprint isavailed_fingerprint mail