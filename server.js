const mongoose = require('mongoose')
const express = require('express')
const parser = require('body-parser');
const port = 3000;

const app = express();
app.use(parser.json() );
app.use(parser.urlencoded({ extended: true })); 

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/relocation';

var Schema = mongoose.Schema;
var StateSchema = new Schema({
    name: String
})
var State = mongoose.model('State', StateSchema)

mongoose.connect(mongoDBURL, { useNewUrlParser: true});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(port,
    function () {
        console.log(`Server running at http://localhost${port}/`);
});