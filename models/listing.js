const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");
const { ref, types } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
   url: String,
   filename: String,
  },
  price: Number,
  location: String,
  country: String,

  category: {
  type: String,
  enum: [
    "Castle", "Mountain", "Beach", "Forest", "Winter", 
    "City", "Arctic", "Pool", "Cabin", "Domes", 
    "Lake", "Farm", "Trending" , "Countryside", "Wildlife", "Desert"
  ]
},


  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }

 
});

  

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
