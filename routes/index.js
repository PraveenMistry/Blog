var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET HOME page Blog Post. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({},{},function(err,posts){
		res.render('index', { "posts": posts,title:'Node Blog' });
	})
});


/* GET Single Blog Post. */
router.get('/show/:id', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({},{},function(err,posts){
		res.render('index', { "posts": posts,title:'Node Blog' });
	})
});



module.exports = router;
