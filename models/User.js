import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../db/config.js";

const User = db.define(
  "User",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Garantiza que no haya correos duplicados
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    token: DataTypes.STRING,
    confirm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Valor predeterminado
    },
  },
  {
    hooks: {
      beforeCreate: async function (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async function (user) {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;