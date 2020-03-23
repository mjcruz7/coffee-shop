const CategoryModel = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');
const UserModel = require('../models/UserModel');

const path = require('path');
const express = require('express');
const app = express();

app.engine('pug', require('pug').__express);

app.set('views', path.resolve(__dirname, '../views'));
app.set('view engine', 'pug');

app.get(`/${process.env.VIEW_ROUTE}`, (req, res) => {
    req.query.time = new Date().toLocaleString();
    res.render('index', req.query);
});

app.get(`/${process.env.VIEW_ROUTE}/category`, (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const skip = Number(req.query.skip) || 0;

    CategoryModel.find()
        .populate('user', 'name')
        .skip(skip)
        .limit(limit)
        .exec((err, categoriesDB) => {
            res.render('category/list', {
                categories: err ? [] : categoriesDB
            });
        });
});

app.get(`/${process.env.VIEW_ROUTE}/product`, (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const skip = Number(req.query.skip) || 0;
    const conditions = { active: true };

    ProductModel.find(conditions)
        .populate('category', 'name')
        .populate('user', 'name')
        .skip(skip)
        .limit(limit)
        .exec((err, productsDB) => {
            res.render('product/list', {
                products: err ? [] : productsDB
            });
        });
});

app.get(`/${process.env.VIEW_ROUTE}/user`, (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const skip = Number(req.query.skip) || 0;
    const conditions = { active: true };

    UserModel.find(conditions)
        .skip(skip)
        .limit(limit)
        .exec((err, usersDB) => {
            res.render('user/list', {
                users: err ? [] : usersDB
            });
        });
});

module.exports = app;