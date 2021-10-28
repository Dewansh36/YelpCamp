const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('../joischemas');
const campGround = require('../models/campgrounds');
const Review = require('../models/review');
const isLoggedIn = require('../utils/checklogin');
const campgrounds = require('../controller/campground');
const validate = require('../utils/validate');
const checkAuthor = require('../utils/checkAuthor');
const multer = require('multer')
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.get('/new', isLoggedIn, campgrounds.renderNew);

router.get('/:id/edit', isLoggedIn, wrapAsync(campgrounds.renderEdit));

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('images'), wrapAsync(campgrounds.create));

router.route('/:id')
    .put(isLoggedIn, checkAuthor.campground, upload.array('images'), wrapAsync(campgrounds.edit))
    .get(wrapAsync(campgrounds.show))
    .delete(isLoggedIn, checkAuthor.campground, wrapAsync(campgrounds.delete));


module.exports = router;