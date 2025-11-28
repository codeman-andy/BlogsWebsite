// MDN-style naming of functions
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

// Imports the User-model from the 'models' folder so we are able to interact with
// the documents in the users-collection in the database
const User = require('../models/user');


// The controller for the '/user/create' GET-handler
const user_create_get = (req, res) => {
  // Renders the create-View
  res.render('users/create', { title: 'Account Creation' });
}

// The controller for the '/user/create' POST-handler
const user_create_post = (req, res) => {
  // Initializes a new User-object with the properties found within the 'body' attribute
  // of the Request-object. This is because this method will always only be triggered
  // once a user has filled out the form for creating a new account, and so the body of the request
  // will always possess the required properties in the user-object schema, defaulting to 'common'
  // as the value for the 'role' property
  const user = new User(req.body);
  // SAVES the new user into the database, THEN redirects the browser to the 'user/create/successful' page
  // CATCHES any error and logs it onto the console
  user.save()
    .then((result) => {res.redirect('/user/create/successful')})
    .catch((err) => {console.log(err)})
}

// The controller for the '/user/create/successful' GET-handler
const user_create_successful_get = (req, res) => {
  // Renders the create_successful-View
  res.render('users/create_successful', { title: 'Creation Successful' });
}

// The controller for the '/user/login' GET-handler
const user_login_get = (req, res) => {
  // Renders the login-View
  res.render('users/login', { title: 'Account Login' });
}

// The controller for the '/user/login' POST-handler
// It requires the 'async' statement so it can use 'await' inside it
const user_login_post = async (req, res) => {
  // Retrieves the .username and .password properties found within the 'body' attribute
  // of the Request-object. This is because this method will always only be triggered
  // once a user has filled out the login-form, so the Request-Object will always possess
  // these two properties of the user-object schema.
  // It AWAITS to check if the username EXISTS in the database, because if it would not wait
  // then the .exists method would return a <Pending> Promise (i.e. an ongoing query), instead
  // of the result of the query. If it does exist, it returns the _id property of the found
  // document, otherwise it returns 'null' and so can be used in If-statements.
  // It then AWAITS to checks if the password is correct. If both are, it redirects to the Homepage.
  // ELSE, it refreshes the login-View and asks the user to retry inputting their username and password
  if (await User.exists({ username: req.body.username })) {
    if (await User.exists({ password: req.body.password })) {
      console.log('Inside password-check');
      res.redirect('/');
    }
    else {
      console.log('No password match');
      res.render('users/login', { title: 'Account Login', retry: true })
    }
  }
  else {
    console.log('No username match');
    res.render('users/login', { title: 'Account Login', retry: true })
  }
}

// The controller for the '/user/:userID' GET-handler
const user_details = (req, res) => {
  // Stores the submitted ID of the requested user into a CONSTANT
  const id = req.params.userID
  // FINDS the document in the collection with the unique '__id' property value that is the same as
  // the one requested by the browser (i.e. the ':userID' route-parameter)
  // THEN renders the details-View and provides it with the 'result' of the .findById method, which
  // returns a document-object which uses the schema of the user-objects, and so it is ready to be
  // passed-on down to the script inside the details-View
  // CATCHES any error and logs it onto the console, and assigns the status of the Response-object
  // to 404 before redirecting the browser to the 404-View page
  User.findById(id)
    .then((result) => {res.render('users/details', { user: result, title: result.title })})
    .catch((err) => {
      console.log(err)
      res.status(404).render('404', { title: 'User Not Found' })
    })
}

// Exports the functions in this script so it may be accessed inside other scripts
module.exports = {
    user_create_get,
    user_create_post,
    user_create_successful_get,
    user_login_get,
    user_login_post,
    user_details
}