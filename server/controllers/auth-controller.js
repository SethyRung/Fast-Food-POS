const { Employees } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
  async handleRegister(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, Email and Password are required." });
    try {
      //encrypt the password
      const hashedPwd = await bcrypt.hash(password, 10);

      await Employees.create({
        name: name,
        email: email,
        password: hashedPwd,
        roles: { Employee: 2001 },
        refreshToken: [],
      });
      res.send({
        status: "success",
        message: "Success! Your account has been created.",
      });
    } catch (err) {
      if (err.original.sqlState == 23000)
        res.send({
          status: "error",
          message: "This email address is already in use.",
        });
      else
        res.send({
          status: "error",
          message: "An unexpected error occurred. Please try again later.",
        });
      // console.log(err.message)
    }
  },
  async handleLogin(req, res) {
    const cookies = req.cookies;
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    const foundUser = await Employees.findOne({ where: { email: email } });
    if (!foundUser)
      return res.status(401).json({
        status: "error",
        message: "The email or password you entered is incorrect.",
      });
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      //create token
      const accessToken = jwt.sign(
        {
          uid: foundUser.id,
          email: email,
          roles: Object.values(foundUser.roles),
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      const newRefreshToken = jwt.sign(
        { uid: foundUser.id, email: email },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        /* 
          Scenario added here: 
              1) employee logs in but never uses RT and does not logout 
              2) RT is stolen
              3) If 1 & 2, reuse detection is needed to clear all RTs when employee logs in
          */
        const refreshToken = cookies.jwt;
        const foundToken = await Employees.findOne({
          where: {
            refreshToken: {
              [Op.contains]: Array(refreshToken),
            },
          },
        });

        // Detected refresh token reuse!
        if (!foundToken) {
          // console.log("attempted refresh token reuse at login!");
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      // Saving refreshToken with current employee

      await Employees.update(
        { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
        {
          where: { email: email },
        }
      );

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Send authorization roles and access token to employee
      res.status(200).json({
        status: "success",
        message: "Success! You are now logged in.",
        uid: foundUser.id,
        roles: Object.values(foundUser.roles),
        accessToken: accessToken,
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "The email or password you entered is incorrect.",
      });
    }
  },
  async handleRefreshToken(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    let email;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          //clear expired refresh token from database
          const emp = await Employees.findOne({
            where: {
              refreshToken: {
                [Op.contains]: [refreshToken],
              },
            },
          });

          await Employees.update(
            {
              refreshToken: emp.refreshToken.filter(
                (rt) => rt !== refreshToken
              ),
            },
            {
              where: {
                email: emp.email,
              },
            }
          );

          return res.status(403).json({ message: "expired refresh token" });
        }
        email = decoded.email;
      }
    );

    if (email === undefined) return;

    const foundUser = await Employees.findOne({
      where: {
        email: email,
        refreshToken: {
          [Op.contains]: [refreshToken],
        },
      },
    });

    //Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.sendStatus(403); //Forbidden
          // console.log('attempted refresh token reuse!')
          await Employees.update(
            { refreshToken: [] },
            { where: { email: decoded.email } }
          );
        }
      );
      return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          await Employees.update(
            { refreshToken: [...newRefreshTokenArray] },
            {
              where: {
                email: foundUser.email,
              },
            }
          );
        }
        if (err || foundUser.email !== decoded.email)
          return res.status(403).json({ message: "expired refresh token" });

        // Refresh token was still valid
        const accessToken = jwt.sign(
          {
            uid: foundUser.id,
            email: foundUser.email,
            roles: Object.values(foundUser.roles),
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
          { uid: foundUser.id, email: foundUser.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        // Saving refreshToken with current employee
        await Employees.update(
          { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
          {
            where: {
              email: foundUser.email,
            },
          }
        );

        //Creates Secure Cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ uid: foundUser.id, accessToken: accessToken });
      }
    );
  },
  async currentUser(req, res) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "expired access token" });
      res.status(200).json({ uid: decoded.uid, roles: [...decoded.roles] });
    });
  },
  async handleLogout(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    let email;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        email = decoded.email;
      }
    );

    const foundUser = await Employees.findOne({
      where: {
        email: email,
        refreshToken: {
          [Op.contains]: [refreshToken],
        },
      },
    });

    // Is refreshToken in db?
    if (foundUser) {
      // Delete refreshToken in db
      await Employees.update(
        {
          refreshToken: foundUser.refreshToken.filter(
            (rt) => rt !== refreshToken
          ),
        },
        {
          where: {
            email: foundUser.email,
          },
        }
      );
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.sendStatus(204);
  },
};
