const pool = require("../config/db");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'payments', // Optional: organize images in a folder
        transformation: [
          { width: 800, height: 600, crop: 'limit' }, // Resize if needed
          { quality: 'auto' } // Optimize quality
        ]
      },
      (error, result) => {
        if (error) {
          throw error;
        }
        return result;
      }
    ).end(file.buffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'payments',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(file.buffer);
    });
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Create payment record
const createPayment = async (data) => {
  const { transaction_id, image_url, payment_status = 'pending', r_id } = data;
  
  const result = await pool.query(
    `INSERT INTO payment (transaction_id, image_url, payment_status, r_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [transaction_id, image_url, payment_status, r_id]
  );
  
  return result.rows[0];
};

// Get all payments with registration details (only pending or failed)
const getAllPayments = async () => {
  const result = await pool.query(`
    SELECT 
      p.*,
      r.name as name,
      r.phone as phone,
      r.email as email
    FROM payment p
    LEFT JOIN registation r ON p.r_id = r.id
    WHERE p.payment_status IN ('pending', 'failed')
    ORDER BY p.created_at DESC
  `);
  return result.rows;
};

// Get payment by ID with registration details
const getPaymentById = async (id) => {
  const result = await pool.query(`
    SELECT 
      p.*,
      r.name as r_name,
      r.phone as r_phone,
      r.email as r_email
    FROM payment p
    LEFT JOIN registation r ON p.r_id = r.id
    WHERE p.id = $1
  `, [id]);
  return result.rows[0];
};

// Get payments by r_id with registration details (only pending or failed)
const getPaymentsByRId = async (r_id) => {
  const result = await pool.query(`
    SELECT 
      p.*,
      r.name as name,
      r.phone as phone,
      r.email as email
    FROM payment p
    LEFT JOIN registation r ON p.r_id = r.id
    WHERE p.r_id = $1 AND p.payment_status IN ('pending', 'failed')
    ORDER BY p.created_at DESC
  `, [r_id]);
  return result.rows;
};

// Update payment status
const updatePaymentStatus = async (id, payment_status) => {
  const result = await pool.query(
    "UPDATE payment SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [payment_status, id]
  );
  return result.rows[0];
};

// Delete payment
const deletePayment = async (id) => {
  const result = await pool.query("DELETE FROM payment WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = {
  upload,
  uploadToCloudinary,
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByRId,
  updatePaymentStatus,
  deletePayment
};
