const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Joi = require("joi");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer=require('multer');
const {storage}=require('../cloudConfig.js')
const upload=multer({storage})

// JOI Validation Schema
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null),
  }).required(),
});

// Route for listing index and creating a new listing
router.route("/")
  .get(listingController.index)  // GET: List all listings
  .post(isLoggedIn, upload.single('listing[image]'), listingController.createListing);  // POST: Create a listing


// Route to render the form for creating a new listing
router.get("/new", isLoggedIn, listingController.renderNewform);

// Routes for a specific listing (Show, Update, Delete)
router.route("/:id")
  .get(listingController.showListing)  // GET: Show listing details
  .put(isLoggedIn, isOwner ,upload.single('listing[image]'), listingController.updateListing)  // PUT: Update listing
  .delete(isLoggedIn, isOwner, listingController.deleteListing);  // DELETE: Remove listing

// Route to render the edit form
router.get("/:id/edit", isLoggedIn, isOwner, listingController.editListing);



module.exports = router;
