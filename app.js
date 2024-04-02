const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoutes.js')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./Middleware/authMiddleware.js');

const app = express();

// middleware
app.use(express.static('public'));   //this helps to render the static files such as html, css which are in the public folder
app.use(express.json())    //this helps to get the data comming from the browser, convert it to a js object and pass it to the neccessary handler
app.use(cookieParser())    //here we are calling the cookie parser which we have imported and invoking it

// view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = 'mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth';
const dbURI = 'mongodb://127.0.0.1:27017/JWT'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);   //this will apply the check middleware to every get request
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoute)

/////cookies
app.get('/set-cookies', (req, res) => {   //this helps to create a cookies and register it at the browser
  // res.setHeader('Set-Cookie', 'newUser=true');  ///this is used to set the header of the cookies where the name is newUser and its value is 'true'
  
  res.cookie('newUser', false)//this helps us to assess a cookie object at the response object. here the name of the cookie is 'newUser'
  res.cookie('isEmployee', true, {maxAge: 1000 * 60 * 60 * 24, secure: true})  //this set the max time for this cookie to last. it also set the secure to be true, i.e it will only be sent when we are on https. This should always be used for production
  res.cookie('isEmployer', true, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true})  //this one set the httpOnly to be true, this means that we cannot asses the cookie in the browser but only through the http protocol between the client and the server not in the frontend javascript. This should always be used for production.

  res.send('you got the cookies!');  //this sends message to the cookies, i.e this is the content of the cookies
})

app.get('/read-cookies', (req, res) => {  //this helps us to read cookies in the browser
  const cookies = req.cookies
  console.log(cookies.newUser)
  res.json(cookies)
})