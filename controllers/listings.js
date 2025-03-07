const Listing=require('../models/listing');
module.exports.index= async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewform=(req, res) => {
 
  res.render("listings/new.ejs");
};

module.exports.createListing=async (req, res, next) => {
  try {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..".filename) 

    console.log("📩 Received Data:", req.body);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash('success','New listing created');
    console.log("Listing Saved:", newListing);
    res.redirect(`/listings`);
  } catch (err) {
    console.error("Error saving listing:", err);
    next(err);
  }
};

module.exports.showListing=async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path:"reviews",
      populate:{
        path:"author"
      },
      
    }).populate("owner");
    if (!listing){
      req.flash("error","Listing you requested does not exist");
      res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }
}

module.exports.editListing=async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
      req.flash("error","Listing you requested does not exist");
      res.redirect('/listings');
    }
    if (!listing) throw new ExpressError("Listing Not Found", 404);
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    next(err);
  }
}

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
      runValidators: true,
    });

    if (!updatedListing) {
      throw new ExpressError("Listing Not Found", 404);
    }

    if (req.file) {
      updatedListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
      await updatedListing.save();
    }

    req.flash('success', 'Listing updated');
    console.log("Listing updated:", updatedListing);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    next(err);
  }
};


module.exports.deleteListing=async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash('success','Listing deleted');
    if (!deletedListing) throw new ExpressError("Listing Not Found", 404);
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
}