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
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'registrations', // Organize images in registrations folder
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



const getAllPersons = async () => {
  const result = await pool.query("SELECT * FROM registation WHERE payment_status = 'pending' OR payment_status IS NULL OR payment_status = ''");
  return result.rows;
};

const createPerson = async (data) => {
  const { 
    contact_number, 
    email, 
    name, 
    bick_club_name, 
    gender, 
    b_group, 
    transaction_id, 
    payment_picture, 
    nickname, 
    p_address, 
    t_size, 
    bick_brand 
  } = data;
  
  const result = await pool.query(
    `INSERT INTO registation (
      contact_number, email, name, bick_club_name, gender, b_group, 
      transaction_id, payment_picture, payment_status, amount, 
      nickname, p_address, t_size, bick_brand
    )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending','1260',$9,$10,$11,$12) RETURNING *`,
    [
      contact_number, email, name, bick_club_name, gender, b_group, 
      transaction_id, payment_picture, nickname, p_address, t_size, bick_brand
    ]
  );
  return result.rows[0];
};

const emailExists = async (email) => {
  const result = await pool.query(
    "SELECT 1 FROM registation WHERE email = $1 LIMIT 1",
    [email]
  );
  return result.rowCount > 0;
};

module.exports = {
  getAllPersons,
  createPerson,
  emailExists,
  upload,
  uploadToCloudinary
};
