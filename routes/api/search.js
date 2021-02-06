const express = require('express');
const router = express.Router();
const mysql = require('../../utils/mysql');

router.post('/', async (req, res)=>{
    const name = req.body.name;
    
    const connection = await mysql.connection();
    const query = await connection.query("SELECT name, username, display_pic, about, isVerified FROM USER WHERE LOWER(name) LIKE ? OR LOWER(username) LIKE ? ORDER BY followers_cnt DESC",
    [
        `${name}%`,
        `${name}%`
    ]
    )
    res.json(query)
})

module.exports = router