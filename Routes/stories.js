const express=require('express');
const router=express.Router();
const storiesController=require('../controllers/storiesController');
const {ensureAuth}=require('../midleware/auth');


router.get('/add',ensureAuth,(req,res)=>{res.render('stories/add');});
router.post('/',ensureAuth,storiesController.addNewStory);
router.get('/',ensureAuth,storiesController.showPublicStories);
router.get('/edit/:id',ensureAuth,storiesController.editStory);
router.get('/:id',ensureAuth,storiesController.showStory);
router.put('/:id',ensureAuth,storiesController.updateStory);
router.delete('/:id',ensureAuth,storiesController.deleteStory);
router.get('/user/:userId',ensureAuth,storiesController.showUserStories);
router.get('/search/:query',ensureAuth,storiesController.searchByTitle)
router.get('/delete/:id',ensureAuth,storiesController.sureWantDelete);


module.exports=router;
