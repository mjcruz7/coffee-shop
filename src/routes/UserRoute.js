const UserModel = require('../models/UserModel');
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware');

const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

app.get('/user', [validateToken, validateRole], (req, res) => {
    const query = req.query;
    const limit = Number(query.limit) || 0;
    const skip = Number(query.skip) || 0;
    const conditions = {
        active: true
    };
    const projection = {
        name: 1,
        email: 1,
        role: 1,
        img: 1,
        google: 1
    };

    UserModel.find(conditions, projection)
        .skip(skip)
        .limit(limit)
        .exec((err, usersDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            UserModel.estimatedDocumentCount(conditions, (err, count) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err
                    });
                }

                const data = {
                    users: usersDB,
                    total: count
                };

                res.json({
                    success: true,
                    data
                });
            });
        });
});

app.get('/user/:id', validateToken, (req, res) => {
    const id = req.params.id;

    UserModel.findById(id, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!userDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found.'
                }
            });
        }

        res.send({
            success: true,
            data: {
                user: userDB
            }
        });
    });
});

app.get('/user/search/:name', validateToken, (req, res) => {
    const name = req.params.name;
    const regex = new RegExp(name, 'i');
    const conditions = {
        name: regex
    };

    UserModel.find(conditions, (err, usersDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!usersDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'No search results.'
                }
            });
        }

        res.send({
            success: true,
            data: {
                users: usersDB
            }
        });
    });
});

app.post('/user', [validateToken, validateRole], (req, res) => {
    const body = req.body;

    const user = new UserModel();
    user.name = body.name;
    user.email = body.email;
    user.password = bcrypt.hashSync(body.password, Number(process.env.BCRYPT_ROUNDS));

    user.save((err, userDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        res.status(201).json({
            success: true,
            data: {
                user: userDB
            }
        });
    });
});

app.put('/user/:id', [validateToken, validateRole], (req, res) => {
    const body = req.body;
    const id = req.params.id;

    UserModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!userDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found.'
                }
            });
        }

        res.json({
            success: true,
            data: {
                user: userDB
            }
        });
    });

});

app.delete('/user/:id', [validateToken, validateRole], (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const softDelete = body.softDelete === false ? false : true;

    if (softDelete === true) {
        UserModel.findByIdAndUpdate(id, {
            active: false
        }, {
            new: true
        }, (err, userDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            if (!userDB) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'User not found.'
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    user: userDB
                }
            });
        });
    } else {
        UserModel.findByIdAndDelete(id, (err, userDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            if (!userDB) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'User not found.'
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    user: userDB
                }
            });
        });
    }
});

app.post('/user/admin', (req, res) => {
    const { email, password } = req.body;

    if (!(process.env.ADMIN_EMAIL === email && password, process.env.ADMIN_PASSWORD)) {
        return res.status(500).json({
            success: false,
            error: {
                message: 'Invalid email or password'
            }
        });
    }

    const user = new UserModel({
        email,
        name: process.env.ADMIN_NAME,
        password: bcrypt.hashSync(password, Number(process.env.BCRYPT_ROUNDS)),
        role: 'ADMIN_ROLE'
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        res.status(201).json({
            success: true,
            data: {
                user: userDB
            }
        });
    });
});

module.exports = app;