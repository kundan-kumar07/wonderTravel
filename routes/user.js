const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, savedRedirectUrl } = require("../middleware.js");
const { renderSignup, signup, renderLogin, login, logout } = require("../controllers/users.js");

// Signup route
router.route("/signup")
  .get(renderSignup)  // GET: Render signup form
  .post(signup);      // POST: Handle signup

// Login route
router.route("/login")
  .get(renderLogin)  // GET: Render login form
  .post(
    savedRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    login
  );  // POST: Handle login

// Logout route
router.get("/logout", logout);

module.exports = router;
