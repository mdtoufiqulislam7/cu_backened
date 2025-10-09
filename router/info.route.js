// routes/info.route.js
const express = require("express");
const router = express.Router();
const infoController = require("../controller/info.controller");

router.get("/", infoController.getPersons);
router.post("/", infoController.addPerson);

module.exports = router;
