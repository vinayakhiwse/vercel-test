const express = require("express");
const cors = require("cors");
const connect = require("./src/config/db");
const UserRouter = require("./src/routes/userRoute");
const PORT = 8080;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", UserRouter);

connect();
app.listen(PORT, () => {
  console.log("MONGod connected to the server");
});
