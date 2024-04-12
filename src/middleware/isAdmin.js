const jwt = require("jsonwebtoken");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ msg: "Invalid Token." });
    }
    const decoded = jwt.verify(token, "vinayak");
    console.log("decoded", decoded);
    if (decoded.data.role === "admin") {
      next();
    } else {
      return res.status(401).json({
        msg: "Access Denied. you don't have the acces to give the permission.",
      });
    }
  } catch (error) {
    console.log("getting error in the middleware.", error);
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = isAdmin;
