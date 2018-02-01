var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.render('addcategories', { title: 'Add Category' });
});


/* GET Category view . */
router.get('/show/:category', function(req, res, next) {
  	var posts  = db.get('posts');
	posts.find({'category':req.params.category},{},function(err,posts){
		res.render('singlecategory',{'title':req.params.category,'posts':posts});
	})
});


router.post('/add', function(req, res, next) {
  	var name = req.body.name;

  	req.checkBody('name','Category Name Field is required').notEmpty();
	var errors = req.validationErrors();

	if(errors){
		res.render('addcategories',{
			'errors':errors,
			'name':name
		});
	}
	else{
		var categories = db.get('categories');

		categories.insert({
			"name":name,
		},function(err,category){
			if(err){
				console.log('issue');
				res.send('There was an issue adding the category');
			}
			else{
				req.flash('success','Category Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});





module.exports = router;
