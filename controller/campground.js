const express=require('express');
const campGround=require('../models/campgrounds');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mbxtoken=process.env.mapbox_token;

const geoCoder=mbxGeocoding({ accessToken: mbxtoken });

module.exports.index=async (req, res) => {
    const campgrounds=await campGround.find();
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNew=(req, res) => {
    res.render('campgrounds/new')
}

module.exports.create=async (req, res, next) => {

    const geoData=await geoCoder.forwardGeocode(
        {
            query: req.body.location,
            limit: 1
        }
    ).send();
    req.flash('success', 'Succesfully created a new Campground!!');
    const campground=new campGround(req.body);
    campground.price=parseInt(req.body.price);
    campground.author=req.user.id;
    campground.geometry=geoData.body.features[0].geometry;
    for (file of req.files) {
        let obj={
            url: file.path,
            filename: file.filename
        }
        campground.images.push(obj);
    }
    await campground.save();
    // res.send(campground);
    res.redirect(`/campgrounds/${campground.id}`);
    // // res.send(req.body);
    // // console.log(parseInt(req.body.price));
}

module.exports.renderEdit=async (req, res, next) => {
    let { id }=req.params;
    const campground=await campGround.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot Find the required Campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.edit=async (req, res, next) => {
    let { id }=req.params;
    console.log(req.body, req.files);
    let campground=await campGround.findByIdAndUpdate(id, req.body);
    for (file of req.files) {
        let obj={
            url: file.path,
            filename: file.filename
        }
        campground.images.push(obj);
    }
    if (req.body.deleteImages) {
        for (let img of req.body.deleteImages) {
            for (let i=0; i<campground.images.length; i++) {
                if (campground.images[i].filename==img) {
                    campground.images.splice(i, 1);
                    break;
                }
            }
        }
        await campground.save();
    }
    req.flash('success', `Successfully edited ${req.body.name} Campground`);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.show=async (req, res, next) => {
    let { id }=req.params;
    const campground=await campGround.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot Find the required Campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.delete=async (req, res, next) => {
    req.flash('success', 'Succesfully deleted the Campground!');
    let { id }=req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}