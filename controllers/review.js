const Listing = require("../models/listing");
const Review  = require("../models/review");

module.exports.createReview = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Assign the logged-in user as the author
    listing.reviews.push(newReview);

    await newReview.save(); // Save the new review
    await listing.save(); // Update the listing with the new review

    req.flash("success", "New Review Created!!");
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing page
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review from listing's reviews

  // Delete the review
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!!");
  res.redirect(`/listings/${id}`); // Redirect to the listing page after deletion
};