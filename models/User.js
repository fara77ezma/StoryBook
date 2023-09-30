const mongoose =require('mongoose');
const userSchema=mongoose.Schema({
  googleId:{
    type:String,
    required:true
  },
  displayName:{
    type:String,
    required:true
  },
  firstName:{
    type:String,
    required:true
  },
 lastName:{
    type:String,
    required:true
  },
  image:{
    contentType:String,
    data:Buffer,

  },
  createdAt:{
     type:Date,
     defualt:Date.now
   },
 bio:{
   type:String,

 }
});

module.exports=mongoose.model('User',userSchema);
