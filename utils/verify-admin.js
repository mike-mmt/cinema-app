const Account = require("../models/Account");

function verifyAdmin(req, res, next) {
  if (process.env.DEV === "true") {
    next();
  } else {
    console.log(req.user.id);
    const account = Account.findById(req.user.id)
      .select("isAdmin")
      .exec()
      .then((account) => {
        if (account.isAdmin) {
          next();
        } else {
          return res
            .status(403)
            .json({ message: "Access denied - not an admin" });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
      });
  }
}

module.exports = verifyAdmin;
