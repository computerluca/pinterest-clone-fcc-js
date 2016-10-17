// load the things we need
var mongoose = require('mongoose');

// define the schema for our posts model
var ObjectId = require('mongoose').Types.ObjectId; 

var postSchema = mongoose.Schema({

   
        
        title: String,
        id_user: String,
        num_likes: Number,
        url: String,
        width:String
   
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
