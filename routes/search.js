const express = require("express");
const Listing = require("../models/listing"); // Import your Listing model
const router = express.Router();

// Search Route
router.get("/search", async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.redirect("/listings"); // Redirect if no location is entered
        }

        // Search for listings where the 'location' field matches the input
        const listings = await Listing.find({ location: { $regex: location, $options: "i" } });

        res.render("listings/index", { listings, searchQuery: location }); // Render results
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
