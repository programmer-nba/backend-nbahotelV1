var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cor = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
////
const indexRouter = require('./routes/index');
////
process.env.TZ='UTC'
var app = express();
//เชื่ิอมdatabase
const urldatabase =process.env.ATLAS_MONGODB
mongoose.Promise = global.Promise
mongoose.connect(urldatabase).then(()=>console.log("connect")).catch((err)=>console.error(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cor())
//router
const prefix = '/v2/nba-hotel'
app.use(prefix+'/', indexRouter);
app.use(prefix+'/signup',require('./routes/signup'))
app.use(prefix+'/signin',require('./routes/signin'))
app.use(prefix+'/signout',require('./routes/signout'))
app.use(prefix+'/admin',require('./routes/admin'))
app.use(prefix+'/partner',require('./routes/partner'))
app.use(prefix+'/member',require('./routes/member'))
app.use(prefix+'/hotel',require('./routes/hotel'))
app.use(prefix+'/room',require('./routes/room'))
app.use(prefix+'/booking',require('./routes/booking'))
app.use(prefix+'/checkin',require('./routes/checkin'))
app.use(prefix+'/payment',require('./routes/payment'))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // หรือกำหนด origin ที่เฉพาะเจาะจง
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
const port = process.env.PORT || 4444;
app.listen(port, console.log(`Listening on port ${port}`));
