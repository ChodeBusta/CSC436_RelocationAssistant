import React, { Component } from "react";
import { geoCentroid } from "d3-geo";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation
} from "react-simple-maps";

import allStates from "./data/allstates.json";
import {COLORS} from './data/constants.js'
import './style.css'

// Counties 
// const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/higher-quality-5m/5m-US-counties.json";

// US States
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const moveStates = [
    "Florida",
    "Michigan",
    "Louisiana",
    "Hawaii"
]

const offsets = {
    VT: [58, -12],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21]
};

const translate = {"Alabama": "AL",
    "Alaska": "AK","Arizona": "AZ","Arkansas": "AR","California": "CA","Colorado": "CO","Connecticut": "CT","Delaware": "DE",
    "Florida": "FL","Georgia": "GA","Hawaii": "HI","Idaho": "ID","Illinois": "IL","Indiana": "IN","Iowa": "IA",
    "Kansas": "KS","Kentucky": "KY","Louisiana": "LA","Maine": "ME","Maryland": "MD","Massachusetts": "MA","Michigan": "MI",
    "Minnesota": "MN","Mississippi": "MS","Missouri": "MO","Montana": "MT","Nebraska": "NE","Nevada": "NV","New Hampshire": "NH",
    "New Jersey": "NJ","New Mexico": "NM","New York": "NY","North Carolina": "NC","North Dakota": "ND","Ohio": "OH","Oklahoma": "OK",
    "Oregon": "OR","Pennsylvania": "PA","Rhode Island": "RI","South Carolina": "SC","South Dakota": "SD","Tennessee": "TN","Texas": "TX",
    "Utah": "UT","Vermont": "VT","Virginia": "VA","Washington": "WA","West Virginia": "WV","Wisconsin": "WI","Wyoming": "WY"}

class MapChart extends Component {
    constructor(props) {
        super(props);
        this.x = 0;
        this.id = [];
        this.geo = [];
        this.leftText = [];
        this.rightText = [];
        this.state = {salary: ''};
        this.prevColor = COLORS.primary;
        this.validateNumber = this.validateNumber.bind(this);
        this.id.push(null); this.id.push(null); this.geo.push(null); this.geo.push(null);


    }

    clearInfo(){
        this.leftText = "";
        this.rightText = "";
        this.x = 0;
        this.setState({salary: ''});
        this.resetMapColors();
        this.id.forEach(id => {
            var index = this.id.indexOf(id);
            this.geo[index].fill = COLORS.primary;
            this.id[index] = null;
            this.geo[index] = null;
        })
        this.forceUpdate();
    }

    showLessExpensive(){
        if (this.leftText.length > 1 && this.rightText.length < 1){
            this.resetMapColors();
            let sum1 = 0;
            for (let i = 2; i < this.leftText.length; i+=2) {
                let state1 = String(this.leftText[i]).split("$");
                sum1 += parseInt(state1[1]);
            }
            fetch("http://localhost:80/get/ALL", {method: 'get'})
            .then(res => res.json())
            .then(
                (result) => {
                    let sum2 = 0;
                    result.forEach(e => {
                        sum2 = e.rent + e.electricity + e.gas + e.water + e.sewer + e.cable + e.internet;
                        if(sum1 > sum2 && e.name != this.rightText[0]){
                            var thisState = document.getElementById(translate[e.name]);
                            thisState.style.fill = COLORS.secondary;
                        }
                    })
                    this.forceUpdate();
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
        }
    }

    showMoreExpensive(){
        if (this.leftText.length > 1 && this.rightText.length < 1){
            this.resetMapColors();
            let sum1 = 0;
            for (let i = 2; i < this.leftText.length; i+=2) {
                let state1 = String(this.leftText[i]).split("$");
                sum1 += parseInt(state1[1]);
            }
            fetch("http://localhost:80/get/ALL", {method: 'get'})
            .then(res => res.json())
            .then(
                (result) => {
                    let sum2 = 0;
                    result.forEach(e => {
                        sum2 = e.rent + e.electricity + e.gas + e.water + e.sewer + e.cable + e.internet;
                        if(sum1 < sum2 && e.name != this.rightText[0]){
                            var thisState = document.getElementById(translate[e.name]);
                            thisState.style.fill = COLORS.secondaryHighlight;
                        }
                    })
                    this.forceUpdate();
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
        }
    }
    
    utilityButtons(){
        const buttons = []
        // Clear
        buttons.push(this.createButton("Clear", () => this.clearInfo()))
        // Shows states less expensive than the one selected
        buttons.push(this.createButton("Show Less Expensive", () => this.showLessExpensive()))
        // Shows states more expensive than the one selected
        buttons.push(this.createButton("Show More Expensive", () => this.showMoreExpensive()))
        return buttons;
    }

    createButton(buttonName, lambda) {
        return (
            React.createElement(
                "button",
                {
                    key: buttonName,
                    onClick: lambda,
                    className: 'panelButton'
                },
                buttonName                
            )
        )
    }
    
    validateNumber(e){
        const re = /^[0-9\b]+$/;
        if(e.target.value === '' || re.test(e.target.value)){
            this.setState({salary: e.target.value})
        }
    }

    compareSalary(){
        let curSalary = this.state.salary;
        if (this.leftText.length > 1 && this.rightText.length > 1) {
            let sum1 = 0;
            let sum2 = 0;
            for (let i = 2; i < this.leftText.length; i+=2) {
                let state1 = String(this.leftText[i]).split("$");
                let state2 = String(this.rightText[i]).split("$");
                sum1 += parseInt(state1[1]);
                sum2 += parseInt(state2[1]);
            }
            if (curSalary === "") {
                return "_";
            }
            return '$' + String(parseInt((sum2 / sum1) * parseInt(curSalary)));
        }
        return "_";
    }

    selectedState() {
        if (this.leftText === "") {
            return "_";
        }
        return this.leftText[0];
    }

    compareState() {
        if (this.rightText === "") {
            return "_";
        }
        return this.rightText[0];
    }

    display(id, geo) {
        var index; var side;
        var thisState = document.getElementById(id);
        thisState.style.fill = COLORS.primaryAccent;
        if (this.x !== 0) {
            if (this.id.includes(id)) {
                index = this.id.indexOf(id)
                thisState.style.fill = COLORS.primary;
                this.x--;
                if (index === 0) {
                    this.leftText = this.rightText; this.rightText = ""; this.geo[0].fill = COLORS.primary; this.geo[0] = this.geo[1]; this.id[0] = this.id[1];
                    this.geo[1] = null; this.id[1] = null;
                }
                else {this.rightText = ""; this.geo[1].fill = COLORS.primary; this.geo[1] = null; this.id[1] = null;}
                this.forceUpdate();
                return;
            }
            else if (this.x !== 1) {
                this.id[1] = id;
                this.geo[1] = geo;
                side = "right";
            }
            else {
                index = this.id.indexOf(null)
                this.id[index] = id;
                this.geo[index] = geo;
                this.x++;
                if (index === 0) {side = "left";}
                else {side = "right";}
            }
        } else {
            side = "left";
            this.id[0] = id;
            this.geo[0] = geo;
            this.x++;
        }
        this.get(side, geo.properties.name);
        this.resetMapColors();
    }

    get(side, name) {
        fetch("http://localhost:80/get/" + name, {method: 'get'})
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                isLoaded: true,
                items: result.items
            });
            var displayText = [result.name,<br/>,
                "Annual Rent: $" + result.rent,<br/>,
                "Electricity: $" + result.electricity,<br/>,
                "Gas: $" + result.gas,<br/>,
                "Water: $" + result.water,<br/>,
                "Sewer: $" + result.sewer,<br/>,
                "Cable: $" + result.cable,<br/>,
                "Internet: $" + result.internet,
            ];
            if(side === "left"){
                this.leftText = displayText;
            }else if(side === "right"){
                this.rightText = displayText;
            }
            },
            (error) => {
            this.setState({
                isLoaded: true,
                error
            });
            }
        )
    }

    hoverEnter(state) {
        let leftState = translate[this.leftText[0]]
        let rightState = translate[this.rightText[0]]
        if (leftState != undefined && leftState == state) {
            return;
        }
        if (rightState != undefined && rightState == state) {
            return;
        }
        var thisState = document.getElementById(state);
        this.prevColor = thisState.style.fill;
        thisState.style.fill = COLORS.primaryHighlight;
    }

    hoverExit(state) {
        let leftState = translate[this.leftText[0]]
        let rightState = translate[this.rightText[0]]
        if (leftState != undefined && leftState == state) {
            return;
        }
        if (rightState != undefined && rightState == state) {
            return;
        }
        var thisState = document.getElementById(state);
        thisState.style.fill = this.prevColor;
    }

    resetMapColors() {
        fetch("http://localhost:80/get/ALL", {method: 'get'})
        .then(res => res.json())
        .then(
            (result) => {
                var curLeft = "";
                var curRight = "";
                if (this.leftText.length > 1){
                    curLeft = this.leftText[0];
                }
                if (this.rightText.length > 1){
                    curRight = this.rightText[0];
                }
                result.forEach(e => {
                    if(e.name !== curLeft && e.name !== curRight){
                        var thisState = document.getElementById(translate[e.name]);
                        thisState.style.fill = COLORS.primary;
                    }
                })
                this.forceUpdate();
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    render() {
        const utilityButtons = this.utilityButtons();
        return (
            <>
            <div id='sidePanel'>
                {utilityButtons}
            </div>
            <div id="mapGridContainer">
                <div id="leftResults">
                    <p>{this.leftText}</p>
                </div>
                <div id="map">
                <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                    {({ geographies }) => (
                    <>
                    {geographies.map(geo => (
                        <Geography
                        id={allStates.find(s => s.val === geo.id).id}
                        key={geo.rsmKey}
                        stroke={COLORS.primaryHighlight}
                        geography={geo}
                        fill={COLORS.primary}
                        // style={{
                        //     default: {fill: geo.fill},
                        //     hover: {fill: COLORS.primaryHighlight},
                        //     pressed: {fill: COLORS.primaryAccent},
                        // }}
                        onClick={() => this.display(allStates.find(s => s.val === geo.id).id, geo)}
                        onMouseEnter={() => this.hoverEnter(allStates.find(s => s.val === geo.id).id)}
                        onMouseLeave={() => this.hoverExit(allStates.find(s => s.val === geo.id).id)}
                    />
                ))}
                {geographies.map(geo => {
                    const centroid = geoCentroid(geo);
                    const cur = allStates.find(s => s.val === geo.id);
                    if (moveStates.includes(geo.properties.name)) {
                        if (geo.properties.name === "Florida") {
                            centroid[0] = -82;
                        }
                        else if (geo.properties.name === "Michigan") {
                            centroid[0] = -85;
                            centroid[1] = 43.4;
                        }
                        else if (geo.properties.name === "Louisiana") {
                            centroid[0] = -92.5;
                        }
                        else if (geo.properties.name === "Hawaii") {
                            centroid[0] = -158;
                            centroid[1] = 19.5;
                        }
                    }
                    return (
                        <g id={cur.id} key={geo.rsmKey + "-name"}>
                            {cur &&
                            centroid[0] > -160 &&
                            centroid[0] < -67 &&
                            (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                <Marker coordinates={centroid}>
                                    <text y="2" fontSize={14} textAnchor="middle" fill={COLORS.text} fontFamily="JosefinSansBold">
                                        {cur.id}
                                    </text>
                                </Marker>
                        ) : (
                            <Annotation
                                subject={centroid}
                                dx={offsets[cur.id][0]}
                                dy={offsets[cur.id][1]}
                                connectorProps={{
                                    stroke: COLORS.text,
                                }}
                            >
                                <text x={4} fontSize={14} alignmentBaseline="middle" fill={COLORS.text} fontFamily="JosefinSansBold">
                                    {cur.id}
                                </text>
                            </Annotation>
                        ))}
                        </g>
                    );
                })}
                </>
                )}
                </Geographies>
                </ComposableMap>
                </div>
                <div id="rightResults">
                    <p>{this.rightText}</p>
                </div>
                <div id="salaryComparison">
                    <p> A salary of&nbsp;   
                        <input value={this.state.salary} onChange={this.validateNumber} placeholder="Salary Amount" id="salaryInput"/>
                        &nbsp;in {this.selectedState()} is equivalent to a salary of {this.compareSalary()} in {this.compareState()}&nbsp;
                    </p>
                </div>
            </div>
            </>
        );
    };

};

export default MapChart;
