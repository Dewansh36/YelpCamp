const Review = require('../models/review');
const campGround = require('../models/campgrounds');

module.exports.postReview = async (req, res, next) => {

    let campground = await campGround.findById(req.params.id);
    let review = new Review(req.body);
    review.author = req.user.id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `Succesfully added a review to ${campground.title}  Campground`);
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    let { id, rid } = req.params;
    const campground = await campGround.findById(id);
    for (let i = 0; i < campground.reviews.length; i++) {
        if (campground.reviews[i].id === rid) {
            campground.reviews.splice(i, 1);
        }
    }
    req.flash('success', `Succesfully Deleted the review!`);
    await campground.save();
    await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${id}`);
}