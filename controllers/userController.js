const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');


//routes
router.get('/register', (req,res)=>{res.render('users/register.ejs')});

router.post('/register', (req,res)=>{
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    // console.log(req.body);
    User.findOne({username: req.body.username}, (err, userExists)=>{
        if(userExists) {
            res.send('username is taken')
        } else {
            User.create(req.body, (err,data)=>{
                if(err) res.send(err.message);
                else {
                    console.log(data)
                    res.redirect('/');
                }
            })
        }
    })
});

router.get('/signin', (req,res)=>{res.render('users/signin.ejs')});

router.post('/signin', (req,res)=>{ 
    User.findOne({username: req.body.username}, (err, user)=>{
        if(err) res.send(err.message);
        else if (user) {
            const validLogin = bcrypt.compareSync(req.body.password, user.password);
            if (validLogin) {
                req.session.currentUser = user;
                res.redirect('/');
            } else {
                res.send('credentials do not match');
            }
        } else {
            res.send('Invalid user');
        }
    });
});

// destroy session
router.get('/signout', (req,res)=> { req.session.destroy(); res.redirect('/')});
module.exports = router;