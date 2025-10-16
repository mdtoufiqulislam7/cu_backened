const isApprovedService = require("../service/is_approved");

// Create is_approved entry and send email
const createIsApproved = async (req, res) => {
  try {
    const { payment_id, approved } = req.body;
    
    // Validation
    const errors = [];
    
    if (!payment_id || typeof payment_id !== "string" || payment_id.trim().length === 0) {
      errors.push("Payment ID is required");
    }
    
    if (typeof approved !== "boolean") {
      errors.push("Approved status must be a boolean value (true/false)");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }
    
    const result = await isApprovedService.createIsApproved({
      payment_id: payment_id.trim(),
      approved: approved
    });
    
    res.status(201).json({
      message: "Approval status created successfully",
      data: result,
      email_sent: result.email_sent
    });
    
  } catch (error) {
    console.error("Create is_approved error:", error.message);
    
    if (error.message.includes('Payment not found')) {
      return res.status(404).json({
        error: "Payment not found",
        details: error.message
      });
    }
    
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Get all is_approved entries
const getAllIsApproved = async (req, res) => {
  try {
    const approvals = await isApprovedService.getAllIsApproved();
    res.json({
      message: "Approval records retrieved successfully",
      data: approvals
    });
  } catch (error) {
    console.error("Get all is_approved error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Get is_approved by ID
const getIsApprovedById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Valid approval ID is required"
      });
    }
    
    const approval = await isApprovedService.getIsApprovedById(id);
    
    if (!approval) {
      return res.status(404).json({
        error: "Approval record not found"
      });
    }
    
    res.json({
      message: "Approval record retrieved successfully",
      data: approval
    });
  } catch (error) {
    console.error("Get is_approved by ID error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Update is_approved status
const updateIsApproved = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    
    // Validation
    const errors = [];
    
    if (!id || isNaN(id)) {
      errors.push("Valid approval ID is required");
    }
    
    if (typeof approved !== "boolean") {
      errors.push("Approved status must be a boolean value (true/false)");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }
    
    const updatedApproval = await isApprovedService.updateIsApproved(id, approved);
    
    if (!updatedApproval) {
      return res.status(404).json({
        error: "Approval record not found"
      });
    }
    
    res.json({
      message: "Approval status updated successfully",
      data: updatedApproval
    });
  } catch (error) {
    console.error("Update is_approved error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Delete is_approved entry
const deleteIsApproved = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Valid approval ID is required"
      });
    }
    
    const deletedApproval = await isApprovedService.deleteIsApproved(id);
    
    if (!deletedApproval) {
      return res.status(404).json({
        error: "Approval record not found"
      });
    }
    
    res.json({
      message: "Approval record deleted successfully",
      data: deletedApproval
    });
  } catch (error) {
    console.error("Delete is_approved error:", error.message);
    res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
};

// Send test email
const sendTestEmail = async (req, res) => {
  try {
    const { email, name, payment_id } = req.body;
    
    // Validation
    const errors = [];
    
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Valid email address is required");
    }
    
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push("Name is required");
    }
    
    if (!payment_id || typeof payment_id !== "string" || payment_id.trim().length === 0) {
      errors.push("Payment ID is required");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }
    
    const result = await isApprovedService.sendApprovalEmail(
      email.trim(),
      name.trim(),
      payment_id.trim()
    );
    
    res.json({
      message: "Test email sent successfully",
      data: result
    });
    
  } catch (error) {
    console.error("Send test email error:", error.message);
    res.status(500).json({
      error: "Email sending failed",
      details: error.message
    });
  }
};

module.exports = {
  createIsApproved,
  getAllIsApproved,
  getIsApprovedById,
  updateIsApproved,
  deleteIsApproved,
  sendTestEmail
};
