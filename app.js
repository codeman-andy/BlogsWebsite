// Imports the Express and Mongoose third-party package and stores them into CONSTANTs
const express = require('express');
const mongoose = require('mongoose');

// Imports the router for the '/blogs/' routes from the 'routes' folder so it can be used inside this script
const blogRoutes = require('./routes/blogRoutes');
// Imports the router for the '/user/' routes from the 'routes' folder so it can be used inside this script
const userRoutes = require('./routes/userRoutes');

// Initializes an Express App and stores it into a CONSTANT
const app = express();

// MongoDB Atlas database connection address
const dbURI = 'mongodb+srv://demo_user:Ht99OgajqTuyDYKL@coronet.z1d6kry.mongodb.net/blogsWebsite?retryWrites=true&w=majority';
// CONNECTS to the MongoDB Atlas database, and only after the connection has been established
// does it start LISTENING to requests (through the port 3000), otherwise the webpage would not be ready before use
// CATCHES any error and logs it onto the console
mongoose.connect(dbURI)
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));

// Registers the View-Engine for the initialized Express App, which uses the './views/' folder as default
app.set('view engine', 'ejs');

// Assigns an active-user variable (i.e. the user currently interacting with the website), which it defaults to a 'visitor'-user 
app.set('currentUser', 'visitor');



// MIDDLEWARE

// Where to retrieve public static files
app.use(express.static('public'));

// Makes it so any URL-encoded data gets parsed into an Object that can be used on the Request-object
// (i.e. the data from the 'Create New Blog' form that is submitted by users), otherwise it would just
// return an 'undefined' object. The 'extended' argument is optional
app.use(express.urlencoded({ extended: true }))



// ROUTING

// GENERAL ROUTING

// GET-handler for the Homepage
app.get('/', (req, res) => {
  // Redirects the Homepage to the '/blogs' page
  res.redirect('/blogs');
});

// GET-handler for the '/about' page
app.get('/about', (req, res) => {
  // Renders the about-View
  res.render('about', { title: 'About' });
});

// ROUTING PERTAINING TO THE BLOGS

// It is only used when receiving Requests under the '/blogs' division of the website
app.use('/blogs', blogRoutes);

// ROUTING PERTAINING TO THE USERS

// It is only used when receiving Requests under the '/user' division of the website
app.use('/user', userRoutes);



// If Express was not able to get any valid page so far, it will instead return the '404' page,
// setting the response-status to 404 as well
// NOTE: MUST BE PLACED AT THE BOTTOM OF THE SCRIPT
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});