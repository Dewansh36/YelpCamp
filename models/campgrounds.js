const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review');
const User=require('./user');

const imageSchema=new Schema(
    {
        url: String,
        filename: String
    }
);
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

imageSchema.virtual('indexThumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_400');
});

const opts={ toJSON: { virtuals: true } };

const campGroundSchema=new Schema(
    {
        title: {
            type: String,
            required: true
        },
        images: [imageSchema],
        geometry: {
            type:
            {
                type: 'String',
                enum: ['Point'],
                required: true
            },
            coordinates:
            {
                type: [Number],
                required: true,
            }
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    }, opts
);

campGroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campgrounds/${this.id}">${this.title}</a><p><strong>${this.location}</strong></p>`;
});
campGroundSchema.post('findOneAndDelete', async (data) => {
    if (data) {
        await Review.remove(
            {
                _id: {
                    $in: data.reviews
                }
            }
        )
    }
});

const campGround=new mongoose.model('campGround', campGroundSchema);

module.exports=campGround;