import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path:'.env'})

const db = new Sequelize(process.env.BD_NOMBRE,process.env.BD_user , 
    process.env.BD_pass ?? '',{
    host: process.env.BD_host,
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