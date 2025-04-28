const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.createSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create new user instance
    const newUser = new User({ email, username });

    // Register user with hashed password
    const registeredUser = await User.register(newUser, password);

    // Log in the user automatically after signup
    // req.login(registeredUser, (err) => {
    //   if (err) return next(err);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Home Page!");
      res.redirect("/listings");
    });

    // });
  } catch (err) {
    req.flash("failure", err.message); // Show error message (e.g., duplicate username)
    res.redirect("/signup"); // Redirect back to signup page
  }
};


module.exports.login = async (req, res) => {
  console.log(req.flash("error"));
  req.flash("success", "✅ Welcome back! You are successfully logged in.");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "✅ You have been logged out.");
    res.redirect("/listings");
  });
};
