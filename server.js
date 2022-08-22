require('dotenv').config();
const express = require('express');
const app = express();
const mediaController = require('./controllers/mediaController.js');
const userController = require('./controllers/userController.js');
const methodOverride = require('method-override');
const session = require('express-session');
const { render } = require('ejs');
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.listen(PORT, ()=>{ console.log(`Express listening to port : ${PORT}`)});

const mongoose = require('mongoose');	
const mongoURI = process.env.MONGODB_URI;
const db = mongoose.connection;
mongoose.connect(mongoURI);
db.on('error', (err)=> {console.log('ERROR! - ' + err.message)});
db.on('connected', ()=>{console.log(`Connected to - ${db.host} : ${db.port}`)});
db.on('disconnected', ()=>{console.log('disconnected from mongoDB')});

// MIDDLEWARE  
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// ROUTES 
app.use('/media', mediaController);
app.use('/user', userController);
app.get('/', (req,res)=>{ res.send('landing page route') });