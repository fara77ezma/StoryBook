const multer = require('multer');
const path = require('path');
//Set storge engine for an profile image
const storage=multer.diskStorage({
  destination:'../public/uploads',
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});
//init upload
const upload= multer({
  storage:storage,
  limits:{fileSize:5000000},
  fileFilter:(req,file,cb)=>{
    check(file,cb);
  }
}).single('myImage');
// check file type
function check(file,cb){
  const fileTypes=/jpeg|jpg|png|gif|jifi/
  const extname= fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype= fileTypes.test(file.mimetype.toLowerCase());
  if(extname && mimetype)
  {
    cb(null,true);
  }else {
    cb('Error: Images Only!');
  }


}
module.exports=upload;
