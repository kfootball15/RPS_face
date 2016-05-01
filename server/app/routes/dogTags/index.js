'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var DogTag = mongoose.model('DogTag')

// var ensureAuthenticated = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.status(401).end();
//     }
// };


router.post('/', function(req, res, next) {
    console.log("/dogTags router.post")
    DogTag.create(req.body)
    .then(function(dogtag) {
        res.status(201).send(dogtag);
    })
    .catch(next);
});

router.get('/:id', function(req, res, next) {
    console.log("GET /:id router.get")
    DogTag.find({user: req.params.id}).populate('user opponent')
    .then(function(dogTags){
        res.send(dogTags);
    })
    .catch(next);
});


// router.get('/:userId', function(req, res, next) {

//     User.findOne({_id: req.params.userId})
//     .then(function(user) {
//         res.send(user);
//     })
//     .then(null, next);
// });

// router.delete('/:userId', function(req, res, next) {
//     User.findOneAndRemove({_id: req.params.userId})
//     .then(function(response) {
//         res.send(response);
//     })
//     .then(null, next);
// });

// router.put('/:userId', function(req, res, next){
//     if (req.body.password){
//         User.findById(req.params.userId)
//         .then(function(user){
//             user.password = req.body.password;
//             user.passwordReset = false;
//            return user.save()
//         })
//         .then(function(response){
//             res.send(response)
//         })
//         .then(null, next)
//     }
//     else {
//         User.findByIdAndUpdate(req.params.userId, req.body, {new: true})
//         .then(function(response){
//             res.send(response)
//         })
//         .then(null, next)
//     }
// });


