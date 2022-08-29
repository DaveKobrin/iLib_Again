const express = require('express');
const router = express.Router();
const Media = require('../models/media.js');

const getDropdownData = (req,res,next) => {
    const filter = {user: req.session.currentUser.username};
    Media.find(filter, (err, entries)=>{
        if(err)
            res.send(err);
        else {
            const dropdownData = {
                format: [],
                creatorType: [],
                location: [],
                tags: []
            }
            for (const entry of entries) {
                dropdownData.format.push(entry.format);
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
    const data = require('../models/media_seed.js');
    for(const el of data){
        el.user = req.session.currentUser.username
    }
    Media.create(data);
    res.redirect('/media');
});

// INDEX
router.get('/',authRequired, getDropdownData, (req,res)=>{
    const filter = {user: req.session.currentUser.username};
    Media.find(filter, (err, entries)=>{
        if (err) res.send(err);
        else res.render('media/index.ejs', { entries, dropdownData:req.body.dropdownData });
    });
});

// NEW
router.get('/new', authRequired, getDropdownData, (req,res)=>{res.render('media/new.ejs', { dropdownData:req.body.dropdownData })});

// SHOW
router.get('/:id', authRequired, (req,res)=>{
    Media.findById(req.params.id, (err, entry)=>{
        if(err) res.send(err);
        else res.render('media/show.ejs',{ entry });
    })
}); 

// EDIT
router.get('/:id/edit', authRequired, getDropdownData, (req,res)=>{
    Media.findById(req.params.id, (err, entry)=>{
        if(err) res.send(err);
        else res.render('media/edit.ejs',{ entry, dropdownData:req.body.dropdownData });
    })
});

// CREATE
router.post('/', authRequired, (req,res)=>{
    req.body.user = req.session.currentUser.username;
    req.body.tags = (typeof(req.body.tags)===Array?req.body.tags.join(', '):req.body.tags).split(', ');
    Media.create(req.body); 
    res.redirect('/media')
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
    req.body.user = req.session.currentUser.username;
    req.body.tags = (typeof(req.body.tags)===Array?req.body.tags.join(', '):req.body.tags).split(', ');
    Media.findByIdAndUpdate(req.params.id, req.body, (err, entry)=>{
        if(err) res.send(err);
        else res.redirect('back');
    })
});


module.exports = router;