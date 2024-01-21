const { User, sequelize } = require('../models')
const bcrypt = require('bcrypt')

module.exports = {
  async getPersonalDetails(req, res) {
    try {
      const user = await User.findByPk(req.query.uid, {
        attributes: ['profile_picture', 'username', 'email', 'gender', 'dob']
      })
      res.status(200).json({
        status: 'success',
        user: user
      })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'Something went wrong. Unable to retrieve user.' })
    }
  },
  async editPersonalDetails(req, res) {
    const { uid, profile_picture, username, email, gender, dob } = req.body
    if (!uid || !profile_picture || !username || !email || !gender || !dob)
      return res.status(400).json({ message: 'Insufficient data' })

    try {
      await User.update(
        {
          profile_picture: profile_picture,
          username: username,
          email: email,
          gender: gender,
          dob: dob
        },
        { where: { id: uid } }
      )
      res
        .status(200)
        .json({ status: 'success', message: 'You have successfully updated your data.' })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'success', message: 'You have unsuccessfully updated your data.' })
    }
  },
  async editPassword(req, res) {
    const { uid, currentPassword, newPassword } = req.body
    if (!uid || !newPassword || !currentPassword)
      return res.status(400).json({ message: 'Insufficient data' })

    const foundUser = await User.findByPk(uid)
    if (foundUser) {
      const match = await bcrypt.compare(currentPassword, foundUser.password)

      if (match) {
        try {
          const hashedPwd = await bcrypt.hash(newPassword, 10)
          await User.update(
            {
              password: hashedPwd
            },
            { where: { id: uid } }
          )
          res
            .status(200)
            .json({ status: 'success', message: 'You have successfully updated your password.' })
        } catch (e) {
          res
            .status(400)
            .json({ status: 'success', message: 'You have unsuccessfully updated your password.' })
        }
      } else {
        res.status(401).json({ message: 'The current password you entered is incorrect.' })
      }
    }
  }
}
