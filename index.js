const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config(); 


// db 

const pool = require('./config/db')


// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://roadburnerz.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`📋 Headers:`, req.headers);
  console.log(`📦 Body:`, req.body);
  console.log('---');
  next();
});

// Routes
const infoRoutes = require("./router/info.route");
const paymentRoutes = require("./router/payment.route");
const isApprovedRoutes = require("./router/is_approved.route");

app.use("/api/info", infoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/is-approved", isApprovedRoutes);


app.get("/", (req, res) => {
    res.send("Node + PostgreSQL API is running");
  });

const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port http//localhost:${PORT}`);
  });

