const express = require('express');
const bookingsController = require('../controllers/bookingsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourID', bookingsController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingsController.getAllBooking)
  .post(bookingsController.createBooking);

router
  .route('/:id')
  .get(bookingsController.getBooking)
  .patch(bookingsController.updateBooking)
  .delete(bookingsController.deleteBooking);

module.exports = router;
