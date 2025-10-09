const pool = require("../config/db")



const getAllPersons = async () => {
  const result = await pool.query("SELECT * FROM registation");
  return result.rows;
};

const createPerson = async (data) => {
  const { phone, email, name, b_name, division, thana, gender, blood_group } = data;
  const result = await pool.query(
    `INSERT INTO registation (phone, email, name, b_name, division, thana, gender, blood_group)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [phone, email, name, b_name, division, thana, gender, blood_group]
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
};
