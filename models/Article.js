// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is required
  title: {
    type:String,
    required:true
  },
  // link is required
  link: {
    type:String,
    required:true
  },
  content: {
    type:String,
    required:true
  },
  // image 
  image: {
    type:String,
    required:true
  },
  // save one note's ObjectId. ref refers to the Note model.
  comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// export the model
module.exports = Article;
