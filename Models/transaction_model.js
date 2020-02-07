var mongoose = reuire("mongoose");
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
 module.exports = transactionModel;
 