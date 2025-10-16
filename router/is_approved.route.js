const express = require('express');
const router = express.Router();
const isApprovedController = require('../controller/is_approved.controller');

// POST /api/is-approved - Create is_approved entry and send email
router.post('/', isApprovedController.createIsApproved);

// GET /api/is-approved - Get all is_approved entries
router.get('/', isApprovedController.getAllIsApproved);

// GET /api/is-approved/:id - Get is_approved by ID
router.get('/:id', isApprovedController.getIsApprovedById);

// PUT /api/is-approved/:id - Update is_approved status
router.put('/:id', isApprovedController.updateIsApproved);

// DELETE /api/is-approved/:id - Delete is_approved entry
router.delete('/:id', isApprovedController.deleteIsApproved);

// POST /api/is-approved/test-email - Send test email
router.post('/test-email', isApprovedController.sendTestEmail);

module.exports = router;
