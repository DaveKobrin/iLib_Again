const express = require('express');
const router = express.Router();
const Media = require('../models/media.js');

const getDropdownData = (req,res,next) => {
    const filter = {}; //filter to return all items if currentUser is admin
    if (!req.session.currentUser.admin) //otherwise only return currentUser's documents
        filter.user = req.session.currentUser.username;
    Media.find(filter, (err, entries)=>{
        if(err)
            res.send(err);
        else {
            const dropdownData = {
                format: [],
                creatorName: [],
                creatorType: [],
                location: [],
                tags: []
            }
            for (const entry of entries) {
                dropdownData.format.push(entry.format);
                dropdownData.creatorName.push(entry.creator_name);
                dropdownData.creatorType.push(entry.creator_type);
                dropdownData.location.push(entry.location);
                for(const tag of entry.tags) {
                    dropdownData.tags.push(tag);
                }
            }
            dropdownData.format = [...new Set(dropdownData.format)];
            dropdownData.creatorType = [...new Set(dropdownData.creatorType)];
            dropdownData.location = [...new Set(dropdownData.location)];
            dropdownData.tags = [...new Set(dropdownData.tags)];
            req.body.dropdownData = dropdownData;
            next();
        }
    });
}

const authRequired = (req, res, next) => {
	if(req.session.currentUser){
		// a user is signed in
		next()
	} else {
		// if there is no user redirect to sign in
		res.redirect('/user/signin')
	}
}

// SEED
router.get('/seed', authRequired, (req,res)=>{
    if (!req.session.currentUser.admin) {
        const data = require('../models/media_seed.js');
        for(const el of data){
            el.user = req.session.currentUser.username
        }
        Media.create(data);
        res.redirect('/media');
    } else {
        res.send('admin users cannot create new entries');
    }
});

// INDEX
router.get('/',authRequired, getDropdownData, (req,res)=>{
    const filter = {}; //filter to return all items if currentUser is admin
    if (!req.session.currentUser.admin) //otherwise only return currentUser's documents
        filter.user = req.session.currentUser.username;
    Media.find(filter, (err, entries)=>{
        if (err) res.send(err);
        else res.render('media/index.ejs', { entries, dropdownData:req.body.dropdownData });
    });
});

// NEW
router.get('/new', authRequired, getDropdownData, (req,res)=>{
    if (!req.session.currentUser.admin)
        res.render('media/new.ejs', { dropdownData:req.body.dropdownData });
    else
        res.send('admin users cannot create new entries');
});

// SHOW
router.get('/:id', authRequired, (req,res)=>{
    Media.findById(req.params.id, (err, entry)=>{
        if(err) res.send(err);
        else res.render('media/show.ejs',{ entry });
    })
}); 

// EDIT
router.get('/:id/edit', authRequired, getDropdownData, (req,res)=>{
    const userInfo = {userIsAdmin: req.session.currentUser.admin}
    Media.findById(req.params.id, (err, entry)=>{
        if(err) res.send(err);
        else {
            userInfo.user = entry.user
            res.render('media/edit.ejs',{ entry, dropdownData:req.body.dropdownData, userInfo });
        }
    })
});

// CREATE
router.post('/', authRequired, (req,res)=>{
    if (!req.session.currentUser.admin) {
        req.body.user = req.session.currentUser.username;
        req.body.tags = (typeof(req.body.tags)===Array?req.body.tags.join(', '):req.body.tags).split(', ');
        Media.create(req.body); 
        res.redirect('/media')
    } else
        res.send('admin users cannot create new entries');
});

// DELETE
router.delete('/:id', authRequired, (req,res)=>{
    Media.findByIdAndDelete(req.params.id, (err, entry)=>{
        if(err) res.send(err);
        else res.redirect('/media');
    })
});

// PUT
router.put('/:id', authRequired, (req,res)=>{
    req.body.tags = (typeof(req.body.tags)===Array?req.body.tags.join(', '):req.body.tags).split(', ');
    Media.findById(req.params.id, (err, entry)=>{
        if(err) res.send(err);
        else {
            entry.upc          = req.body.upc; 
            entry.title        = req.body.title; 
            entry.creator_name = req.body.creator_name;         
            entry.creator_type = req.body.creator_type;         
            entry.cover_img    = req.body.cover_img;     
            entry.cover_alt    = req.body.cover_alt;     
            entry.format       = req.body.format;     
            entry.location     = req.body.location;     
            entry.tags         = req.body.tags; 
            entry.desc         = req.body.desc; 
            entry.save();
            res.redirect('back');
        }
    })
});


module.exports = router;