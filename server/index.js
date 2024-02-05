const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { sequelize } = require("./models");
const verifyJWT = require("./middleware/verifyJWT");

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

app.use("/auth", require("./routers/auth"));
app.use("/refresh", require("./routers/refresh"));
app.use("/product", require("./routers/product"));

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(
        `\x1b[33mStarting Test Server...`,
        new Date().toLocaleTimeString()
      );
      console.log(
        `Listening on ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}\x1b[0m`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
