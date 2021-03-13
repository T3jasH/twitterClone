const mysql = require("mysql");
const config = require('config')

let dbConfig = {
  connectionLimit: 0, // default 10
  waitForConnections : true,
  queueLimit : 0,
  host: "twitterclonemysql.cw4b8gjl3wn9.us-east-2.rds.amazonaws.com" ,
  user: config.get("username"),
  password: config.get("password"),
  database: config.get("database"),
  timezone : "+0530"
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