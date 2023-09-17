const express=require('express');
const router=express.Router();
const passport = require('passport');
const indexController=require('../controllers/indexController');


router.get('/google',passport.authenticate('google',{scope:['profile']}));
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login',successRedirect:'/dashboard'}))
router.get('/logout',indexController.logout);
module.exports=router;
