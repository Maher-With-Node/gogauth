const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const mongoose = require('mongoose');

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser((id, done) => {
User.findById(id).then((user) => {
done(null, user);
});
});
//424572440393-pf1t91avb2s27642bn9psqv94l3soaav.apps.googleusercontent.com
//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
passport.use(
new GoogleStrategy({
// options for google strategy
clientID: '780391168365-rk24hn993p5vosr3b494j71bpranuegr.apps.googleusercontent.com',
clientSecret:'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',
callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
// check if user already exists in our own db
User.findOne({googleId: profile.id}).then((currentUser) => {
if(currentUser){
// already have this user
console.log('user is: ', currentUser);
done(null, currentUser);
} else {
// if not, create user in our db
new User({
_id: new mongoose.Types.ObjectId(),
googleId: profile.id,
name: profile.displayName,
email:profile._json.email
}).save().then((newUser) => {
console.log('created new user: ', newUser);
done(null, newUser);
});
}
});
})
);