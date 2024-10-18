const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
require("dotenv").config();

const app = express();
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;
console.log("mongouri", MONGODB_URI_PROD);

app.use(cors());
app.use(bodyParser.json());
app.use("/api", indexRouter);

const mongoURI = MONGODB_URI_PROD;

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log("DB connection fail", err);
  });

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`server is on ${PORT}`);
});

// app.listen(5500, () => {
//   console.log("server on 5500");
// });
