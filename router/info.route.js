// routes/info.route.js
const express = require("express");
const router = express.Router();
const infoController = require("../controller/info.controller");
const infoService = require("../service/info");

router.get("/", infoController.getPersons);
router.post("/", infoService.upload.single('payment_picture'), infoController.addPerson);

module.exports = router;
