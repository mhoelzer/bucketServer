// We’re taking data off of the request, storing it in a variable. Using the variable to create a new object whose keys match the model. Then, we’re saving that object to the database. For the response, we get the object back.

var BucketList = require('../models/bucketlist.js');

exports.addBucketList = function(req, res, next){
	// for postman use
	// var title = req.body.title;
	// console.log(req.body.props)
	var title = req.body.props.title;
	var topic = req.body.props.topic;
	var url = req.body.props.url;
	var content = req.body.props.content;
	// Mongo queries are much easier with an underscore before _id
	var specificUser = req.user._id;

	var bucketList = new BucketList({
		title: title,
		topic: topic,
		url: url,
		content: content,
		specificUser: specificUser
	});

	bucketList.save(function(err){
		if(err) {
			return next(err); 
		}
		res.json(bucketList);
	});
}


//Gets specific bucket list
exports.fetchBucketList = function(req, res){
	// We are creating the specificUser variable here to store the id of the incoming request. 
	// var specificUser = req.user._id;
	var specificBucketList = req.params.id;
	// We’re putting that variable as the value in the find parameter, along with the specificUser key which matches up to the Mongoose model. The .find function is a Mongoose function. We are searching for any items that correspond to a specific user.
	// BucketList.find({specificUser: specificUser})
	BucketList.findOne({_id: specificBucketList})
	.then(
		function fetchSuccess(data){
			res.json(data);
		},
		function fetchError(err){
			res.send(500, err.message)
		}
	);
}


//Gets all bucket lists
exports.fetchBucketLists = function(req, res){
	// We are creating the specificUser variable here to store the id of the incoming request. 
	var specificUser = req.user._id;
	// We’re putting that variable as the value in the find parameter, along with the specificUser key which matches up to the Mongoose model. The .find function is a Mongoose function. We are searching for any items that correspond to a specific user.
	BucketList.find({specificUser: specificUser})
	.then(
		function fetchSuccess(data){
			res.json(data);
		},
		function fetchError(err){
			res.send(500, err.message)
		}
	);
}

exports.deleteBucketList = function(req, res){
	var specificBucketList = req.params.id;
	BucketList.remove({_id: specificBucketList})
		.then(
			function deleteSuccess(data){
				res.json(data);
			},
			function deleteError(err){
				res.send(500, err.message);
			}
		);
}

exports.updateBucketList = function(req, res){
	var specificBucketList = req.params.id;
	BucketList.findById(specificBucketList, function(err, bucketlistUpdate){
		if(err){
			res.status(500, err.message)
		} else {
			bucketlistUpdate.title = req.body.props.title;
			bucketlistUpdate.topic = req.body.props.topic;
			bucketlistUpdate.url = req.body.props.url;
			bucketlistUpdate.content = req.body.props.content;
			bucketlistUpdate.save(function(err, bucketlist){
				if(err){
					res.status(500, err.message)
				}
				res.send(bucketlist);
			});
		};
	});
}