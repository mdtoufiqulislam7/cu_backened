const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');
const paymentService = require('../service/payment');

// POST /api/payments - Create payment with image upload
router.post('/', paymentService.upload.single('payment_image'), paymentController.createPayment);

// GET /api/payments - Get all payments
router.get('/', paymentController.getAllPayments);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// GET /api/payments/registration/:r_id - Get payments by registration ID
router.get('/registration/:r_id', paymentController.getPaymentsByRId);

// PUT /api/payments/:id/status - Update payment status
router.put('/:id/status', paymentController.updatePaymentStatus);

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
