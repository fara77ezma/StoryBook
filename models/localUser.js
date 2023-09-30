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

module.exports=mongoose.model('localUser',localUserSchema);
