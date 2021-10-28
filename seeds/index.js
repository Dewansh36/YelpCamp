const mongoose=require('mongoose');
const campGround=require('../models/campgrounds');

const cities=require('./cities');
const descriptors=require('./seedHelpers').descriptors;
const places=require('./seedHelpers').places;

async function main() {
    await mongoose.connect('mongodb://localhost:27017/YelpCamp');
};
main()
    .then(() => {
        console.log('Connected!');
    })
    .catch((err) => {
        console.log('Error in Connection!');
        console.log(err);
    });
function sample(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
};
const seedDB=async () => {
    await campGround.deleteMany({});
    for (let i=0; i<500; i++) {
        const random=Math.floor(Math.random()*1000);
        const camp=new campGround({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random].city, cities[random].state} `,
            images: [
                { "url": "https://res.cloudinary.com/dewansh/image/upload/v1634917456/YelpCamp/wm44lezi9gvsjzfqddib.jpg", "filename": "YelpCamp/wm44lezi9gvsjzfqddib" },
                { "url": "https://res.cloudinary.com/dewansh/image/upload/v1634917455/YelpCamp/h6rxsfuqobmve46rm8nr.jpg", "filename": "YelpCamp/h6rxsfuqobmve46rm8nr" },
                { "url": "https://res.cloudinary.com/dewansh/image/upload/v1634917453/YelpCamp/wfriqjsjjtvlhk4zsqlp.jpg", "filename": "YelpCamp/wfriqjsjjtvlhk4zsqlp" }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem unde molestias nam enim rerum? Aut officiis pariatur, vero odit quam doloremque eum fugit nostrum iure cumque in tempore temporibus cupiditate!',
            price: Math.floor(Math.random()*1000)+2000,
            author: '6171253554478d9484fb9aff',
            geometry: {
                type: "Point",
                coordinates: [cities[random].longitude, cities[random].latitude],
            }
        });
        await camp.save();
    }
}
seedDB();