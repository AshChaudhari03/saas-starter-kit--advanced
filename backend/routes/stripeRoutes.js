const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All stripe routes require authentication
router.use(authMiddleware);

// Get available plans
router.get('/plans', stripeController.getPlans);

// Get user's subscription status
router.get('/subscription', stripeController.getSubscriptionStatus);

// Create checkout session
router.post('/create-checkout-session', stripeController.createCheckoutSession);

router.post('/update-subscription', stripeController.updateSubscription);

router.post('/webhook', stripeController.webhook);

module.exports = router;
