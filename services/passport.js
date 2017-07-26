const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
// usernameField: 'email'
// const localLogin = new LocalStrategy({usernameField: 'email'}, function(email, password, done){
// })
let localOptions = {usernameField: 'email'};
let localLogin = new LocalStrategy(localOptions, function(email, password, done){
	console.log("dicksss", email, password);
	User.findOne({email: email}, function(err, user){
		console.log("more dicks")
		// if error in search, reyrun early w/ error
		if(err){
			return done(err);
		}
		// if not error, just user not found
		if(!user){
			return done(null, false);
		}

		// compare passwords--is 'password' = user.password?
		// compare password from req wirh usser's saved psswrd
		user.comparePassword(password, function(err, isMatch){
			// if error, return esrly andd sa err
			if(err){
				return done(err);
			}
			// if not same, it will return false and say didnt match up
			if(!isMatch){
				return done(null, false);
			}
			// if same, xcall passport callback w/ user model
			return done(null, user);
		});
		// we salted the pswrd, and now we need to decode encrypted pw to normal pw
	});
	// othersiwe, call done w/ false 
});


// set up options for jwt strategy
let jwtOptions = {
	// where to get a token from in a req. heere it is staken from header called uathorization
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	// need to get a secret key from a config file
	secretOrKey: config.secret
};

// create jwt strategy
// payload parameter is the decoded jwt token. It corresponds to data gleaned from the createUserToken function in auth.js from sub & iat. That is the payload.
// payload comes from auth createUserToken (grab user id of token then compare if same user searching for, then do verification set)
// plyload is decoded token
let jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	// look through all users and find user with the given
	// pl.s is user id
	User.findById(payload.sub, function(err, user){ 
		// err will be populated if search fails
		if(err){
			return done(err, false);
		}
		// if find user, do done callback. authenticates it
		if(user){
			done(null, user);
		} else {
			// if we cant find user w/ id, call done function without user obj
			// no user obj
			done(null, false);
		}
	});
});
passport.use(jwtLogin);
passport.use(localLogin);