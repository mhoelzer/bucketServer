// allows user obj to be brought in; the ../ means go up a folder
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config.js')

// hit them right away with a session token√
function createUserToken(user){
	// gives date and time of that date/time in UTC
	let timestamp = new Date().getTime()
	// json webtoekn encodes. make sure you pass in user.id that ets appended and be unique for that id
	// uses plaintex tto encode toekn. makes uniquteness
	return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}


// req is first parameter of the function
exports.signup = function(req, res){
	console.log(req.body)
	// users will handle the req part, so we only need to worry about what we send back
	// res.send("user auth!");
	var email = req.body.email;
	var password = req.body.password;

	
	// if statement that checks if there isnt an email or passowrd
	// since not a function, just gets used as goes down
	if(!email || !password){
		return res.status(418).send({error: 'You need to put in an email and/or password'});
	}

	// findOne allows us to find one instance in db; can do findAll if want all
	// should be checking for email that currently matches
	// funciton is a callback. first is the err/condition, and second is success w/ data we work w/
	// if there is an email there, ...
	User.findOne({email: email}, function(err, existingUser){
		// if some rand err, ...
		if(err){
			return next(err);
		}
		// if there is already a user, ...
		if (existingUser){
			return res.status(418).send('This email is already in use');
		}
		let user = new User({
			// email will be same email as above
			email: email,
			password: password
		});
		// need a token
		user.save(function(err){
			if(err){
				return next(err)
			}
			// first was success:true
			res.json({token: createUserToken(user)})
		})
	})
}
exports.signin = function(req, res, next){
	console.log(req.body);
	// user has already had their emial and pw authorized, so give toekn
	res.send({token: createUserToken(req.user)})
}
