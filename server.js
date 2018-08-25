// Grabs our environment variables from the .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const logger = require('./api/utils/logger');
const routes = require('./api/routes');
const cors = require('cors');

const mongoose = require('mongoose');
require('./api/models/City');
require('./api/models/State');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
var mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/zooxapi';
mongoose.connect(mongodbUri);

// Environment configuration
// const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

// Configure express to handle HTTP requests
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(morgan('dev'));
app.use(cors());

// Create a server side router
routes(app);

// Handle internal errors
app.use((err, req, res, next) => {
  logger.info(err.stack);
  return res.sendStatus(500);
});

// Start the server
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
