// Imports the Express third-party package and stores it into a CONSTANT
const express = require('express');

// Initializes an Express-router
// It essentially functions as a 'mini-app' that allows you to define routing within a website,
// though it would not have any meaning if it were not called as a method in Express
const router = express.Router();

// Imports the controllers for the '/blogs/' division of the website from the 'controllers' folder
// so we are able to call the functions found therein for the appropriate routing
const blogController = require('../controllers/blogControllers');


// GET-handler for the '/blogs' URL
router.get('/', blogController.blog_index);

// POST-handler for the '/blogs' URL
// It is called once a user submits a new blog form in the '/blogs/create' page
router.post('/', blogController.blog_create_post);

// GET-handler for the '/blogs/create' URL. Must be placed above the below handlers, otherwise
// '/create' will be misconstrued as a ':blogID' route-parameter
router.get('/create', blogController.blog_create_get);

// GET-handler for the '/blogs/:blogID' URL. Here, the ':blogID' is a variable route-parameter
// It is called once a user clicks on a blog title to go into its details-View page
router.get('/:blogID', blogController.blog_details);

// DEL-handler for the 'blogs/:blogID' URL. Here, the ':blogID' is a variable route-parameter
// It is called once a user presses the 'Delete' button inside a details-View page
router.delete('/:blogID', blogController.blog_delete);

// Exports the router from this script so it may be accessed by the Main app-script
module.exports = router;