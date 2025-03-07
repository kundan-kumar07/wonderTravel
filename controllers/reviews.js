 const Listing=require('../models/listing');
 const Review=require('../models/review');
 module.exports.createReview=async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing Not Found");
    }

    const newReview = new Review(req.body.review);
    newReview.author=req.user._id; 
    await newReview.save();
    req.flash('success','New review created');

    listing.reviews.push(newReview);
    await listing.save();

    console.log("✅ Review saved successfully:", newReview);
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error saving review:", err);
    next(err);
  }
}

module.exports.deleteReview=async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted');

    console.log(`Review ${reviewId} deleted successfully`);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error deleting review:", err);
    next(err);
  }
}