const express = require('express');
const app = express();
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware');
const CategoryModel = require('../models/CategoryModel');

app.get('/category', validateToken, (req, res) => {
    const query = req.query;
    const limit = Number(query.limit) || 0;
    const skip = Number(query.skip) || 0;
    const conditions = {};
    const userFields = {
        name: 1,
        email: 1
    };

    CategoryModel.find(conditions)
        .skip(skip)
        .limit(limit)
        .populate('user', userFields)
        .sort({ name: 'asc' })
        .exec((err, categoriesDB) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            CategoryModel.estimatedDocumentCount(conditions, (err, count) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err
                    });
                }

                const data = {
                    categories: categoriesDB,
                    total: count
                };

                res.send({
                    success: true,
                    data
                });
            });
        });
});

app.get('/category/:id', validateToken, (req, res) => {
    const id = req.params.id;

    CategoryModel.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!categoryDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Category not found.'
                }
            });
        }

        res.send({
            success: true,
            data: {
                category: categoryDB
            }
        });
    });
});

app.get('/category/search/:name', validateToken, (req, res) => {
    const name = req.params.name;
    const regex = new RegExp(name, 'i');
    const conditions = {
        name: regex
    };

    CategoryModel.find(conditions, (err, categoriesDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!categoriesDB) {
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
                categories: categoriesDB
            }
        });
    });
});

app.post('/category', [validateToken, validateRole], (req, res) => {
    const body = req.body;
    const user = req.user;
    const { name, description } = body;

    new CategoryModel({
        name,
        description,
        user: user._id
    }).save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                success: true,
                error: err
            });
        }

        res.status(201).json({
            success: true,
            data: {
                category: categoryDB
            }
        });
    });
});

app.put('/category/:id', [validateToken, validateRole], (req, res) => {
    const id = req.params.id;
    const update = {
        description: req.body.description
    };

    const options = {
        new: true,
        runValidators: true
    };

    CategoryModel.findByIdAndUpdate(id, update, options, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!categoryDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Categoría no encontrada.'
                }
            });
        }

        res.json({
            success: true,
            data: {
                category: categoryDB
            }
        });
    });
});

app.delete('/category/:id', [validateToken, validateRole], (req, res) => {
    const id = req.params.id;

    CategoryModel.findByIdAndDelete(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!categoryDB) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Categoría no encontrada.'
                }
            });
        }

        return res.json({
            success: true,
            data: {
                category: categoryDB
            }
        });
    });
});

module.exports = app;