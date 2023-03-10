const express = require("express");
const path = require("path");

const app = express();

const routes = require("./routes/index.js");

app.use(express.json());

app.use("/api", routes);

app.listen(3000, () => {
  console.log("server running on port", 3000);
});
