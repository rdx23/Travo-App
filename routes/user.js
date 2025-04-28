const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// 📌 Route for User Signup (GET: Show form, POST: Handle registration)
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.createSignup));

// 📌 Route for User Login (GET: Show form, POST: Authenticate & Login)
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// 📌 Route for User Logout
router.get("/logout", userController.logout);

module.exports = router;
   