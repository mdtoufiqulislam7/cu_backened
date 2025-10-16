const paymentService = require("../service/payment");

// Create payment with image upload
const createPayment = async (req, res) => {
  try {
    const { transaction_id, r_id } = req.body;
    
    // Validation
    const errors = [];
    
    if (!transaction_id || typeof transaction_id !== "string" || transaction_id.trim().length === 0) {
      errors.push("Transaction ID is required");
    }
    
    if (!r_id || typeof r_id !== "string" || r_id.trim().length === 0) {
      errors.push("Registration ID (r_id) is required");
    }
    
    if (!req.file) {
      errors.push("Payment image is required");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }
    
    // Upload image to Cloudinary
    const cloudinaryResult = await paymentService.uploadToCloudinary(req.file);
    
    // Create payment record
    const paymentData = {
      transaction_id: transaction_id.trim(),
      image_url: cloudinaryResult.secure_url,
      payment_status: 'pending',
      r_id: r_id.trim()
    };
    
    const newPayment = await paymentService.createPayment(paymentData);
    
    res.status(201).json({
      message: "Payment created successfully",
      payment: newPayment
    });
    
  } catch (error) {
    console.error("Payment creation error:", error.message);
    
    if (error.message.includes('Cloudinary upload failed')) {
      return res.status(500).json({
        error: "Image upload failed",
        details: error.message
      });
    }
    
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json({
      message: "Payments retrieved successfully",
      payments: payments
    });
  } catch (error) {
    console.error("Get payments error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Valid payment ID is required"
      });
    }
    
    const payment = await paymentService.getPaymentById(id);
    
    if (!payment) {
      return res.status(404).json({
        error: "Payment not found"
      });
    }
    
    res.json({
      message: "Payment retrieved successfully",
      payment: payment
    });
  } catch (error) {
    console.error("Get payment by ID error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Get payments by r_id
const getPaymentsByRId = async (req, res) => {
  try {
    const { r_id } = req.params;
    
    if (!r_id || typeof r_id !== "string" || r_id.trim().length === 0) {
      return res.status(400).json({
        error: "Valid registration ID (r_id) is required"
      });
    }
    
    const payments = await paymentService.getPaymentsByRId(r_id.trim());
    
    res.json({
      message: "Payments retrieved successfully",
      payments: payments
    });
  } catch (error) {
    console.error("Get payments by r_id error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    
    // Validation
    const errors = [];
    
    if (!id || isNaN(id)) {
      errors.push("Valid payment ID is required");
    }
    
    if (!payment_status || typeof payment_status !== "string" || payment_status.trim().length === 0) {
      errors.push("Payment status is required");
    } else if (!["pending", "approved", "rejected", "failed"].includes(payment_status.toLowerCase())) {
      errors.push("Payment status must be pending, approved, rejected, or failed");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }
    
    const updatedPayment = await paymentService.updatePaymentStatus(id, payment_status.toLowerCase());
    
    if (!updatedPayment) {
      return res.status(404).json({
        error: "Payment not found"
      });
    }
    
    res.json({
      message: "Payment status updated successfully",
      payment: updatedPayment
    });
  } catch (error) {
    console.error("Update payment status error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Valid payment ID is required"
      });
    }
    
    const deletedPayment = await paymentService.deletePayment(id);
    
    if (!deletedPayment) {
      return res.status(404).json({
        error: "Payment not found"
      });
    }
    
    res.json({
      message: "Payment deleted successfully",
      payment: deletedPayment
    });
  } catch (error) {
    console.error("Delete payment error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByRId,
  updatePaymentStatus,
  deletePayment
};
