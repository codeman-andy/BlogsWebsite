// Imports the Mongoose third-party package and stores it into a CONSTANT
const mongoose = require('mongoose');
// Stores the Schema constructor-function from the Mongoose third-party package into a CONSTANT
const Schema = mongoose.Schema;

// Constructs the schema for the comment-documents
// The 'required' optional-argument for each property ensures a user must fill that field before submitting a new comment
// The 'timestamps' optional-argument saves timestamps for each time a comment is either created or updated
const commentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
    },
    replies: {
        type: Array,
        default: []
    }
}, { timestamps: true })

// Creates the model-object so it is possible to interact with the comment-documents in the database
// Conventionally, models are capitalized. The argument given for the '.model' method is the name of the collection
// and is always pluralised before it is scanned for on the database, so it must always be given in the single-form
// The second argument is the schema to be applied to the documents in the collection (the first argument)
const Comment = mongoose.model('Comment', commentSchema)

// Exports the Comment-model constructed in this script so it may be accessed inside other scripts
module.exports = Comment;