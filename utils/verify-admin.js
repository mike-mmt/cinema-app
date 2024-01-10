const Account = require("../models/Account");

function verifyAdmin(req, res, next) {
  const account = Account.findById(req.user.id).select("isAdmin").exec();
  if (account.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - not an admin" });
  }
}

module.exports = verifyAdmin;
