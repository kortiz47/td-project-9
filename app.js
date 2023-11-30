'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const indexRoute = require('./routes');
const cors = require('cors');
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

//body parser
const bodyParser = require('body-parser');


//connection to the database
const db = require('./models/index');
const sequelize = db.sequelize;

//Test the Connection
(async () => {
  //Sync all tables
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));


app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//have all routes start with /api
app.use('/api', indexRoute);
// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

//===============================ERROR HANDLING===========================

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
