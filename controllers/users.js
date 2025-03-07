const passport = require('passport');
const User = require("../models/user");  // ✅ Import User model
const { isLoggedIn, savedRedirectUrl } = require("../middleware.js");

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    
    console.log(registeredUser);
    
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // ✅ Ensure `next` is defined
      }
      req.flash('success', "Welcome to WonderTravel!");
      res.redirect('/listings'); // ✅ Fixed redirect path
    });
  } catch (err) {
    req.flash('error', err.message); // ✅ Show actual error
    res.redirect('/signup');
  }
};

module.exports.renderSignup = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.login = async (req, res) => {
  req.flash('success', 'Welcome back to WonderTravel!');
  res.redirect(res.locals.redirectUrl || '/listings'); // ✅ Safe redirection
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {  // ✅ Ensure callback is present
    if (err) {
      return next(err);  
    }
    req.flash('success', "You are logged out now");
    res.redirect('/listings');
  });
};
