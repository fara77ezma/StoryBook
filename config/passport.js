const googleStrategy =require('passport-google-oauth20').Strategy;

const mongoose =require('mongoose');
const User =require('../models/User');

module.exports= function(passport){
  passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'https://storyybook.onrender.com/auth/google/callback'
  },async (acessToken,refreshToken,profile,done)=>{
     const user=new User({
       googleId:profile.id,
       displayName:profile.displayName,
       firstName:profile.name.givenName,
       lastName:profile.name.familyName,
       image:profile.photos[0].value,

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
passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id)
  .then(user=>done(null,user))
  .catch(err=>done(err,user));
});
}
