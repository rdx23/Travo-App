const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Oops! You need to sign in before creating a listing.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "❌ Sorry, the requested listing doesn't exist.");
    return res.redirect("/listings");
  }

  if (!req.user || !listing.owner.equals(req.user._id)) {
    // ✅ Fix: Use req.user
    req.flash("error", "❌ You are not the owner of this listing.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "❌ You must be logged in to perform this action.");
    return res.redirect("/login");
  }

  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "❌ Sorry, the requested review doesn't exist.");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "❌ Sorry, You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

