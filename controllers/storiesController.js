const Story=require('../models/Story');
const localUser =require('../models/localUser');
const User=require('../models/User');
const bcrypt = require("bcrypt");

/////////////////////////////////////////////////////////////////////////////

const addNewStory=async (req,res)=>{
  try {
  const local= await localUser.findById(req.user.id);
  if(local){
    if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
    req.body.localuser=req.user.id;
    const story=new Story (req.body);

    await story.save();
    res.redirect('/dashboard');
  }
  else{
    req.body.user=req.user.id;
    const story=new Story (req.body);
    await story.save();
    res.redirect('/dashboard');
  }

  } catch (e) {
   console.error(e);
   res.redirect('error/500')
  }
};
/////////////////////////////////////////////////////////////////////////////

const showPublicStories= async (req,res)=>{
  try {
    const local= await localUser.findById(req.user.id);
    if(local){
      if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
    }
    const stories=await Story.find({status:'public'})
    .populate('user')
    .populate('localuser')//to get user data
    .sort({createdAt:'desc'})
    .lean();
    // console.log(stories);
    res.render('stories/index',{stories});

  } catch (e) {
    console.error(e);
    res.render('error/500');

  }

};
/////////////////////////////////////////////////////////////////////////////

const editStory=async (req,res)=>{
  try {
    const local= await localUser.findById(req.user.id);
    if(local){
      if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
    }
  const story=await Story.findOne({_id:req.params.id})
    .lean();
    if(!story)  res.render('error/404');
    else if(story.user!=req.user.id&&story.localuser!=req.user.id) redirect('/stories');
    else{
      res.render('stories/edit',{story});
    }

  } catch (e) {
    console.error(e);
    res.render('error/500');
}};
/////////////////////////////////////////////////////////////////////////////

const showStory=async (req,res)=>{
  try {
    const local= await localUser.findById(req.user.id);
    if(local){
      if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
    }
  const story=await Story.findOne({_id:req.params.id}).populate('user').populate('localuser').lean();
    if(!story)  res.render('error/404');
    else res.render('stories/show',{story});
  } catch (e) {
    console.error(e);
    res.render('error/500');

}};
/////////////////////////////////////////////////////////////////////////////

const updateStory=async (req,res)=>{
  try {
    const local= await localUser.findById(req.user.id);
    if(local){
      if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
    }
  const story=await Story.findOne({_id:req.params.id});
    if(!story)  res.render('error/404');
    else if(story.user!=req.user.id&&story.localuser!=req.user.id) redirect('/stories');
    else{
      await Story.findOneAndUpdate({_id:req.params.id},req.body,{
      new:true, //if it doesn't exist create new one
      runValidators:true
      })
      res.redirect('/dashboard');
    }

  } catch (e) {
    console.error(e);
    res.render('error/500');

}}
/////////////////////////////////////////////////////////////////////////////

const deleteStory=async (req,res)=>{
  try {
    const local= await localUser.findById(req.user.id);
    if(local){
      if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
    }
  const story=await Story.findOne({_id:req.params.id});
    if(!story)  res.render('error/404');
    else if(story.user!=req.user.id&&story.localuser!=req.user.id) redirect('/stories');
    else{
      await Story.findOneAndDelete({_id:req.params.id});
      res.redirect('/dashboard');
    }

  } catch (e) {
    console.error(e);
    res.render('error/500');

}};
/////////////////////////////////////////////////////////////////////////////
const showUserStories=async (req,res)=>{
try {
  const local= await localUser.findById(req.user.id);
  if(local){
    if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
  }
  let stories=await Story.find({user:req.params.userId,status:'public'})
  .populate('user')
  .sort({createdAt:'desc'})
  .lean();

  if(stories.length==0){
     stories=await Story.find({localuser:req.params.userId,status:'public'})
    .populate('localuser')//to get user data
    .sort({createdAt:'desc'})
    .lean();
  }

  res.render('stories/index',{stories});
  } catch (e) {
    console.error(e);
    res.render('error/500');

}};
//////////////////////////////////////////////////////////////////////////////
const searchByTitle=async (req,res)=>{
try {
  const local= await localUser.findById(req.user.id);
  if(local){
    if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
  }
  const title= new RegExp(req.params.query,'i');
  const stories=await Story.find({title,status:'public'})
  .populate('user')
  .populate('localuser')//to get user data
  .sort({createdAt:'desc'})
  .lean();
  res.render('stories/index',{stories});
  } catch (e) {
    console.error(e);
    res.render('error/500');

  }}
  /////////////////////////////////////////////////////////////////////////////

module.exports={
  addNewStory,
  showPublicStories,
  editStory,
  showStory,
  updateStory,
  deleteStory,
  showUserStories,
  searchByTitle
}
