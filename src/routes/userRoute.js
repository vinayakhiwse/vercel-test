const express = require("express");
const {
  LoginUser,
  SingUpUser,
  GetUser,
  AccessUser,
} = require("../controller/userController");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.post("/login", LoginUser);
router.post("/signup", SingUpUser);
router.get("/get/all/users", GetUser);
router.patch("/updated/:id", isAdmin, AccessUser);

module.exports = router;
