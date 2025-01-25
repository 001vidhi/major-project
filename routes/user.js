const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { savedRedirectUrl } = require("../middleware.js");


router.get("/signup",(req,res)=>{
  res.render("users/signup.ejs");  
});

router.post("/signup", 
  wrapAsync(async(req,res) => {
  try{
    let {username,email,password} = req.body;  
    const newUser = new User({email,username});
   const registeredUser = await User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
     return  next(err);
    }
    req.flash("success", "welcome to Wanderlust");
   res.redirect("/listings");
   });
   
  }catch(e)
{
  req.flash("error",e.message);
  res.redirect("/signup.ejs");
}

}));
router.get("/login",(req, res)=>{
  res.render("users/login.ejs");
});

router.post('/login', 
  savedRedirectUrl,
  passport.authenticate('local',
     { failureRedirect: '/login' ,
      failureFlash:true}),
  async(req, res)=>{
  req.flash("success","welcome back to Wanderlust! You are logged in !");
  let redirectUrl = res.locals.redirect ||"/listings";
  res.redirect(redirectUrl );
});


router.get("/logout",(req,res,next)=>{
req.logOut((err)=>{
  if(err){
    return next(err);

  }
  req.flash("success","logged you out!");
  res.redirect("/listings");
});
});

module.exports=router;