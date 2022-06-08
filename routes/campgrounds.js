const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/", campgrounds.index);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  campgrounds.createCampground
);

router.get("/:id", isLoggedIn, campgrounds.showCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, campgrounds.renderEditForm);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateCampground,
  campgrounds.updateCampground
);

router.delete("/:id", isLoggedIn, isAuthor, campgrounds.deleteCampground);

module.exports = router;
