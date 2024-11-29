import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
}).promise()

const [rows] = await con.query("SELECT * FROM ClubFinder.Club")
console.log(rows)
