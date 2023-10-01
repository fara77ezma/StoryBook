const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');




// Load our config file
dotenv.config({ path: './config/config.env' });
require('./config/passport')(passport);

//session midlware(should be above passport midlware)
//body parser for req.body
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//methodOverride
app.use(methodOverride((req,res)=>{
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
     // look in urlencoded POST bodies and delete it
     var method = req.body._method
     delete req.body._method
     return method
   }}
   )
   );
// Connect to MongoDB
connectDB();

app.use(session({
  secret:'anything you want to put here',
  resave :false, //don't save if nothing modified
  saveUninitialized:false, //don't save if nothing happened

  store: MongoStore.create({mongoUrl:process.env.MONGO_URI}),
  cookie: { maxAge: 3600000 }// This is also set to 1 hour in milliseconds
}))
//passport midlware
app.use(passport.initialize());
app.use(passport.session());

//global vars
app.use((req,res,next)=>{
  res.locals.user=req.user||null;
  res.locals.localuser=req.user||null;

  next();
})
//static folders
app.use(express.static('./public'));
//Handelbars helpers
const {formatDate,truncate,stripTags,editIcon,select}=require('./helpers/hbs');
// Handlebars
app.engine('.hbs', exphbs.engine({ helpers:{
  formatDate
  ,truncate
  ,stripTags
  ,editIcon
  ,select
  ,getImageUrl: function(data) {
     return `/uploads/${data}`
   },

},extname: '.hbs', defaultLayout: "main"}));
app.set('view engine', '.hbs');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/', require('./Routes/index'));
app.use('/auth', require('./Routes/auth'));
app.use('/stories', require('./Routes/stories'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running in ${process.env.NODE_ENV} Mode on Port ${PORT}`));
