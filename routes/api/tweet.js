const express = require('express');
const router = express.Router();
const mysql = require('../../utils/mysql');
const multer = require('multer');
const auth = require('../../middleware/auth');
const path = require('path');


const imageFilter = function(req, file, cb) {
    if(!file) {
        cb(null, false);
    }
    else cb(null, true);
    
};

const tweetImageStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, 'client/public/tweetImage');
    },
    filename : (req, file, cb) =>{
        cb(null, `${String(Date.now())}${req.user.id}${path.extname(file.originalname)}`)
    }
})
const imageUpload = multer({fileFilter : imageFilter, storage: tweetImageStorage});

// POST tweet
router.post('/', auth, imageUpload.single('image'), async (req, res)=>{
    const content = req.header("content");
    const tweet_id = `${String(Date.now())}`;
    if(!req.file){
        // Upload content only
        const connection = await mysql.connection();
        const query = await connection.query("INSERT INTO tweet (id, username, content, sent_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)", [
            tweet_id,
            req.user.id,
            content
        ]);
        connection.release();
        if(JSON.parse(JSON.stringify(query)).affectedRows) res.json({tweet_id : tweet_id, user_to : null})
        else res.json({msg : "Failed"})
    }
    else if(req.file && !content){
        const connection = await mysql.connection();
        const query = await connection.query("INSERT INTO tweet (id, username, sent_time, image) VALUES (?, ?, CURRENT_TIMESTAMP, ?)",  
        [
            `${String(Date.now())}`,
             req.user.id,
             req.file.filename 
        ]
        );
        connection.release();
        if(JSON.parse(JSON.stringify(query)).changedRows) res.status(200).json({image : req.file.filename})
        else res.json({msg : "Failed"})
    }
    else if(req.file && content){
        const connection = await mysql.connection();
        const query = await connection.query("INSERT INTO tweet (id, username, sent_time, content, image) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)",
        [
            `${String(Date.now())}${req.user.id}`,
            req.user.id, 
            content,
            req.file.filename
        ]);
        connection.release();
        if(JSON.parse(JSON.stringify(query)).changedRows) res.json({tweet_id : tweet_id, user_to : null})
        else res.json({msg : "Failed"});
    }
    else res.json({msg : "Unknown error"}) 
})
// POST reply
router.post('/reply', auth, imageUpload.single('image'), async (req, res)=>{
    const content = req.header("content");
    const tweet_id = `${String(Date.now())}`;
    let img=null;
    if(req.file)
    img = req.file.filename;
    const username = req.user.id;
    const id = req.header("id");
    const connection = await mysql.connection();
    const query = await connection.query("CALL sendReply(?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
    [username, content, id, tweet_id, img]
    )
    connection.release();
    res.json({tweet_id : tweet_id, user_to : null});
})

// POST request to get tweet count
router.post('/count', async (req, res)=>{
    const {username} = req.body;
    const connection = await mysql.connection();
    const query = await connection.query("SELECT COUNT(id) FROM tweet WHERE username = ? " + 
    "AND id NOT IN (SELECT reply_id as id from replies where reply_by = ?);", [username, username]);
    connection.release();
    if(query[1]) res.status(400).json(query[1])
    else {
        res.json({count : query[0]['COUNT(id)']});
    }
})

//GET profile tweets
router.get('/profile/:username', auth, async (req, res)=>{
    // user whose profile is needed
    const username = req.params.username;
    const connection = await mysql.connection();
    const query = await connection.query("select tweet.*, user.name, user.isverified, user.name, user.display_pic, likes.liked_by from tweet "+
    "left join likes on tweet.id = likes.id " + 
    "left join user on tweet.username = user.username " + 
    "where tweet.username = ? and tweet.id not in (select reply_id as id from replies where reply_by = ?) " + 
    "order by tweet.sent_time desc", [username, username])
    connection.release();
    res.json(query)
})
// GET tweets of accounts followed by the user
router.get('/following', auth, async (req, res)=>{
    //current user
    const username = req.user.id;
    const connection = await mysql.connection();
    const query = await connection.query("select tweet.*, user.name, user.display_pic, user.isverified, likes.liked_by from tweet "+
    "left join likes on tweet.id = likes.id "+
    "left join follow on tweet.username = follow.user "+
    "left join user on user.username = follow.user"+
    " where follow.followed_by = ? and tweet.id not in (select reply_id as id from replies) " +
    "order by tweet.sent_time desc", username);
    connection.release();
    res.json(query);
})
//GET replies for an id
router.get('/replies/:id', auth, async (req, res)=>{
    const id = req.params.id;
    const connection = await mysql.connection();
    const query = await connection.query("select tweet.*, user.display_pic, user.isverified, user.name, likes.liked_by from tweet " + 
    "inner join replies on tweet.id = replies.reply_id "+ 
    "left join user on tweet.username = user.username " +
    "left join likes on tweet.id = likes.id where replies.reply_to = ?  order by tweet.sent_time desc", id);
    connection.release();
    res.json(query);
})
//Update likes
router.post('/likes', auth, async(req, res)=>{
    const add = req.body.like ? 1 : -1 , likedBy = req.user.id, tweetId = req.body.id;
    const connection = await mysql.connection();
    const query = await connection.query("CALL updateLikes(?, ?, ?)", [add, tweetId, likedBy]);
    connection.release();
    if(JSON.parse(JSON.stringify(query)).affectedRows) res.json({msg : "Success"})
    else res.status(400).json({msg : "Failed"})
})
// Get tweet by id
router.post('/id', auth, async (req, res)=>{
    const {id} = req.body;
    const connection = await mysql.connection();
    const query = await connection.query("SELECT tweet.*, likes.liked_by, user.name, user.isverified, user.display_pic from tweet " +
    "left join user on tweet.username = user.username "+
    "left join likes on tweet.id = likes.id WHERE tweet.id = ?" , id)
    connection.release();
    res.json(query);
})
//Post Trends
router.post('/trends', async (req, res)=>{
    const {hashtag, id} = req.body;
    const connection = await mysql.connection();
    const query = connection.query("INSERT INTO trends VALUES (?, ?)", [hashtag, id]);
    connection.release();
    res.json({})
})

// Get trends
router.get('/trends/:hashtag', async (req, res)=>{
    const {hashtag} = req.params;
    const connection = await mysql.connection();
    const query = await connection.query("SELECT trends.hashtag, tweet.*, user.isverified, user.name, user.display_pic, likes.liked_by FROM tweet " + 
    "LEFT JOIN likes ON tweet.id = likes.id "+
    "INNER JOIN trends on tweet.id=trends.tweet_id " + 
    "INNER JOIN user on tweet.username = user.username " +
    "WHERE trends.hashtag= ? ORDER BY tweet.sent_time DESC", hashtag);
    connection.release();
    res.json(query);
})

module.exports = router;