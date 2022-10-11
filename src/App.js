import './App.css';

import React from "react";
import ReactDOM from "react-dom"
import MapChart from "./MapChart";

const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", 
                "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
                "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
                "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
                "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
                "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
                "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
                "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
                "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
                "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]

function initialize(){
    createButtons();
}

function createButtons(){
    var buttons = document.getElementById("buttons");
    var html = "";
    for(let i = 0; i < 50; i++){
        html += '<button class="state" id="' + states[i].toLowerCase() + '" onclick="getInfo(\'' + states[i].toLowerCase() + '\')">' + states[i] + '</button>'
    }
    buttons.innerHTML = html;
}

function chooseUI(type){
    if(type == "map"){
        document.getElementById("mapUI").style.display = "block";
        document.getElementById("basicUI").style.display = "none";
    }else{
        document.getElementById("mapUI").style.display = "none";
        document.getElementById("basicUI").style.display = "block";
    }
}
function getInfo(stateName){
    var display = document.getElementById("display");
    display.innerText = "you clicked on the " + stateName + " button";
}


/*----------REACT----------*/
function App() {
  initialize();
}

const displayElement = document.getElementById("display");
ReactDOM.render(<App />, displayElement);


var NewComponent = React.createClass({
    render: function() {
      return (
        <div>
          <meta charSet="UTF-8" />
          <title>Relocation Assistant</title>
          <link rel="stylesheet" href="style.css" />
          <div id="menu">
            <button className="menuButton" id="mapUIButton" onclick="chooseUI('map')">Map Version</button>
            <button className="menuButton" id="basicUIButton" onclick="chooseUI('basic')">Basic Version</button>
          </div>
          <div id="mapUI">
          </div>
          <div id="basicUI">
            <div id="buttons">
              <p>LOAD FAILED</p>
            </div>
            <div id="display">
              <p>INFO</p>
            </div>
          </div>
        </div>
      );
    }
  });