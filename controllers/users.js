const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
res.render("users/signup.ejs");
}

module.exports.signup = async(req, res)=>{
  try{
let {username, email, password} = req.body;
const newUser =  new User({email, username});
const registeredUser = await User.register(newUser, password);
 //console.log(registeredUser);

 req.login(registeredUser, (err)=>{
    if(err){
    return next(err);
    }
    req.flash("success", "Welcome to Wanderlust");
res.redirect("/listings");
 })

  }catch(e){
req.flash("error", e.message);
res.redirect("/signup");

  }
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req, res)=>{
req.flash("success", "Welcome to Wanderlust you are logged in");
res.redirect("/listings");
}

module.exports.logout =  (req, res)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    })
}