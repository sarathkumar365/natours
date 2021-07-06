const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Bookings = require('../models/bookingModel');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();
  // 2. Build template

  // 3. Render thst template using tour data from step 1

  res.status(200).render('overview', { title: 'All tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1.  Get the data for the requested tour (including reviews and guide)
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user',
    })
    .populate({ path: 'guides' });
  if (!tour) {
    // eslint-disable-next-line no-undef
    return next(new AppError('There is no tour with that name', 404));
  }

  res.status(200).render('tours', { title: `${tour.name} tour`, tour });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', { title: 'Log In ' });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account ' });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. Find bookings
  const bookings = await Bookings.find({ user: req.user.id });
  // 2. Finf tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', { title: 'My Tours', tours });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(200)
    .render('account', { title: 'Your account ', user: updatedUser });
});
