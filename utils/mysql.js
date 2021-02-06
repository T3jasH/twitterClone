const mysql = require("mysql");
const config = require('config')

let dbConfig = {
  connectionLimit: 0, // default 10
  waitForConnections : true,
  queueLimit : 0,
  host: process.env.MYSQL_HOST || "localhost" ,
  user: "root",
  password: config.get("password"),
  database: "testbase",
  timezone : "+05:30"
};
const pool = mysql.createPool(dbConfig);
const connection = () => {
  return new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) reject(err);
    const query = (sql, binding) => {
      return new Promise((resolve, reject) => {
         connection.query(sql, binding, (err, result) => {
           if (err) reject(err);
           resolve(result);
           });
         });
       };
       const release = () => {
         return new Promise((resolve, reject) => {
           if (err) reject(err);
           resolve(connection.release());
         });
       };
       resolve({ query, release });
     });
   });
 };
// const query = (sql, binding) => {
//   return new Promise((resolve, reject) => {
//     pool.query(sql, binding, (err, result, fields) => {
//       if (err) reject(err);
//       resolve(result);
//     });
//   });

module.exports = { pool, connection};