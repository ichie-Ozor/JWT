const jwt = require('jsonwebtoken')
const User = require('../Model/User')

const requireAuth = (req, res, next) => {
   //grab the token from the cookies
   const token = req.cookies.jwt;
   console.log(token, 'here')
   //check if the token exist
   if(token) {
     //if the token exist, we verify it
     jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
        if(err) {
            console.log(err.message, "see am")
            res.redirect('/login')
        } else {
            console.log(decodedToken, "na here")
            next()
        }
     })  //note that the sentence 'net ninja secret' is the jwt secret key which we used to create it and is very important 
   } else {
    res.redirect('/login')
   }
}

//check current user
const checkUser = (req, res, next) => {
   
  const token = req.cookies.jwt
  if(token){
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if(err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else{
        console.log(decodedToken, "here");
        let user = await User.findById(decodedToken.id)
        res.locals.user = user;
        next()
      }
    })
  } else{
    res.locals.user = null;
    next();
  }
}
module.exports = { requireAuth, checkUser };