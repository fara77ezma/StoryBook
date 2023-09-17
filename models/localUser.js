const mongoose =require('mongoose');
const localUserSchema=mongoose.Schema({

  firstName:{
    type:String,
    required:true
  },
 lastName:{
    type:String,
    required:true
  },
  email:{
     type:String,
     required:true
   },
   password:{
      type:String,
      required:true
    },
isverified:{
       type:Boolean,
       defualt:false
     },
  image:{
  type:String
  },
  createdAt:{
     type:Date,
     defualt:Date.now
   },

});

module.exports=mongoose.model('localUser',localUserSchema);
