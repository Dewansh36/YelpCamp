require('dotenv').config();

// console.log(process.env.cloudinary_cloud_name, process.env.cloudinary_key);



const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodoverride=require('method-override');
const ejsmate=require('ejs-mate');
const Joi=require('joi');
const flash=require('connect-flash');
const passport=require('passport');
const localStrat=require('passport-local');
const User=require('./models/user');
const cloudinary=require('cloudinary').v2;
const { CloudinaryStorage }=require('multer-storage-cloudinary');
const session=require('express-session');
const MongoStore=require('connect-mongo');

const mongoSanitize=require('express-mongo-sanitize');
const db_url=process.env.db_url||'mongodb://localhost:27017/YelpCamp';
const secret=process.env.db_secret||'thisisbestsecret';
// console.log(db_url);

async function main() {
    await mongoose.connect(db_url);
};

main()
    .then(() => {
        console.log('Connected!');
    })
    .catch((err) => {
        console.log('Error in Connection!');
        console.log(err);
    });

app.use(mongoSanitize());

const path=require('path');

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.use(methodoverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));



const store=new MongoStore(
    {
        mongoUrl: db_url,
        secret: secret,
        touchAfter: 24*3600
    }
);

store.on('error', function (e) {
    console.log(e);
});

const sessionConfig=
{
    name: 'shhh',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie:
    {
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
        // secure: true,
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.user=req.user;
    next();
});



app.get('/', (req, res) => {
    res.render('campgrounds/home.ejs');
});


const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');
const { options }=require('joi');

app.use('/campgrounds', campgroundRoutes);

//Reviews 

app.use('/campgrounds/:id/review', reviewRoutes);

app.use('/', userRoutes);


// app.get('*', (req, res, next) => {
//     return next(new ExpressError('Page Not Found', 404));
// });

app.use((err, req, res, next) => {
    let { status=500 }=err;
    // console.log(err);
    res.status(status).render('error', { err });
});

app.listen(3000, () => {
    console.log('Listning on port 3000');
});