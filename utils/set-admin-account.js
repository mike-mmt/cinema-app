const Account = require("../models/Account");

require("dotenv").config({ path: "./config.env" });

async function setAdminAccount() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const setAdmin = await Account.findOneAndUpdate(
    { email: adminEmail },
    { isAdmin: true }
  );
}

module.exports = setAdminAccount;
