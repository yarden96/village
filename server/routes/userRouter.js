const express = require('express');
const { User } = require('../models/user');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/api/user/register', (req, res) => {
    const user = new User(req.body.user);

    user.save((err, doc) => {
        if(err) return res.json({seccess:false, error:err});
        res.status(200).json({ seccess:true, user: doc });
    })
})

router.post('/api/user/login', (req, res) => {
    User.findOne({'id': req.body.id}, (err, user) => {
        if (!user) return res.json({isAuth:false, message:'Auth failed, user not found'});

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.json({isAuth:false, message:'Auth failed, user not found'});
            if(!isMatch) return res.json({
                isAuth:false,
                message:'Wrong Password'
            });

            user.generateToken((err, user) => {
                if(err) return res.statusCode(400).send(err);
                res.cookie('auth', user.token)
                .json({
                    isAuth: true,
                    id: user._id,
                    name: user.name,
                    role: user.role
                });
            })

        })
    })
})

router.get('/api/user/logout', auth, (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if(err) return res.statusCode(400).send(err);
        res.sendStatus(200);
    })

})

router.post('/api/user/updateUser', (req, res) => {
    let user = req.body;
    User.updateOne({"id": user.id},{ $set: { ...user } }, (err, doc) => {
        if(err) return res.json({error:err});
        res.json({seccess: true, doc})
    })
})

router.get('/api/user/isAuth', auth, (req, res) => {
    res.json({ 
        isAuth: true,
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
     })
})

router.get('/api/user/getUsers', (req, res) => {
    User.find((err, docs) => {
        if(err) return res.json({error:err});
        res.json(docs)
    })
})

router.get('/api/user/getUser', (req, res) => {
    let query = req.query.search;
    if(isNaN(query)) {
        User.find(({ $or: [ { "name": {'$regex': query} }, 
                { "lastname": {'$regex': query} }, 
                { "id": {'$regex': query} }, 
                { "role": {'$regex': query} }] }) ,(err, doc) => {
            if(err) return res.send(err);
            if(!doc){
                return res.send('User Not Found');
            }
            return res.json(doc)
        })
    } else {
        User.find(({ $or: [ { "numberOfDuties": query }, 
                { "id": {'$regex': query} }] }) ,(err, doc) => {
            if(err) return res.send(err);
            if(!doc){
                return res.send('User Not Found');
            }
            res.json(doc)
        })
    }    
})

router.delete('/api/user/deleteUser', (req, res) => {
    User.deleteOne({id: req.query.id}, (err) => {
        if(err) return res.json({seccess: false, error: err});
        res.json({seccess: true})
    })
})

module.exports = router;