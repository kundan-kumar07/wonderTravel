const mongoose = require('mongoose');
const datainit = require("./data.js");  // Ensure correct variable naming
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wondertravel";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
  await Listing.deleteMany({}); // Clear existing data

  // Corrected variable name from initData to datainit
  datainit.data = datainit.data.map((obj) => ({ ...obj, owner: "67bca0d585e999351f0541a8" }));

  await Listing.insertMany(datainit.data);
  console.log("Data was initialized");
};

initDB();
