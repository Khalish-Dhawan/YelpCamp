const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch(() => {
    console.log("OH NO ERROR!!");
  });

const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");

const cities = require("./cities");

const { places, descriptors } = require("./seedHelpers");

const sample = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const rnd = Math.floor(Math.random() * 20) + 10;
    const rand1000 = Math.floor(Math.random() * 1000);
    const campground = new Campground({
      author: "61d4aa93f5a9890094dc5865",
      location: `${cities[rand1000].city} ,${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dhmvva4zm/image/upload/v1633599427/yelpcamp/camp_mo4h3v.jpg",
          filename: "yelpcamp/adocbxx8gpq7n99pqrts",
        },
        {
          url: "https://res.cloudinary.com/dhmvva4zm/image/upload/v1630866401/yelpcamp/iuoeef9blxn5pmgxtadj.jpg",
          filename: "yelpcamp/iuoeef9blxn5pmgxtadj",
        },
      ],
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat id aperiam libero ex! Consequatur alias, sequi fugiat voluptates cupiditate, numquam hic laborum et eos reiciendis eum incidunt quo deserunt omnis.",
      price: rnd,
    });
    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
