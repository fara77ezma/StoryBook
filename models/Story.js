const mongoose =require('mongoose');
const storySchema=mongoose.Schema({
  title:{
    type:String,
    required:true,
    trim:true
  },
  body:{
    type:String,
    required:true
  },
  status:{
    type:String,
    defualt:'public',
    enum:['public','private']
  },
 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User'
  },
  localuser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'localUser'
  },
  createdAt:{
     type:Date,
     defualt:Date.now
   },

});

module.exports=mongoose.model('Story',storySchema);
