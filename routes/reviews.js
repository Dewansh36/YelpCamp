const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('../joischemas');
const campGround = require('../models/campgrounds');
const Review = require('../models/review');
const isLoggedIn = require('../utils/checklogin');
const { func } = require('joi');
const reviews = require('../controller/review');
const validate = require('../utils/validate');
const checkAuthor = require('../utils/checkAuthor');

router.post('/', isLoggedIn, validate.review, wrapAsync(reviews.postReview));

router.delete('/:rid', isLoggedIn, checkAuthor.review, wrapAsync(reviews.deleteReview));

module.exports = router;