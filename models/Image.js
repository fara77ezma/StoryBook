const mongoose =require('mongoose');
const imageSchema=mongoose.Schema({
  image:{
    contentType:String,
    data:Buffer,
    
  },


 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User'
  },
  localuser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'localUser'
  },

});

module.exports=mongoose.model('Image',imageSchema);
