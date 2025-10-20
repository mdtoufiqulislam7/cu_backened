// controllers/info.controller.js
const infoService = require("../service/info");

const getPersons = async (req, res) => {
  try {
    console.log('🎯 getPersons API called');
    console.log('📊 Query params:', req.query);
    console.log('📋 Headers:', req.headers);
    
    const persons = await infoService.getAllPersons();
    console.log('✅ Found persons:', persons.length);
    
    res.json(persons);
  } catch (err) {
    console.error('❌ Error in getPersons:', err.message);
    res.status(500).send("Server Error");
  }
};


const addPerson = async (req, res) => {
  console.log('🎯 addPerson API called');
  console.log('📦 Request body:', req.body);
  console.log('📁 File uploaded:', req.file ? 'Yes' : 'No');
  
  const { 
    contact_number, 
    email, 
    name, 
    bick_club_name, 
    gender, 
    b_group, 
    transaction_id, 
    nickname, 
    p_address, 
    t_size, 
    bick_brand 
  } = req.body || {};
  
  // Validation for all required fields
  const errors = [];
  
  // Email validation
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email address");
  }
  
  // Contact number validation
  if (!contact_number || typeof contact_number !== "string" || contact_number.trim().length === 0) {
    errors.push("Contact number is required");
  } else if (!/^[0-9+\-\s()]+$/.test(contact_number)) {
    errors.push("Invalid contact number format");
  }
  
  // Name validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  
  // Bike club name validation
  if (!bick_club_name || typeof bick_club_name !== "string" || bick_club_name.trim().length === 0) {
    errors.push("Bike club name is required");
  } else if (bick_club_name.trim().length < 2) {
    errors.push("Bike club name must be at least 2 characters long");
  }
  
  // Gender validation
  if (!gender || typeof gender !== "string" || gender.trim().length === 0) {
    errors.push("Gender is required");
  } else if (!["male", "female", "other"].includes(gender.toLowerCase())) {
    errors.push("Gender must be male, female, or other");
  }
  
  // Blood group validation
  if (!b_group || typeof b_group !== "string" || b_group.trim().length === 0) {
    errors.push("Blood group is required");
  } else if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(b_group.toUpperCase())) {
    errors.push("Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-");
  }
  
  // Transaction ID validation
  if (!transaction_id || typeof transaction_id !== "string" || transaction_id.trim().length === 0) {
    errors.push("Transaction ID is required");
  }
  
  // Payment picture validation
  if (!req.file) {
    errors.push("Payment picture is required");
  }
  
  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: errors 
    });
  }
  
  // Check for duplicate email
  try {
    const exists = await infoService.emailExists(email);
    if (exists) {
      return res.status(409).json({ error: "Email already exists" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
  
  try {
    // Upload image to Cloudinary
    const cloudinaryResult = await infoService.uploadToCloudinary(req.file);
    
    // Create person with image URL
    const personData = {
      ...req.body,
      payment_picture: cloudinaryResult.secure_url
    };
    
    const newPerson = await infoService.createPerson(personData);
    
    res.status(201).json({
      message: "Person registered successfully",
      data: newPerson
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.message.includes('Cloudinary upload failed')) {
      return res.status(500).json({
        error: "Image upload failed",
        details: err.message
      });
    }
    
    res.status(500).json({
      error: "Server Error",
      details: err.message
    });
  }
};

module.exports = {
  getPersons,
  addPerson,
};
