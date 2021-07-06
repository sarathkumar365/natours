/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51JA6kFSFRv4Bx3KPMIeaHqCRExtUp6joIHShBKv0QQhtwW6Df4Ns8loDrg3Mm6wuNlE5Xy07AQjzCPCTLFPhNFi200x4WJac8o'
);

export const bookTour = async (tourId) => {
  try {
    // 1. Get checkout session from endpoint
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
