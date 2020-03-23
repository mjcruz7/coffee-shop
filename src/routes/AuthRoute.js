const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.get('/login', (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Invalid email or password.'
            }
        });
    }

    UserModel.findOne({
        active: true,
        email
    }, {
        name: 1,
        email: 1,
        role: 1,
        password: 1
    }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!userDB || !bcrypt.compareSync(password, userDB.password)) {
            return res.status(500).json({
                success: false,
                error: {
                    message: 'Invalid email or password.'
                }
            });
        }

        const token = jwt.sign({
            user: userDB
        }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME });

        res.json({
            success: true,
            data: {
                user: userDB
            },
            token
        });
    });
});

app.post('/google', async(req, res) => {
    let googleUser = await verify(req.body.token)
        .catch(err => {
            return res.status(500).json({
                success: false,
                error: err
            });
        });

    UserModel.findOne({
        email: googleUser.email
    }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (userDB) {
            if (!userDB.google) {
                return res.status(500).json({
                    success: false,
                    error: {
                        message: 'User must authenticate by email and password.'
                    }
                });
            } else {
                const token = jwt.sign({
                    user: userDB
                }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME });

                res.send({
                    success: true,
                    token
                });
            }
        } else {
            new UserModel({
                name: googleUser.name,
                email: googleUser.email,
                password: '_',
                img: googleUser.img,
                google: true
            }).save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err
                    });
                }

                const token = jwt.sign({
                    user: userDB
                }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME });

                res.send({
                    success: true,
                    token
                });
            });
        }
    });
});

const verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture
    };
};

module.exports = app;