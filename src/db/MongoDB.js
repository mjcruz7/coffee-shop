const moongose = require('mongoose');

const driver = process.env.DB_DRIVER;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const db = process.env.DB_NAME;
const connectionURL = `${driver}://${user}:${password}@${host}/${db}`;

const connectMongoDB = () => {
    return moongose.connect(connectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
}

module.exports = connectMongoDB;