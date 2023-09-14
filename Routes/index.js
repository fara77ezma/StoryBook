const express=require('express');
const router=express.Router();
const Story=require('../models/Story');

const {ensureAuth,ensureGuest}=require('../midleware/auth');
router.get('/',(req,res)=>{
  res.render('login',{
    layout:'login'
  });
})
router.get('/login',ensureGuest,(req,res)=>{
  res.render('login',{
    layout:'login'
  });
})
router.get('/dashboard',ensureAuth,async (req,res)=>{
  try {
    const stories= await Story.find({user:req.user.id}).lean();
    res.render('dashboard',{name:req.user.firstName,stories});
  } catch (e) {
 console.error(e);
 res.render('error/500');
  }
})
module.exports=router;
