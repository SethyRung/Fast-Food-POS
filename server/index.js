const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { sequelize } = require("./models");

const allowedOrigins = [
  `http://localhost:${process.env.CLIENT_PORT}`,
  `http://${process.env.SERVER_HOST}:${process.env.CLIENT_PORT}`,
];
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

app.use(credentials);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const auth = require("./routers/auth");

app.use("/auth", auth);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Starting Test Server...`, new Date().toLocaleTimeString());
      console.log(
        `Listening on ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
