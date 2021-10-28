const Joi = require('joi');

const campgroundSchema = Joi.object(
    {
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.array().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }
);

const reviewSchema = Joi.object(
    {
        body: Joi.string().required(),
        rating: Joi.number().required().min(1)
    }
);

module.exports = {
    campgroundSchema: campgroundSchema,
    reviewSchema: reviewSchema
};