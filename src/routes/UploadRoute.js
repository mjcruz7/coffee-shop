const express = require('express');
const fileUpload = require('express-fileupload');
const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.post('/upload/:type/:id', (req, res) => {
    const { type, id } = req.params;

    if (!req.files) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'File not found.'
            }
        });
    }

    const allowedTypes = [
        process.env.USER_IMAGE_FOLDER,
        process.env.PRODUCT_IMAGE_FOLDER
    ];

    if (allowedTypes.indexOf(type) < 0) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Invalid type.'
            }
        });
    }

    const file = req.files.file;
    let fileName = file.name;
    const allowedExtensions = [
        'png',
        'jpg',
        'jpeg'
    ];

    const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

    if (allowedExtensions.indexOf(ext) < 0) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Invalid file extension.'
            }
        });
    }

    const dest = path.resolve(__dirname, `../../${process.env.UPLOAD_FOLDER}/${type}`);
    fileName = `${id}-${ new Date().getTime()}.${ext}`;

    file.mv(`${dest}/${ fileName }`, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        switch (type) {
            case process.env.USER_IMAGE_FOLDER:
                validateUser(id, res, dest, fileName);
                break;
            case process.env.PRODUCT_IMAGE_FOLDER:
                validateProduct(id, res, dest, fileName);
                break;
        }
    });
});

const validateUser = (id, res, pathURL, fileName) => {
    UserModel.findById(id, (err, userDB) => {
        if (err) {
            fs.unlinkSync(`${pathURL}/${fileName}`);

            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!userDB) {
            fs.unlinkSync(`${pathURL}/${fileName}`);

            return res.status(500).json({
                success: false,
                error: {
                    message: 'User not found.'
                }
            });
        }

        const oldImgPath = `${pathURL}/${userDB.img}`;

        userDB.img = fileName;
        userDB.save((err, userUpdated) => {
            if (err) {
                fs.unlinkSync(`${pathURL}/${fileName}`);

                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            if (userDB.img && fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }

            res.json({
                success: true,
                data: {
                    user: userUpdated
                }
            });
        });
    });
};

const validateProduct = (id, res, pathURL, fileName) => {
    ProductModel.findById(id, (err, productDB) => {
        if (err) {
            fs.unlinkSync(`${pathURL}/${fileName}`);

            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (!productDB) {
            fs.unlinkSync(`${pathURL}/${fileName}`);

            return res.status(500).json({
                success: false,
                error: {
                    message: 'Product not found.'
                }
            });
        }

        const oldImgPath = `${pathURL}/${productDB.img}`;

        productDB.img = fileName;
        productDB.save((err, productUpdated) => {
            if (err) {
                fs.unlinkSync(`${pathURL}/${fileName}`);

                return res.status(500).json({
                    success: false,
                    error: err
                });
            }

            if (productDB.img && fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }

            res.json({
                success: true,
                data: {
                    product: productUpdated
                }
            });
        });
    });
};

module.exports = app;