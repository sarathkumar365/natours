const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
// const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./starter/controllers/errorController');
const tourRouter = require('./starter/routes/tourRoutes');
const userRouter = require('./starter/routes/userRoutes');
const reviewRouter = require('./starter/routes/reviewRoutes');
const bookingsRouter = require('./starter/routes/bookingsRoute');

const viewRouter = require('./starter/routes/viewRouter');
// const exp = require('constants');

const app = express();

// setting up view engine
app.set('view engine', 'pug');
app.set('views', path.join(`${__dirname}/starter`, 'views'));

// enable your service for CORS
// const corsOptions = {
//   credentials: true,
//   origin: true,
//   ///..other options
// };
// app.use(cors(corsOptions));

//1.GLOBAL MIDDLEWARES

// Serving static Files
// app.use(express.static(`${__dirname}/starter/public`));
app.use(express.static(path.join(`${__dirname}/starter`, 'public')));

// Set security HTTP header
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Developpment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else app.use(morgan('dev'));

// Rate Limitter limits req per IP
const limiter = rateLimit({
  //This max property is the max number of req in windowMs(time).ADAPT this according to our application.
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Toomany requests...Pls try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // This will limit the size of the incomming req size
app.use(cookieParser());

// Data sanitization against NoSQL querry injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parametre pollutiom
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'price',
      'maxGroupSize',
      'difficulty',
    ],
  })
);
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
// Routes handlers

// set Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} !`, 400));
});

app.use(globalErrorHandler);
module.exports = app;
