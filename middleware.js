const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login"); // Prevents further execution
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl || "/listings"; // Ensure it starts with "/"
  delete req.session.redirectUrl; // Remove after use
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
    
    next();
  } catch (err) {
    console.error("Error in isOwner middleware:", err);
    req.flash("error", "Something went wrong");
    res.redirect('/listings');
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;

    if (!id) {
      req.flash("error", "Invalid listing ID");
      return res.redirect("/listings");
    }

    let review = await Review.findById(reviewId);

    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.error("Error in isReviewAuthor middleware:", err);
    
    // Ensure id is defined before using it in res.redirect()
    let redirectUrl = req.params.id ? `/listings/${req.params.id}` : "/listings";
    
    req.flash("error", "Something went wrong");
    res.redirect(redirectUrl);
  }
};
