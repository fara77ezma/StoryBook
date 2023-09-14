const express=require('express');
const router=express.Router();
const Story=require('../models/Story');

const {ensureAuth}=require('../midleware/auth');

router.get('/add',ensureAuth,(req,res)=>{
  res.render('stories/add');
})
router.post('/',ensureAuth,async (req,res)=>{
  try {
    req.body.user=req.user.id;
    const story=new Story (req.body);
    await story.save();
    res.redirect('/dashboard');

  } catch (e) {
   console.error(e);
   res.redirect('error/500')
  }
})
router.get('/',ensureAuth,async (req,res)=>{
  try {
    const stories=await Story.find({status:'public'})
    .populate('user')//to get user data
    .sort({createdAt:'desc'})
    .lean();
    res.render('stories/index',{stories});

  } catch (e) {
    console.error(e);
    res.render('error/500');

  }

})
router.get('/edit/:id',ensureAuth,async (req,res)=>{

try {
  const story=await Story.findOne({_id:req.params.id})
    .lean();
    if(!story)  res.render('error/404');
    else if(story.user!=req.user.id) redirect('/stories');
    else{
      res.render('stories/edit',{story});
    }

  } catch (e) {
    console.error(e);
    res.render('error/500');

  }})
  router.get('/:id',ensureAuth,async (req,res)=>{

  try {
    const story=await Story.findOne({_id:req.params.id}).populate('user').lean();
      if(!story)  res.render('error/404');
      else res.render('stories/show',{story});
    } catch (e) {
      console.error(e);
      res.render('error/500');

    }})

  router.put('/:id',ensureAuth,async (req,res)=>{

  try {
    const story=await Story.findOne({_id:req.params.id});
      if(!story)  res.render('error/404');
      else if(story.user!=req.user.id) redirect('/stories');
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

    }})

    router.delete('/:id',ensureAuth,async (req,res)=>{

    try {
      const story=await Story.findOne({_id:req.params.id});
        if(!story)  res.render('error/404');
        else if(story.user!=req.user.id) redirect('/stories');
        else{
          await Story.findOneAndDelete({_id:req.params.id});
          res.redirect('/dashboard');
        }

      } catch (e) {
        console.error(e);
        res.render('error/500');

      }})

      router.get('/user/:userId',ensureAuth,async (req,res)=>{
      try {
        const stories=await Story.find({user:req.params.userId,status:'public'})
        .populate('user')//to get user data
        .sort({createdAt:'desc'})
        .lean();
        if(!stories) res.render('error/404');

        res.render('stories/index',{stories});
        } catch (e) {
          console.error(e);
          res.render('error/500');

        }});
        router.get('/search/:query',ensureAuth,async (req,res)=>{
        try {
          const stories=await Story.find({title:req.params.query,status:'public'})
          .populate('user')//to get user data
          .sort({createdAt:'desc'})
          .lean();
          console.log(stories);
          
          if(!stories) res.render('error/404');
           console.log(stories);
          res.render('stories/index',{stories});
          } catch (e) {
            console.error(e);
            res.render('error/500');

          }})

module.exports=router;
