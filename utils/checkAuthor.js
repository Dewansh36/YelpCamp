const campGround = require('../models/campgrounds');
const Review = require('../models/review');


module.exports.review = async function (req, res, next) {
    let { id, rid } = req.params;
    let review = await Review.findById(rid).populate('author');
    if (req.user != undefined && req.user.id == review.author.id) {
        return next();
    }
    else {
        req.flash('error', 'You are not Authorized to do this!');
        res.redirect(`/campgrounds/${id}`);
    }
}

module.exports.campground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await campGround.findById(id).populate('author');
    // console.log(req.user, campground);
    if (req.user != undefined && campground.author.id == req.user.id) {
        return next();
    }
    else {
        req.flash('error', 'You are not Authorized to do this!');
        res.redirect(`/campgrounds/${id}`);
    }
}
