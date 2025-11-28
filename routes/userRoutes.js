// Imports the Express third-party package and stores it into a CONSTANT
const express = require('express');

// Initializes an Express-router
// It essentially functions as a 'mini-app' that allows you to define routing within a website,
// though it would not have any meaning if it were not called as a method in Express
const router = express.Router();

// Imports the controllers for the '/user/' division of the website from the 'controllers' folder
// so we are able to call the functions found therein for the appropriate routing
const userController = require('../controllers/userControllers');


// GET-handler for the '/user/create' URL
router.get('/create', userController.user_create_get);

// POST-handler for the '/user/create' URL
// It is called once a user submits a new user form in the '/user/create' page
router.post('/create', userController.user_create_post);

// GET-handler for the '/user/create/successful' URL. Must be placed above the below handler, otherwise
// '/create' will be misconstrued as a ':blogID' route-parameter.
// It is called once a user successfully creates a new account on the website
router.get('/create/successful', userController.user_create_successful_get);

// GET-handler for the '/user/login' URL
router.get('/login', userController.user_login_get);

// POST-handler for the '/user/login' URL
// It is called once a user submits a new user form in the '/user/login' page
router.post('/login', userController.user_login_post);

// GET-handler for the '/user/:userID' URL. Here, the ':userID' is a variable route-parameter
// It is called once a user selects its profile to go into its details-View page
router.get('/:userID', userController.user_details);

// Exports the router from this script so it may be accessed by the Main app-script
module.exports = router;