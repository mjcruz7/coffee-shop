const express = require('express');
const app = express();

app.use(require('./AuthRoute'));
app.use(require('./UserRoute'));
app.use(require('./CategoryRoute'));
app.use(require('./ProductRoute'));
app.use(require('./UploadRoute'));
app.use(require('./ImageRoute'));
app.use(require('./ViewRoute'));

module.exports = app;