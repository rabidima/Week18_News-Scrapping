


// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

// use morgan and bodyparser 
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));


// Database configuration with mongoose
mongoose.connect('mongodb://heroku_dkrsmh6j:d9uk5v8ofojpa2dmiqa4srb4vn@ds147777.mlab.com:47777/heroku_dkrsmh6j');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// And we bring in our Comment and Article models
var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');

var url = "http://www.computerworld.com/news/";

// Routes
// ======

app.get('/www.computerworld.com/news/',function(req,res){
	res.redirect(url);
});

// Simple index route
app.get('/', function(req, res) {
  res.send(index.html);
});

// A GET request to scrape the website.
app.get('/scrape', function(req, res) {
	//  grab the body of the html with request
  request(url, function(error, response, html) {
  	//load html into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // grab every class='.post_small'
        $('.river-well').each(function(i, element) {

			// save an empty result object
			var result = {};

			// add the text and href of every link, 
			// and save them as properties of the result obj
			result.title = $(this).find('a').text();
			result.link = $(this).find('a').attr('href');
			result.content = $(this).find('h4').text();	
			result.image = $(this).find('img').attr('data-original');

			// check if Article exist in Database
			Article.findOne({ title: {$regex : result.title }}).exec(function(err, doc){
				// log any errors
				if (err){
					console.log("Err" + err);
				} 
				else {
					console.log("Found Exicting entry :" + result.title);
					if (doc === null){
						// create a new entry using Article model
						//passes the result object to the entry
						var entry = new Article (result);

						//save that entry to the db
						entry.save(function(err, doc) {
							// log any errors
						  if (err) {
						    console.log(err);
						  } 
						  // or log the doc
						  else {
						    console.log(doc);
						  }
						});
					}
				}
			});
		
    	});
  });
  res.send("Scrape Complete");
});

//get the articles scraped from the mongoDB
app.get('/articles', function(req, res){

	// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});


// grab an article by it's ObjectId with comment
app.get('/articles/:id', function(req, res){
	 
	// query that finds the matching id in our db...
	Article.findOne({'_id': req.params.id})
	// and populate all of the comments associated with it.
	.populate('comment')
	// execute
	.exec(function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// otherwise, send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

	
// replace the existing comment of an article with a new one
// or if no comment exists for an article, make the posted comment it's comment.
app.post('/articles/:id', function(req, res){
	// create a new comment and pass the req.body to the entry.
	var newComment = new Comment(req.body);

	// and save the new comment the db
	newComment.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		// otherwise
		else {
		// query that finds the matching Article in db and update it to the one just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {'comment':doc._id})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});


// // delete Database
// app.get('/delete', function(req, res) {
 
//   mongoose.connection.collections['scrapernews'].drop( function(err) {
//     console.log('collection dropped');
// 	});
// });







// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
