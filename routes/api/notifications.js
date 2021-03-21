const express = require('express');
const router = express.Router();
const mysql = require('../../utils/mysql');
const auth = require('../../middleware/auth');

router.get('/', auth,  async (req, res)=>{
    const connection = await mysql.connection();
    const query = await connection.query("SELECT COUNT(id) FROM notifications where user_to = ? && seen = 0", req.user.id);
    connection.release();
    res.json({count : query[0]['COUNT(id)']});
})

router.get('/list', auth, async (req, res)=>{
    const connection = await mysql.connection();
    let query = await connection.query("SELECT notifications.*, user.name, user.display_pic, tweet.content from notifications "+
    "LEFT JOIN user ON notifications.user_from = user.username " +
    "LEFT JOIN tweet ON notifications.tweet_id = tweet.id " +
    "WHERE notifications.user_to = ? ORDER BY sent_time DESC", req.user.id)
    res.json(query)
    query = connection.query("UPDATE notifications SET seen = 1 WHERE user_to = ?", req.user.id);
    connection.release();
})

router.post('/', async (req, res)=>{
    const {type, user_from, tweet_id, user_to} = req.body;
    const connection = await mysql.connection();
    let query = null;
    if(type===-1)
    query= connection.query("DELETE FROM notifications WHERE user_to = ? && user_from = ? and type = ?", [user_to, user_from, 0]);
    else 
    query = connection.query("INSERT INTO notifications (type, user_from , tweet_id, user_to, seen, sent_time) VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)", 
    [type, user_from, tweet_id, user_to])
    connection.release();
    res.json({})
})

module.exports = router;