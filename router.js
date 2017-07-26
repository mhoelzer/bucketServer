// has all routes that will be hit to send users plaes
// directs data to send to controlers, but first need to send data
const Auth = require('./controllers/auth');
// const User = require('./models/user');
const BucketList = require('./controllers/bucketlistcontroller');
const passportService = require('./services/passport');
const passport = require('passport');

// By default the .authenticate method above wants to make a cookie. Since we’re using jwt, we don’t want a cookie. Hence, we set the first parameter to ‘jwt’ and the second to this: {session: false}. 
const requireAuth = passport.authenticate('jwt', {session: false});
// authenticate needs 2nd parameter, so put false
const requireSignin = passport.authenticate('local', {session: false});

// the app will refer to the express from the index.js
module.exports = function(app){
	// app.get('/', function(req, res){
	// 	res.send("hhhhheyeyeyeyeyooooooo")
	// })
	app.get('/', requireAuth, function(req, res){
		// res.send("hhhhheyeyeyeyeyooooooo")
		res.send({message: 'yohoho'})
	})

	// Auth is considered an object b/c of the . notation
	app.post('/signup', Auth.signup)
	app.post('/signin', requireSignin, Auth.signin);
	// requireAuth is going to make sure that the post goes through passport and the JWT token gets checked
	//  last parameter calls the addBucketList function on the BucketList variable. This will allow us to save our new post to the db. 
	app.post('/newitem', requireAuth, BucketList.addBucketList);
	app.get('/items', requireAuth, BucketList.fetchBucketLists);
	app.get('/items/:id', requireAuth, BucketList.fetchBucketList);
	app.put('/items/:id', requireAuth, BucketList.updateBucketList);
	app.delete('/items/:id', requireAuth, BucketList.deleteBucketList);
}