var mongoose = require("mongoose");
 var transactionSchema= mongoose.Schema({
 acc_no:{
  type:String,
 },
fingerprint:{
    type:String
},
date:{
    type:Date,
    default:Date.now
},
transaction_id:{
    type:String
},
amount:{
    type:String 
}
 })
 var transactionModel = mongoose.model('Transaction',transactionSchema);
 exports.transactionModel = transactionModel;
 exports.transactionSchema= transactionSchema;
