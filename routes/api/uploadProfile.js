const express = require('express');
const router = express.Router();
const mysql = require('../../utils/mysql');
const multer = require('multer');
const fs = require('fs');
const auth = require('../../middleware/auth');
const path = require('path');

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        cb(null, false);
    }
    else cb(null, true);
    
};

const dispStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, 'client/public/display');
    },
    filename : (req, file, cb) =>{
        cb(null, `${String(Date.now())}${req.user.id}${path.extname(file.originalname)}`)
    }
})
const dispUpload = multer({fileFilter : imageFilter, storage: dispStorage});

// POST display pic

router.post('/display', auth, dispUpload.single('display'), async (req, res)=>{
    if(req.fileValidationError){
        res.status(400).json({msg : "Please upload jpeg / png/ jpg"});
    }
    else if(req.file){
        const img = req.header("x-display");
        try {
        if(img) fs.unlinkSync(`./client/public/display/${img}`)
         }
        catch(e) { console.log(e) }
        const connection = await mysql.connection();
        const query = await connection.query("UPDATE user SET display_pic = ?  WHERE username = ?", [
            req.file.filename,
            req.user.id
        ]
        );
        if(JSON.parse(JSON.stringify(query)).changedRows) res.status(200).json({display : req.file.filename})
        else res.json({msg : "Failed"})
    }
    else res.json({msg : "Unknown error"})
})


const covStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, 'client/public/cover');
    },
    filename : (req, file, cb) => 
        cb(null, `${String(Date.now())}${req.user.id}${path.extname(file.originalname)}`)
})
const covUpload = multer({storage: covStorage, fileFilter : imageFilter})

// POST cover pic

router.post('/cover', auth, covUpload.single('cover'), async (req, res)=>{
    if(req.fileValidationError){
        res.status(400).json({msg : "Please upload jpeg / png / jpg"});
    }
    else if(req.file){
        const connection = await mysql.connection();
        const img = req.header("x-cover");
        try {
        if(img) fs.unlinkSync(`./client/public/cover/${img}`)
         }
        catch(e) { console.log(e) }
        const query = await connection.query("UPDATE user SET cover_pic = ?  WHERE username = ?", [
            req.file.filename,
            req.user.id
        ]
        );
        if(JSON.parse(JSON.stringify(query)).changedRows) res.status(200).json({cover : req.file.filename})
        else res.json({msg : "Failed"})
    }
    else res.json({msg : "Unknown error"})
})

// POST user bio

router.post('/about', auth, async (req, res)=>{
    const connection = await mysql.connection();
    const query = await connection.query("UPDATE user SET about = ? WHERE username = ?", [
        req.body.bio, 
        req.user.id
    ]);
    res.send({bio : req.body.bio})
    
})

module.exports = router 