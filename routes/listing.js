const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Middleware to val  idate listing data
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

// 📌 Route for Listing Index & Creation
router
  .route("/")
  // GET: Fetch all listings
  .get(wrapAsync(listingController.index))
  // POST: Create a new listing (Requires login & validation)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// 📌 Route to Show New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// 📌 Routes for Individual Listings (View, Update, Delete)
router
  .route("/:id")
  // GET: Show a specific listing
  .get(wrapAsync(listingController.showListing))
  // PUT: Update an existing listing (Requires owner permissions & validation)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // DELETE: Remove a listing (Requires owner permissions)
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// 📌 Route to Show Edit Form for a Listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
