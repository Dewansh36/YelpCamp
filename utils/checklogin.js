const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.session.returnto = req.originalUrl;
        req.flash('error', 'You must be logged In!');
        res.redirect('/login');
    }
}

module.exports = isLoggedIn;