const express = require('express');
const router = express.Router();
const Media = require('../models/media.js');


const authRequired = (req, res, next) => {
	if(req.session.currentUser){
		// a user is signed in
		next()
	} else {
		// if there is no user
		// res.send('You must be logged in to do that!')
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
router.get('/',authRequired, (req,res)=>{
    const filter = {user: req.session.currentUser.username};
    Media.find(filter, (err, entries)=>{
        if (err)
        res.send(err);
        else {
        let mediaList = [];
        for (const entry of entries) {
            mediaList.push(entry.format);
        }
        mediaList = [...new Set(mediaList)]
        res.render('media/index.ejs', { entries, mediaList });
        }
    });
    })

// NEW
router.get('/new', authRequired, (req,res)=>{res.render('media/new.ejs')});

// SHOW
router.get('/:id', authRequired, (req,res)=>{
    Media.findById(req.params.id, (err, entry)=>{
        if(err)
            res.send(err);
        else
            res.render('media/show.ejs',{ entry });
    })
}); 

// EDIT
router.get('/:id/edit', authRequired, (req,res)=>{
    Media.findById(req.params.id, (err, entry)=>{
        if(err)
            res.send(err);
        else
            res.render('media/edit.ejs',{ entry });
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
        if(err)
            res.send(err);
        else
            res.redirect('/media');
    })
});

// PUT
router.put('/:id', authRequired, (req,res)=>{
    req.body.user = req.session.currentUser.username;
    req.body.tags = (typeof(req.body.tags)===Array?req.body.tags.join(', '):req.body.tags).split(', ');
    Media.findByIdAndUpdate(req.params.id, req.body, (err, entry)=>{
        if(err)
            res.send(err);
        else
            res.redirect('back');
    })
});


module.exports = router;