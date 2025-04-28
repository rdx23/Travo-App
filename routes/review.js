const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// Middleware to validate review input
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Fixed typo
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

// Route to create a new review
router.post(
  "/",
  isLoggedIn, // Ensure the user is logged in
  validateReview, // Validate the review input
  wrapAsync(reviewController.createReview)
);

// Route to delete a review
router.delete(
  "/:reviewId",
  isReviewAuthor, // Ensure the user is the author of the review
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
