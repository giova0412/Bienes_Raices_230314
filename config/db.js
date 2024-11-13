import { Sequelize } from "sequelize";

const db = new Sequelize('bienesraices_230314', 'root', '1234',{
    host: 'localhost',
    port: '3307',
    dialect: 'mysql',
    define:{
        timestamps: true
    },

    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 1000
    },
    operatorAliases: false
});

export default db;