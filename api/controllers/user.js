const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already exits"
                });
            } else {
                bcrypt.hash(req.body.password, 12).then(function (error, hash) {
                    if (error) {
                        return res.status(500).json({
                            error: error
                        });
                    } else {
                        // Store hash in your password DB.
                        const user = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(user => {
                                console.log(user);
                                res.status(201).json({
                                    message: "User Created"
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    message: "Probem in creating user"
                                });
                            });
                    }
                });
            }
        });
}

exports.signin = (req, res, next) => {
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Authentication failed"
                });
            } else {
                //comparing entered password by user to the password sotred in the DB.
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Authentication failed"
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            userId: user[0]._id,
                            email: user[0].email,
                            username: user[0].username
                        }, "supersectet", {
                            expiresIn: "2h"
                        });
                        return res.status(200).json({
                            message: "Authentication Successful",
                            token: token
                        });
                    }
                    res.status(401).json({
                        message: "Authentication failed!"
                    })
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}

exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;
    User.remove({ _id: userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user deleted"
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}