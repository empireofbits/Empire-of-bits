// const fs = require('fs');
const express = require('express');
const morgan = require('morgan'); // Third party middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const candyCrushRoutes = require('./routes/candyCrushRoutes');
const battleshipRoutes = require('./routes/battleshipRoutes');
const spaceInvadersRoutes = require('./routes/spaceInvadersRoutes');
const platformerRoutes = require('./routes/platformerRoutes');

const app = express();

/////////////////////////////
//1.GLOBAL MIDDLEWARES

//Security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //third party middleware
}

app.use(cors());

//it ia a middleware function which we can use using app.use
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an hour ',
});

app.use('/api', limiter); //so this middleware will apply to all the routes which starts with this given route

//Body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // it is a middleware and it is a function that can modify the incoming request data

//Data sanitization against NoSQL query injection
app.use(mongoSanitize()); //this will filter out any sign like $ and other which mongo used and from the body

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Below Creating our own middleware , here (req,res,next) is function which we want to add in our middleware stack
//(req,res,next)->in each middleware function we have access to req,res(request and response) but here also we have the next function(it is always the third argument) due to this format express know we are defining the middleware here

// app.use((req, res, next) => {
//   //it will run each time there is some new request
//   console.log('hello from the middleware!!');

//   //Important->We have to call the next function,if we dont call next() then (req,res) request and response cycle will be stuck at this point means we would never able to send back a response to the client
//   next();
// });

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/////////////////////////////////
//2.ROUTE HANDLERS

//This router(tourRouter,userRouter,reviewRouter) that we are specifieng below are middleware that we mount upon this path so whenever there is a request in this route first it will go url then call the middleware function
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/games/candycrush', candyCrushRoutes);
app.use('/api/v1/games/battleship', battleshipRoutes);
app.use('/api/v1/games/spaceinvaders', spaceInvadersRoutes);
app.use('/api/v1/games/platformer', platformerRoutes);
//Implimenting a route handler that was not cached by any of other route handlers like above route handlers
//all middlewares function are executed in the order they are in the code
//IMP->So according to above statement if we have a request that makes it into current point of code where i am writing this that means neither the tourRouter and userRouter just above not able to catch it.
//IMP->So if we add a middleware here we can handle that

//.all() it gonna run for all the http methods
//it is also a middlewares
app.all('*', (req, res, next) => {
  //now using the class for handling error which we made in appError.js file
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// created a new folder for above function and imported it here below
app.use(globalErrorHandler);

module.exports = app;
