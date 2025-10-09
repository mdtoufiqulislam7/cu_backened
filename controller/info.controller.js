// controllers/info.controller.js
const infoService = require("../service/info");

const getPersons = async (req, res) => {
  try {
    const persons = await infoService.getAllPersons();
    res.json(persons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


const addPerson = async (req, res) => {
  const { email } = req.body || {};
  const isValidEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail) {
    return res.status(400).json({ error: "Invalid email address" });
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
    const newPerson = await infoService.createPerson(req.body);
    res.json(newPerson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getPersons,
  addPerson,
};
