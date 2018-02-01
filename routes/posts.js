var express = require('express');
var path = require('path');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');
// var upload =multer({dest:'./uploads'});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.'+path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })


/* GET users listing. */
router.get('/add', function(req, res, next) {
	var categories = db.get('categories');
	categories.find({},{},function(err,categories){
		res.render('addpost', { 'title': 'Add Post', 'categories':categories});
	})
});

router.get('/show/:id',function(req,res,next){
	var posts  = db.get('posts');
	posts.findById(req.params.id,function(err,post){
		res.render('singlepost',{'title':req.params.id,'post':post});
	});
});


router.post('/add',upload.single('postimage'), function(req, res, next) {
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();

  	if(req.file){
	  	var fileName = req.file.filename;
	  	var url = req.file.destination;
	  	var type = req.file.mimetype;
	}
	else{
		var fileName = "dummy.jpg";
	  	var url = "./uploads";
	  	var type = "ïmage/jpg";
	}

	req.checkBody('title','Title Field is required').notEmpty();
	req.checkBody('body','Body Field is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			'errors':errors,
			'title':title,
			'body':body
		});
	}
	else{
		var posts = db.get('posts');

		posts.insert({
			"title":title,
			"body":body,
			"category":category,
			"date":date,
			"author":author,
			"fileName":fileName,
			"url":url,
			"type":type
		},function(err,post){
			if(err){
				console.log('issue');
				res.send('There was an issue submitting the post');
			}
			else{
				req.flash('success','Post Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


// Add Comment 

router.post('/add/comment',upload.single('postimage'), function(req, res, next) {
  
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid;
	var comment_date = new Date();

	console.log(postid);

	req.checkBody('name','Name Field is required').notEmpty();
	req.checkBody('email','Email Field is required').notEmpty();
	req.checkBody('email','Email Not Valid').isEmail();
	req.checkBody('body','Body Field is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			'errors':errors,
			'name':name,
			'email':email,
			'body':body
		});
	}
	else{

		var comment = {'name':name,'email':email,'body':body,'comment_date':comment_date};

		var posts = db.get('posts');

		posts.update({
			"_id": postid
		},
		{
			$push:{
				"comments":comment
			}
		},function(err,post){
			if(err){
				console.log('issue');
				res.send('There was an issue adding the comment');
			}
			else{
				req.flash('success','Comment Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});





module.exports = router;
