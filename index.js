const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config(); 


// db 

const pool = require('./config/db')


// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data']
}));

app.use(express.json());


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

