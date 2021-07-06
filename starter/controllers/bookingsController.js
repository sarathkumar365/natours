const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Bookings = require('../models/bookingModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get currently booked tour
  const tour = await Tour.findById(req.params.tourID);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  // create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookinCheckout = catchAsync(async (req, res, next) => {
  // Temporary solun

  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Bookings.create({ tour, user, price });

  // res.redirect(req.orginalUrl.split('?')[0]);
  res.redirect(`${req.protocol}://${req.get('host')}/`);
});

exports.createBooking = factory.createOne(Bookings);
exports.getBooking = factory.getOne(Bookings);
exports.getAllBooking = factory.getAll(Bookings);
exports.updateBooking = factory.updateOne(Bookings);
exports.deleteBooking = factory.deleteOne(Bookings);
