const { campgroundSchema, reviewSchema } = require('../joischemas');
const ExpressError = require('../utils/ExpressError');

module.exports.review = function (req, res, next) {
    let { error } = reviewSchema.validate(req.body);
    // console.log(error);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    }
    else {
        next();
    }
}
module.exports.campground = function (req, res, next) {
    let { error } = campgroundSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    }
    else {
        next();
    }
}