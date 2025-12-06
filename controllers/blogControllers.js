// MDN-style naming of functions
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

// Imports the Blog-model from the 'models' folder so we are able to interact with
// the documents in the blogs-collection in the database
const Blog = require('../models/blog');
// Imports the Comment-model from the 'models' folder so we are able to get from
// and save new documents into the comments-collection in the database
const Comment = require('../models/comment');


// The controller for the '/index' GET-handler
const blog_index = (req, res) => {
  // FINDS all the documents in the 'blogs' collection and returns them SORTED
  // in descending order of time-of-creation (i.e. newest blogs first)
  // THEN renders the index-View and supplies this EJS script with the retrieved
  // collection of blog-documents (which is the 'result' of the '.find()' method)
  // CATCHES any error and logs it onto the console
  Blog.find().sort({ createdAt: -1 })
    .then((result) => {res.render('blogs/index', { title: 'All Blogs', blogs: result, currentUser: req.app.get('currentUser') })})
    .catch((err) => {console.log(err)})
}

// The controller for the '/blogs/create' GET-handler
const blog_create_get = (req, res) => {
  // Renders the create-View
  res.render('blogs/create', { title: 'Create a New Blog', currentUser: req.app.get('currentUser')  });
}

// The controller for the '/blogs' POST-handler
const blog_create_post = (req, res) => {
  // Initializes a new Blog-object with the properties found within the 'body' attribute
  // of the Request-object. This is because this method will always only be triggered
  // once a user has filled out the form for creating a new blog, and so the body of the request
  // will always possess the required properties in the blog-object schema, because for each INPUT
  // we set the 'name' tag to match the keys of the blog-object schema
  const blog = new Blog(req.body);
  // SAVES the new blog into the database, THEN redirects the browser to the '/blogs' page
  // CATCHES any error and logs it onto the console
  blog.save()
    .then((result) => {res.redirect('/')})
    .catch((err) => {console.log(err)})
}

// The controller for the '/blogs/:blogID' GET-handler
const blog_details = (req, res) => {
  // Stores the submitted ID of the requested blog into a CONSTANT
  const id = req.params.blogID;
  // FINDS the document in the collection with the unique '__id' property value that is the same as
  // the one requested by the browser (i.e. the ':blogID' route-parameter)
  // THEN renders the details-View and provides it with the 'result' of the .findById method, which
  // returns a document-object which uses the schema of the blog-objects, and so it is ready to be
  // passed-on down to the script inside the details-View
  // CATCHES any error and logs it onto the console, and assigns the status of the Response-object
  // to 404 before redirecting the browser to the 404-View page
  Blog.findById(id)
    .then((result) => {
      // If the current blog-document has comments-documents associated to it, it will retrieve them
      // before rendering its page. Otherwise it will render it with no comments
      if (result.comments.length > 0) {
        // Only initializes this variable if it finds the requested blog-document, else it would be a
        // waste of vmemory space. It is an Array-of-Promises, since every Query made to the MongoDB
        // will take some time until it sends back the answer, so during runtime they will be Promises
        const commentsQueries = []
        // for-loops in JavaScript only go through indexes for some inadequate reason
        for (let idx in result.comments) {
          // Initiates the Query for the current comment-document _id and pushes it to the Array-of-Promises
          // Since the current element is an ObjectID-typeof, it must first be converted into a String (.findById expects a String)
          commentsQueries.push(Comment.findById(result.comments[idx].toString()))
        }
        // This magical, fantastic method guarantees that the code inside it will only begin once all the Promises
        // inside the Array-of-Promises have been resolved!! It refreshes the current blog-page once they do
        Promise.all(commentsQueries).then((comments) => {
          res.render('blogs/details', { blog: result, comments: comments, title: result.title, currentUser: req.app.get('currentUser')  })
        })
      } else {res.render('blogs/details', { blog: result, comments: [], title: result.title, currentUser: req.app.get('currentUser')  })}
    })
    .catch((err) => {
      console.log(err)
      res.status(404).render('404', { title: 'Blog Not Found', currentUser: req.app.get('currentUser')  })
    })
}

// The controller for the '/blogs/:blogID' POST-handler
const blog_details_post = (req, res) => {
  // Stores the submitted ID of the requested blog into a CONSTANT
  const id = req.params.blogID;
  // Initializes a new Comment-object with the 'currentUser' gv and the 'name=body' property found 
  // within the 'body' attribute of the Request-object, which are the only REQUIRED keys of the
  // comment-object schema
  const comment = new Comment({ author: req.app.get('currentUser').username, body: req.body.body });
  // SAVES the new blog into the database, THEN reloads the current blog-page
  // CATCHES any error and logs it onto the console
  comment.save()
    .then((result) => {
      Blog.updateOne( { _id: id }, {$push: { comments: result._id }} )
        .then((updateResult) => {res.redirect('/blogs/'.concat(id))})
        .catch((err) => {console.log(err)})
    })
    .catch((err) => {
      console.log(err)
      res.status(404).render('404', { title: 'Blog Not Found', currentUser: req.app.get('currentUser')  })
    })
}

// The controller for the '/blogs/:blogID' DEL-handler
const blog_delete = (req, res) => {
  // Stores the submitted ID of the requested blog into a CONSTANT
  const id = req.params.blogID;
  // FINDS the document in the collection with the unique '__id' property value that is the same as
  // the one requested by the browser (i.e. the ':blogID' route-parameter), and then DELETES it from the database
  // THEN provides a Response-object into which it assigns a 'redirect' property corresponding to the Homepage,
  // and transforms it into a JSON-object. Since this handler is called only within the details-View script, it
  // returns this JSON-object to it
  // CATCHES any error and logs it onto the console
  Blog.findByIdAndDelete(id)
    .then((result) => {res.json({ redirect: '/' })})
    .catch((err) => {console.log(err)})
}

// Exports the functions in this script so it may be accessed inside other scripts
module.exports = {
    blog_index,
    blog_create_get,
    blog_create_post,
    blog_details,
    blog_details_post,
    blog_delete
}