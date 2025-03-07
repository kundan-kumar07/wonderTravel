const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const Joi = require("joi");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const { createReview, deleteReview } = require("../controllers/reviews");

// Joi Schema Validation
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});

// Middleware for validating review data
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};

// ✅ Create a Review
router.post("/", isLoggedIn,validateReview, createReview);

// ✅ Delete a Review
router.delete("/:reviewId",isReviewAuthor, isLoggedIn,deleteReview);

module.exports = router;
