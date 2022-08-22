const express = require('express');
const router = express.Router();
const Media = require('../models/media.js');


const authRequired = (req, res, next) => {
	if(req.session.currentUser){
		// a user is signed in
		next()
	} else {
		// if there is no user
		res.send('You must be logged in to do that!')
		// res.redirect('/user/signin')
	}
}

// SEED
router.get('/seed', (req,res)=>{
    const data = {
        upc: 9780984782857,
        title: "Cracking the Coding Interview",
        creator_name: "Gayle Laakmann McDowell",
        creator_type: "author",
        cover_img: "https://www.crackingthecodinginterview.com/uploads/6/5/2/8/6528028/header_images/1435811319.jpg",
        cover_alt: "Cracking the Coding Interview, 189 Programming Questions and Solutions",
        format: "Book",
        location: "Office",
        tags: ["Self-Help", "Programming", "Interview Prep", "Algorithms"],
        desc: "A large selection of coding interview questions and solutions used by many top tech companies durring the hiring process."
    }

    Media.create(data);
    res.redirect('/media');
});

// INDEX
router.get('/', (req,res)=>{
    Media.find({}, (err, entries)=>{
        if (err)
            res.send(err);
        else
        res.render('media/index.ejs', { entries });
    });
    })

    // NEW
router.get('/new', (req,res)=>{res.render('media/new.ejs')});

// SHOW
router.get('/:id', (req,res)=>{
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
router.post('/', (req,res)=>{
    // req.body.shipIsBroken = (req.body.shipIsBroken === 'on' || req.body.shipIsBroken === true)? true : false;
    Media.create(req.body); 
    res.redirect('/media')
});

// DELETE
router.delete('/:id', (req,res)=>{
    Media.findByIdAndDelete(req.params.id, (err, entry)=>{
        if(err)
            res.send(err);
        else
            res.redirect('/media');
    })
});

// PUT
router.put('/:id', (req,res)=>{
    // req.body.shipIsBroken = (req.body.shipIsBroken === 'on' || req.body.shipIsBroken === true)? true : false;
    Media.findByIdAndUpdate(req.params.id, req.body, (err, entry)=>{
        if(err)
            res.send(err);
        else
            res.redirect('back');
    })
});


module.exports = router;