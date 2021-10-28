const User = require('../models/user');
const passport = require('passport');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.Register = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const user = new User(
            {
                username: username,
                email: email
            });
        const regUser = await User.register(user, password);
        // console.log(regUser);
        req.logIn(regUser, (err) => {
            if (err) {
                req.flash('error', 'Error While Logging In!!');
                res.redirect('/login');
            }
        });
        req.flash('success', 'Welcome to Yelp Camp');
        if (req.session.returnto) {
            res.redirect(req.session.returnto);
        }
        else {
            res.redirect('/campgrounds');
        }
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back!!');
    if (req.session.returnto) {
        res.redirect(req.session.returnto);
    }
    else {
        res.redirect('/campgrounds');
    }
}
module.exports.logout = (req, res) => {
    req.logOut();
    req.session.returnto = null;
    req.flash('success', 'Goodbye See you again!');
    res.redirect('/campgrounds');
}