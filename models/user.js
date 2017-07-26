// dont have to use mongoose for a mongo project like this b/c will organize itself
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let userSchema = new Schema({
	email:{
		type: String,
		// boolean
		unique: true,
		// when saved into db, saved as lowercase format
		lowercase: true
	},
	password: String
});

// before osmething gets saved in our Schema, this is where we catch passwords and encrypt them
userSchema.pre('save', function(next){
	// append to this user var
	let user = this;
	// starts making out long string of text. the 10 is how many cycles goes through to do thing. the salt is outcome of first thing/the 10. 
	bcrypt.genSalt(10, function(err, salt){
		if(err){
			// go to next thing and show error
			return next(err);
		}
		// take user password and make sure the string/u.p works, and salt is 10 narrations up there, and null means there is a 4th argument but we dont really need/is a filler (so take out), and the callback (after finish all parameters, catch any errors or do hash)
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err){
				return next(err);
			}
			// could make this hash w/e as long as matches above
			user.password = hash;
			// just continue on with the hashed password
			next();
		})
	})
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
	//this.password is our hashed and salted password
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		// if error, return to callbck w/ error
		if(err){
			return callback(err);
		}
		// otherwise, call the callback
		callback(null, isMatch);
	});
}

// tabel name is user and uses userSchema as outline
let model = mongoose.model('user', userSchema)
// what will be returned to us is the model, so when saved data, we can pass the model
// show what model looks like then do the operations
module.exports = model;