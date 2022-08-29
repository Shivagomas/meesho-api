const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');
const multer = require('multer');

const home = require('./routes/home');
const category = require('./routes/categories');
const product = require('./routes/products');
const user = require('./routes/users');
const auth = require('./routes/auth');
const winston = require('winston');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors());

app.use("/", home);
app.use("/api/category",category);
app.use("/api/products", product);
app.use('/api/user', user);
app.use('/api/auth',auth);

if(!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}

// image uploads
process.on('uncaughtException', (ex) => {
    winston.error(ex.message,ex);
    process.exit(1)
});

process.on('unhandledRejection',(ex) => {
    winston.error(ex.message,ex);
    process.exit(1);
})

winston.add(new winston.transports.File({filename: 'logfile.log'}))

const db = config.get('db');
mongoose.connect(db)
    .then(() => console.log(`Connecting to ${db}`))
    .catch(err => console.log(err.message))

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening the port ${port}`));

module.exports = server;
