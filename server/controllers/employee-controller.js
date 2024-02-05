const { Employees, sequelize } = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
  async getPersonalDetails(req, res) {
    try {
      const employee = await Employees.findByPk(req.query.uid, {
        attributes: ["profile_picture", "name", "email", "gender", "dob"],
      });
      res.status(200).json({
        status: "success",
        employee: employee,
      });
    } catch (e) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Something went wrong. Unable to retrieve employee.",
        });
    }
  },
  async editPersonalDetails(req, res) {
    const { uid, profile_picture, name, email, gender, dob } = req.body;
    if (!uid || !profile_picture || !name || !email || !gender || !dob)
      return res.status(400).json({ message: "Insufficient data" });

    try {
      await Employees.update(
        {
          profile_picture: profile_picture,
          name: name,
          email: email,
          gender: gender,
          dob: dob,
        },
        { where: { id: uid } }
      );
      res
        .status(200)
        .json({
          status: "success",
          message: "You have successfully updated your data.",
        });
    } catch (e) {
      res
        .status(400)
        .json({
          status: "success",
          message: "You have unsuccessfully updated your data.",
        });
    }
  },
  async editPassword(req, res) {
    const { uid, currentPassword, newPassword } = req.body;
    if (!uid || !newPassword || !currentPassword)
      return res.status(400).json({ message: "Insufficient data" });

    const foundEmployees = await Employees.findByPk(uid);
    if (foundEmployees) {
      const match = await bcrypt.compare(
        currentPassword,
        foundEmployees.password
      );

      if (match) {
        try {
          const hashedPwd = await bcrypt.hash(newPassword, 10);
          await Employees.update(
            {
              password: hashedPwd,
            },
            { where: { id: uid } }
          );
          res
            .status(200)
            .json({
              status: "success",
              message: "You have successfully updated your password.",
            });
        } catch (e) {
          res
            .status(400)
            .json({
              status: "success",
              message: "You have unsuccessfully updated your password.",
            });
        }
      } else {
        res
          .status(401)
          .json({ message: "The current password you entered is incorrect." });
      }
    }
  },
};
