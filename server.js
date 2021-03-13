const express =  require('express');
const app = express();
const config = require('config');

username = config.get("username")
password = config.get("password")

app.use(express.json());

app.use('/api/auth/', require('./routes/api/auth'));
app.use('/api/upload', require('./routes/api/uploadProfile'));
app.use('/api/tweet', require('./routes/api/tweet'));
app.use('/api/search', require('./routes/api/search'));
app.use('/api/notifications', require('./routes/api/notifications'))
const port = 5000;

app.listen(port, ()=> console.log(`Connected to port ${port}`));

// var firebaseConfig = {
//     apiKey: "AIzaSyBpqoLonsMh9Jm3rsBcpAXLsHIDCUgnx3A",
//     authDomain: "twitter-clone-30298.firebaseapp.com",
//     projectId: "twitter-clone-30298",
//     storageBucket: "twitter-clone-30298.appspot.com",
//     messagingSenderId: "809402255367",
//     appId: "1:809402255367:web:8c783081b3639549c182a2",
//     measurementId: "G-V7GLYPE96M"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();