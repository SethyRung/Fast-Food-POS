module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      roles: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
