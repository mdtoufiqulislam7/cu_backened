const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config(); 


// db 

const pool = require('./config/db')


app.use(express.json());


// Routes
const infoRoutes = require("./router/info.route");
app.use("/api/info", infoRoutes);


app.get("/", (req, res) => {
    res.send("Node + PostgreSQL API is running");
  });

const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

