const Story=require('../models/Story');
const localUser =require('../models/localUser');
const passport = require('passport');
const crypto = require("crypto");
const Token = require("../models/token");
const User =require('../models/User');
const upload=require('../config/upload');
const sendEmail = require("../config/sendEmail");
const bcrypt = require("bcrypt");
const Image =require('../models/Image');

////////////////////////////////////////////////////////////////////////////////

const yourDashboard=async (req,res)=>{

  try {
    let user=await localUser.findById(req.user.id);
    if(user&&user.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
    else{
    let stories= await Story.find({user:req.user.id}).lean();
    if(stories.length==0) {

      stories= await Story.find({localuser:req.user.id}).lean();
    }
    res.render('dashboard',{name:req.user.firstName,stories});

  }
  }

   catch (e) {
 console.error(e);
 res.render('error/500');
  }
};
////////////////////////////////////////////////////////////////////////////////

const login=(req,res)=>{
  res.render('locallogin',{
    layout:'locallogin'
  });
};
////////////////////////////////////////////////////////////////////////////////

const loginPost=(req,res,next)=>{
passport.authenticate('local',{
  successRedirect:'/dashboard',
  failureRedirect:'/login'
})(req,res,next);

};
////////////////////////////////////////////////////////////////////////////////

const logout =(req,res)=>{
  req.logout(()=>res.render('locallogin',{layout:'locallogin',sucessmsg:"You're logged out sucessfully"}));

}
////////////////////////////////////////////////////////////////////////////////

const Register= async(req,res)=>{
  req.body.isverified=false;

  const {firstName,lastName,email,password,password2,isverified}=req.body;

   let localuser= await localUser.findOne({email});

   if(!localuser)
   {
     if(password===password2)
     {
       if(password.length<=6)
       {
       res.render('register',{layout:'register',firstName,lastName,email,msg:'passwords should be more than 6 characters'});

       }
       else{
         try {

          user= new localUser(req.body);
          //bcrpy password
        const salt=  await bcrypt.genSalt(10);
        const hash= await  bcrypt.hash(user.password,salt);
                 user.password=hash;
              await  user.save();


             const loc=await localUser.findOne({email:email});
             const newImage=new Image({
               image:{
                 contentType:'image/jfif',
                 data:'defualt.jfif',

               },
               localuser:loc.id
             })
          await   newImage.save();
         const token=await new Token({userId:user._id,token:crypto.randomBytes(32).toString("hex")}).save();
         const url=`${process.env.BASE_URL}${user._id}/verify/${token.token}`;
         await sendEmail(user.email,"Verify Email",url,'verify your email');
          res.render('locallogin',{layout:'locallogin',sucessmsg:"An E-mail send to your account please verify "});

       } catch (e) {
         console.error(e);
       }}


   }
     else {
       res.render('register',{layout:'register',firstName,lastName,email,msg:'passwords should match'});
     }
   }
   else {
     res.render('register',{layout:'register',firstName,lastName,email,msg:'This email already have an account'});

   }
}
////////////////////////////////////////////////////////////////////////////////

const verifyEmail= async(req,res)=>{
  try {
    const user=await localUser.findById(req.params.id);
    if(!user) res.sendStatus(400).send({message:"Invalid Link"});
    const token=await Token.findOne({token:req.params.token});
    if(!token)
    {
     res.sendStatus(400).send({message:"Invalid Link"});

    }
    console.log(user);
    await localUser.findByIdAndUpdate(user._id,{isverified:true});
    await Token.findByIdAndDelete(token._id);
    res.render('emailverify',{layout:'emailverify'});

  } catch (e) {
      console.error(e);
  }
}
////////////////////////////////////////////////////////////////////////////////

const resend=async (req,res)=>{
  try {
  await Token.findOneAndDelete({userId:req.user._id});

    const token=await new Token({userId:req.user._id,token:crypto.randomBytes(32).toString("hex")}).save();
    const url=`${process.env.BASE_URL}${req.user._id}/verify/${token.token}`;
    await sendEmail(req.user.email,"Verify Email",url,'verify your email');
    res.render('locallogin',{layout:'locallogin',sucessmsg:"An E-mail send to your account please verify "});

  } catch (e) {
    console.error(e);

  }

}
////////////////////////////////////////////////////////////////////////////////
const forgetPassword=async (req,res)=>{
  res.render('forgetpassword',{layout:'locallogin'})

}
////////////////////////////////////////////////////////////////////////
const recoverPassword=async (req,res)=>{
  try {

    const user=await localUser.findOne({email:req.body.email});
    if (user) {
      await Token.findOneAndDelete({userId:user._id});
      const token=await new Token({userId:user._id,token:crypto.randomBytes(32).toString("hex")}).save();
      const url=`${process.env.BASE_URL}${user._id}/resetpassword/${token.token}`;
      await sendEmail(req.body.email,"Verify Email",url,'reser your password');
      res.render('locallogin',{layout:'locallogin',sucessmsg:"An E-mail send to your account please verify "});
    }
    else {
      res.render('forgetpassword',{layout:'locallogin',msg:"this Email Not exceed"});

    }


  } catch (e) {
    console.error(e);

  }
}
/////////////////////////////////////////////////////////////////
const resetPasswordEmail= async(req,res)=>{
  try {
    const user=await localUser.findById(req.params.id);
    if(!user) res.sendStatus(400).send({message:"Invalid Link"});
    const token=await Token.findOne({token:req.params.token});
    if(!token)
    {
     res.sendStatus(400).send({message:"Invalid Link"});

    }
    await Token.findByIdAndDelete(token._id);
    res.render('resetpassword',{layout:'locallogin',userId:req.params.id,sucessmsg:"Email verified You can change password now!"});

  } catch (e) {
      console.error(e);
  }
}
/////////////////////////////////////////////////////////////////
const setNewPassword=async (req,res)=>{
  if(req.body.password===req.body.password2)
  {
    if(req.body.password.length<=6)
    {
      res.render('resetpassword',{layout:'locallogin',userId:req.body.id,msg:'passwords should be more than 6 characters'});

    }
    try {
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(req.body.password, salt);

       await localUser.findByIdAndUpdate(req.body.id, { password: hashedPassword });
       res.render('locallogin', { layout: 'locallogin', userId: req.body.id, sucessmsg: 'Your Password has been changed successfully' });
     } catch (error) {
       console.error(error);
     }


}
else{
  res.render('resetpassword',{layout:'locallogin',userId:req.body.id,msg:'passwords should match'});

}


}
////////////////////////////////////////////////////////////////////////////////
const getProfile=async (req,res)=>{
  const local =await localUser.findById(req.user.id);
  const google =await User.findById(req.user.id);

  let image=null;
  if(local )image=local.image;
  if(google) image=google.image;
 res.render('profile',{bio:req.user.bio,firstName:req.user.firstName,lastName:req.user.lastName,email:req.user.email||"google",image:`uploads/${image.data}`,local});


}
////////////////////////////////////////////////////////////////////////////////
const updateProfile=async (req,res)=>{
  const local=await  localUser.findById(req.user.id);
  try {
    if(local){
      if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
      else
      {
      await localUser.findByIdAndUpdate(req.user.id,{firstName:req.body.firstName,lastName:req.body.lastName});
      }
    }else {
      const user=await  User.findById(req.user.id);
      if(user)
      {
      await  User.findByIdAndUpdate(req.user.id,{firstName:req.body.firstName,lastName:req.body.lastName});

      }
    }

    res.render('profile',{firstName:req.user.firstName,lastName:req.user.lastName,email:req.user.email||"google",bio:req.user.bio,image:`uploads/${req.user.image.data}`,sucessmsg:"Profile has been updated sucessfully"});

  } catch (e) {
    console.error(e);

  }

}
//////////////////////////////////////////////////////////////////////////////
const updateBio=async (req,res)=>{
  const local=await  localUser.findById(req.user.id);
  try {
    if(local){
      if(local.isverified==false) res.render('checkverified',{layout:'checkverify',msg:'Please verify your Email First'});
      else
      {
      await localUser.findByIdAndUpdate(req.user.id,{bio:req.body.bio});
      }
    }else {
      const user=await  User.findById(req.user.id);
      if(user)
      {
      await  User.findByIdAndUpdate(req.user.id,{bio:req.body.bio});

      }
    }

    res.render('profile',{bio:req.body.bio,firstName:req.user.firstName,lastName:req.user.lastName,email:"google",image:`uploads/${req.user.image.data}`,sucessmsg:"Bio has been updated sucessfully"});

  } catch (e) {
    console.error(e);

  }

}
/////////////////////////////////////////////////////////////////////////////
const updatePassword=async (req,res)=>{
  const local =localUser.findById(req.user.id);
  if (local) {
      const match= await bcrypt.compare(req.body.curpassword,req.user.password);
      if(match)
      {
        if(req.body.password===req.body.password2)
        {
          if(req.body.password.length<=6)
          {
          res.render('profile',{firstName:req.user.firstName,lastName:req.user.lastName,email:req.user.email||"google",bio:req.user.bio,image:`uploads/${req.user.image.data}`,msg:'passwords should be more than 6 characters'});

          }
          else{
            try {

             user= new localUser(req.body);
             //bcrpy password
          const salt=   await bcrypt.genSalt(10)
          const hash= await bcrypt.hash(req.body.password,salt);
          await localUser.findByIdAndUpdate(req.user.id,{password:hash});
          res.render('profile',{firstName:req.user.firstName,lastName:req.user.lastName,email:req.user.email||"google",bio:req.user.bio,image:`uploads/${req.user.image.data}`,sucessmsg:"Password has been changed sucessfully"});


          } catch (e) {
            console.error(e);
          }}


      }


  }
  else{
    res.render('profile',{firstName:req.user.firstName,lastName:req.user.lastName,email:req.user.email||"google",bio:req.user.bio,image:`uploads/${req.user.image.data}`,msg:'Current password should be correct'});

  }




}
}
const uploadImage=async (req,res)=>{
  upload(req,res,async (err)=>{
    if(err) res.render('profile',{msg:err});
    else
    {
    const local= await  localUser.findById(req.user.id);
if(local)
{
// console.log(req.file.mimetype);
  await  localUser.findByIdAndUpdate(req.user.id,{image:{contentType:req.file.mimetype,data:req.file.filename}});

}
else {
  await  User.findByIdAndUpdate(req.user.id,{image:{contentType:req.file.mimetype,data:req.file.filename}});

}
}
      res.render('profile',{sucessmsg:'File Uploaded sucessfully!',firstName:req.user.firstName,lastName:req.user.lastName,email:req.user.email||"google",bio:req.user.bio,image:`uploads/${req.file.filename}`});
      console.log(req.file);

    }

)
}
module.exports={
  yourDashboard,
  login,
  logout,
  Register,
  loginPost,
  verifyEmail,
  resend,
  forgetPassword,
  recoverPassword,
  setNewPassword,
  resetPasswordEmail,
  getProfile,
  updateProfile,
  updatePassword,
uploadImage,
updateBio
}
