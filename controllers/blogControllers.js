// MDN-style naming of functions
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

// Imports the Blog-model from the 'models' folder so we are able to interact with
// the documents in the blogs-collection in the database
const Blog = require('../models/blog');


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
  // will always possess the required properties in the blog-object schema
  const blog = new Blog(req.body);
  // SAVES the new blog into the database, THEN redirects the browser to the Homepage
  // CATCHES any error and logs it onto the console
  blog.save()
    .then((result) => {res.redirect('/')})
    .catch((err) => {console.log(err)})
}

// The controller for the '/blogs/:blogID' GET-handler
const blog_details = (req, res) => {
  // Stores the submitted ID of the requested blog into a CONSTANT
  const id = req.params.blogID
  // FINDS the document in the collection with the unique '__id' property value that is the same as
  // the one requested by the browser (i.e. the ':blogID' route-parameter)
  // THEN renders the details-View and provides it with the 'result' of the .findById method, which
  // returns a document-object which uses the schema of the blog-objects, and so it is ready to be
  // passed-on down to the script inside the details-View
  // CATCHES any error and logs it onto the console, and assigns the status of the Response-object
  // to 404 before redirecting the browser to the 404-View page
  Blog.findById(id)
    .then((result) => {res.render('blogs/details', { blog: result, title: result.title, currentUser: req.app.get('currentUser')  })})
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
    blog_delete
}