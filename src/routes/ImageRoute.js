const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const { validateImageToken } = require('../middlewares/AuthMiddleware');

app.get('/image/:type/:id', validateImageToken, (req, res) => {
    const { type, id } = req.params;
    const imagePath = path.resolve(__dirname, `../../${process.env.UPLOAD_FOLDER}/${type}/${id}`);

    if (!fs.existsSync(imagePath)) {
        return res.sendFile(path.resolve(__dirname, '../assets/img/404.png'));
    }

    res.sendFile(imagePath);
});

module.exports = app;