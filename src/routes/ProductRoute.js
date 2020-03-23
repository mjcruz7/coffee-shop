const express = require('express');
const app = express();
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware');
const ProductModel = require('../models/ProductModel');

app.get('/product', validateToken, (req, res) => {
    const query = req.query;
    const limit = Number(query.limit) || 0;
    const skip = Number(query.skip) || 0;
    const conditions = {};
    const userFields = {
        name: 1,
        email: 1
    };
    const categoryFields = {
        name: 1
    };

    ProductModel.find(conditions)
        .skip(skip)
        .limit(limit)
        .populate('user', userFields)
        .populate('category', categoryFields)
        .sort({ name: 'asc' })
        .exec((err, productsDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            ProductModel.estimatedDocumentCount(conditions, (err, count) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err
                    });
                }

                const data = {
                    products: productsDB,
                    total: count
                };

                res.send({
                    success: true,
                    data
                });
            });
        });
});

app.get('/product/:id', validateToken, (req, res) => {
    const id = req.params.id;

    ProductModel.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!productDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Product not found.'
                }
            });
        }

        res.send({
            success: true,
            data: {
                product: productDB
            }
        });
    });
});

app.get('/product/search/:name', validateToken, (req, res) => {
    const name = req.params.name;
    const regex = new RegExp(name, 'i');
    const conditions = {
        name: regex
    };

    ProductModel.find(conditions, (err, productsDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!productsDB) {
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
                products: productsDB
            }
        });
    });
});

app.post('/product', [validateToken, validateRole], (req, res) => {
    const body = req.body;
    const user = req.user;
    const { name, description, price, category } = body;
    const userId = user._id;

    new ProductModel({
        name,
        description,
        price,
        category,
        user: userId
    }).save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                success: true,
                error: err
            });
        }

        res.status(201).json({
            success: true,
            data: {
                product: productDB
            }
        });
    });
});

app.put('/product/:id', [validateToken, validateRole], (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const options = {
        new: true,
        runValidators: true
    };

    ProductModel.findByIdAndUpdate(id, body, options, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!productDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Product not found.'
                }
            });
        }

        res.json({
            success: true,
            data: {
                product: productDB
            }
        });
    });
});

app.delete('/product/:id', [validateToken, validateRole], (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const softDelete = body.softDelete === false ? false : true;

    if (softDelete === true) {
        ProductModel.findByIdAndUpdate(id, {
            active: false
        }, {
            new: true
        }, (err, productDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            if (!productDB) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Product not found.'
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    product: productDB
                }
            });
        });
    } else {
        UserModel.findByIdAndDelete(id, (err, productDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            if (!productDB) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Product not found.'
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    product: productDB
                }
            });
        });
    }
});

module.exports = app;