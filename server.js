const mongoose = require('mongoose')
const express = require('express')
const parser = require('body-parser');
const stateData = require('./public/StateData.json');
const port = 80;
const cors = require("cors");

const app = express();
app.use(parser.json() );
app.use(parser.urlencoded({ extended: true })); 
app.use(cors());

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/relocation';

var Schema = mongoose.Schema;
var StateSchema = new Schema({
    name: String,
    rent: Number,
    electricity: Number,
    gas: Number,
    water: Number,
    sewer: Number,
    cable: Number,
    internet: Number
})
var State = mongoose.model('State', StateSchema)

mongoose.connect(mongoDBURL, { useNewUrlParser: true});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function initializeDB(){
    let length = Object.keys(stateData).length; // length should be 50
    for(let i = 0; i < length; i++){
        var stateName = Object.keys(stateData)[i];
        var s = new State({
            name: stateName,
            rent: stateData[stateName].Rent,
            electricity: stateData[stateName].Electricity,
            gas: stateData[stateName].Gas,
            water: stateData[stateName].Water,
            sewer: stateData[stateName].Sewer,
            cable: stateData[stateName].Cable,
            internet: stateData[stateName].Internet,
        });
        s.save(
            function(err) {
                if (err) {return; }
            }
        );
    }
    console.log("Initialized Database");
}
// only use this if this is the first time running it
//initializeDB();
app.get('/get/:stateName', (req, res) => {
    State.findOne({name: req.params.stateName}).exec( (err, result) => {
        if (err || !result){
            return res.end("ERROR");
        } else{
            res.end(JSON.stringify(result));
        }
    })
});


app.listen(port, 
    function () {
    console.log(`Server running at http://localhost:${port}/`);
});