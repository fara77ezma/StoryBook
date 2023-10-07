const googleStrategy =require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");

const mongoose =require('mongoose');
const User =require('../models/User');
const localUser = require('../models/localUser');

module.exports= function(passport){
  passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'https://story-book-0prn.onrender.com/auth/google/callback',
    // callbackURL:'http://localhost:3000/auth/google/callback'

  },async (acessToken,refreshToken,profile,done)=>{
     const user=new User({
       googleId:profile.id,
       displayName:profile.displayName,
       firstName:profile.name.givenName,
       lastName:profile.name.familyName,
       image:{
         data:'defualt.jfif',
         contentType:'image/jfif'
       },
       bio:" "
     });
     try {
        user1=await  User.findOne({googleId:profile.id});
       if(user1) {
         done(null,user1);
       }
       else {
        uaer= await user.save();
         done(null,user);
       }
     } catch (e) {
       console.error(e);

     }
  }
))

passport.use(new localStrategy({
  usernameField: 'email',
  passReqToCallback: true // for using req.flash
}, async (req,email, password, done) => {
  try {
    // Attempting to find a user with the provided email
    const user = await localUser.findOne({ email });

    if (user) {
      await  bcrypt.compare(password,user.password,(err,isMatch)=>{
        if(err) console.error(err);
        if(isMatch)   done(null, user);
        else   {
           req.flash('error', 'Incorrect Email or Password');
           done(null, false);
         }
        })

    } else {
      // If no user is found with the provided email, return false
      req.flash('error', 'Incorrect Email or Password');
      done(null, false);
    }
  } catch (e) {
    // Handle any potential errors
    console.error(e);
  }
}));

passport.serializeUser((user,done)=>{
  done(null,user.id);
});


passport.deserializeUser((id,done)=>{


  User.findById(id)
  .then(user=>{
    if(!user )
    {
      localUser.findById(id)
        .then(user1 => {
          if(!user1) done(null,false);
          else done(null, user1); // User found
        })
        .catch(err => done(err, null)); // Error occurred
    }
    else  done(null,user);

  })
  .catch(err=>done(err,null));
});
}
