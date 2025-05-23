const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let allListings;

  if (category) {
    // Fetch listings for the selected category
    allListings = await Listing.find({ category });

    // If no listings are found for the category, show a flash message
    if (allListings.length === 0) {
      req.flash(
        "error",
        `❌ Sorry, no listings found for the category "${category}". Please check again`
      );
      return res.redirect("/listings");
    }
  } else if (search) {
    // Fetch listings that match the search query (case-insensitive)
    allListings = await Listing.find({
      country: { $regex: new RegExp(search, "i") }, // Case-insensitive search
    });

    // If no listings are found for the search query, show a flash message
    if (allListings.length === 0) {
      req.flash(
        "error",
        `❌ Sorry, no listings found for the country "${search}". Please check again`
      );
      return res.redirect("/listings");
    }
  } else {
    // Fetch all listings if no category or search query is selected
    allListings = await Listing.find({});
  }

  // Render the index page with the fetched listings
  res.render("listings/index.ejs", { allListings, search });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // let result = listingSchema.validate(req.body);
  // console.log("Validation Result:", result);
  // if (result.error) {
  //   throw new ExpressError(404, result.error);
  // }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Hotel Created!!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash(
      "error",
      "❌ Sorry, the hotel you requested doesn't exist. Please check again"
    );
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash(
      "error",
      "❌ Sorry, the hotel you requested doesn't exist. Please check again "
    );
    return res.redirect("/listings");
  }

console.log("Listing Data:", listing);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing , originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
  req.flash("success", "Hotel details updated!!");
  res.redirect(`/listings/${id}`); // Fix: Redirect to the updated listing
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Deleted Successfully!!");
  res.redirect("/listings");
};


