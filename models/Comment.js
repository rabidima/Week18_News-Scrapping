// require mongoose
var mongoose = require('mongoose');
// create a schema class
var Schema = mongoose.Schema;

// create the Comment schema
var CommentSchema = new Schema({
  // 
  articleObj: {
    type: Schema.Types.ObjectId
    // type: Schema.Types.ObjectId,
    // ref: 'Article'
  },
  
  body: {
    type: String
  },

  time: {
  	type: String
  }

});

// create the Comment model with the CommentSchema
var Comment = mongoose.model('Comment', CommentSchema);

// export the Comment model
module.exports = Comment;
