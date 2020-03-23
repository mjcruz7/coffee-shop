require('./src/config/Config');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const connectMongoDB = require('./src/db/MongoDB');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(require('./src/routes/IndexRoute'));

app.listen(process.env.PORT, () => {
    console.log(`Server Online`);

    connectMongoDB().then(data => {
        console.log(`Connected To Database ${data.connections[0].name}`);
    }).catch(err => {
        console.log('DB Error', err.message);
    });
});