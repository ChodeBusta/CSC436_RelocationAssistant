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

function startUp(){
    State.find({name: "Alabama"}).exec( function (err, results) {
        if(err){
            console.log("Server Error: Problem with Startup")
        }else if(results.length == 0){
            console.log("Database does not already exist, initializing database")
            initializeDB();
            console.log("Server startup complete")
        }else{
            console.log("Server startup complete")
        }
    })
}

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

startUp();

app.get('/get/:stateName', (req, res) => {
    if(req.params.stateName === "ALL"){ // Get every state
        State.find({}).exec( (err, result) => {
            if(err || !result){
                return res.end("ERROR");
            } else{
                res.end(JSON.stringify(result));
            }
        })
    }
    else{ // Get a specific state
        State.findOne({name: req.params.stateName}).exec( (err, result) => {
            if (err || !result){
                return res.end("ERROR");
            } else{
                res.end(JSON.stringify(result));
            }
        })
    }
});


app.listen(port, 
    function () {
    console.log(`Server running at http://localhost:${port}/`);
});