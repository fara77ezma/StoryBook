const express=require('express');
const router=express.Router();
const indexController=require('../controllers/indexController');

const {ensureAuth,ensureGuest}=require('../midleware/auth');
router.get('/',ensureGuest, indexController.login);
router.get('/login',ensureGuest,indexController.login);
router.post('/login',ensureGuest,indexController.loginPost);

router.get('/register',ensureGuest,(req,res)=>{res.render('register',{layout:'register'})});
router.put('/register',ensureGuest,indexController.Register);
router.get('/dashboard',ensureAuth,indexController.yourDashboard);
router.get('/:id/verify/:token',indexController.verifyEmail);
router.get('/resend',indexController.resend);
router.get('/forget-password',indexController.forgetPassword);
router.post('/sendemailforpassword',indexController.recoverPassword);
router.get('/:id/resetpassword/:token',indexController.resetPasswordEmail);
router.post('/newpassword',indexController.setNewPassword);
router.get('/profile',indexController.getProfile);
router.put('/updateprofile',indexController.updateProfile);
router.put('/updatepassword',indexController.updatePassword);
router.post('/upload',indexController.uploadImage);
router.put('/bio',indexController.updateBio);

module.exports=router;
