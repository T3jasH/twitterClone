const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config')
const mysql = require('../../utils/mysql');
const auth = require('../../middleware/auth')



const validate = (password) =>{
    const check = new RegExp(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{6,20}$/);
    const space = new RegExp(/[\s]/);
    return check.test(password) && !space.test(password);
}
const valName = (name) =>{
    const check = new RegExp(/[^a-zA-Z\s]/);
    return !check.test(name) && name.length<=25;
}
const valEmail = (email) => {
    const check = new RegExp(/^.+@.+\..+/);
    const space = new RegExp(/\s/);
    return check.test(email) && !space.test(email);
}
const valUsername = (username) =>{
    const check = new RegExp(/[^0-9a-zA-Z]/);
    const space = new RegExp(/\s/);
    return !check.test(username) && !space.test(username) && username.length <=15;
}

router.post('/register', async (req, res)=>{
    const {name, email, password, username} = req.body;
    
    if(!name || !email || !password || !username) return res.status(400).json({msg : "Please fill all details"})

    if(!valName(name)) return res.status(400).json({msg : "Name cannot contain special characters, and must have less than 26 characters"}) 
    
    if(!valEmail(email)) return res.status(400).json({msg : "Please enter valid email id"}) 
    
    if(!valUsername(username)) return res.status(400).json({msg : "Username cannot contain special characters or space, and cannot start with numbers, and must have less than 16 characters"}) 
    
    if(!validate(password)) return res.status(400).json({msg : "Password must contain 6 to 20 characters, and contain at least one special character, digit and letter"});

    const connection = await mysql.connection();
    
    
    const user = await connection.query("SELECT * FROM user WHERE username = ?", username)
    if(user[1]) console.log(user[1])
    if(user[0])  return res.status(400).json({msg : "Username already taken"})

    const mail = await connection.query("SELECT * FROM user WHERE email = ?", email)
    if(mail[1]) console.log(mail[1])
    if(mail[0])  return res.status(400).json({msg : "Email already taken"})

    bcrypt.genSalt(10, (err, salt)=>{
        if(err) throw err;
        bcrypt.hash(password, salt, async (err, hash)=>{
            if(err) throw err;
            const query = await connection.query("INSERT INTO user (name, username, email, password, joined) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP)", [name, username, email, hash]);
            connection.release();
            jwt.sign({id : username}, config.get("jwtsecret"), (err, token)=>{
                if(err) throw err
                res.json({
                    user :
                    {name : name, username : username, email : email},
                    token : token
                })
                console.log()
            })
        })  
    })
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({msg : "Please fill all details"});
        
    if(!valEmail(email)) return res.status(400).json({msg : "Invalid email ID"});
        
    if(!validate(password)) return res.status(400).json({msg : "Invalid password"});

    const connection = await mysql.connection();

    const user = await connection.query("SELECT * FROM user where email = ?", email);
    connection.release();
    if(user[1]) return console.log(user[1]);
    if(!user[0]){
        return res.status(400).json({msg : "Email ID does not exist"});
    }
    else {
        bcrypt.compare(password, user[0].password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({msg : "Password and email ID do not match"});
            else{
                jwt.sign(
                    {id : user[0].username},
                    config.get("jwtsecret"),
                    (err, token)=>{
                        if(err) console.log(err);
                        else{
                            return res.json({
                                token, 
                                user
                            })
                        }
                    }
                )
            }
        })
    }
})
// GET current user
router.get('/user', auth, async (req, res)=>{
    const connection = await mysql.connection();
    const query = await connection.query("SELECT * FROM user WHERE username = ?", req.user.id);
    connection.release();
    if(query[1]) return console.log(query[1])
    if(query[0]){
        res.json(query[0])
    }
    
})
// Find any user by username
router.post('/profile', async (req, res)=>{
    const username = req.body.username;
    const connection = await mysql.connection();
    const query = await connection.query("select user.*, follow.followed_by from user left join follow on user.username = follow.user where user.username = ? ", username);
    connection.release();
    res.json(query)
    
})

// Modify follow
router.post('/follow', auth, async (req, res)=>{
    const curr = req.user.id;
    const username = req.body.username;
    const follow = req.body.follow;
    const connection = await mysql.connection();
    const query = await connection.query("CALL updateFollow(?, ?, ?)", [username, curr, follow]);
    connection.release();
    res.json({})
})
// Delete account
router.get('/delete', auth, async (req, res)=>{
    const id = req.user.id;
    const connection = await mysql.connection();
    const query = await connection.query("CALL deleteUser(?)", id);
    connection.release();
    res.json({});
})
module.exports = router;