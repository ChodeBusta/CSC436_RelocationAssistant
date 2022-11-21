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
import './style.css'

// Counties 
// const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/higher-quality-5m/5m-US-counties.json";

// US States
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
    VT: [50, -8],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21]
};

class MapChart extends Component {
    constructor(props) {
        super(props);
        this.x = 0;
        this.id = [];
        this.geo = [];
        this.leftText = [];
        this.rightText = [];
        this.state = {value: ''};
        this.validateNumber = this.validateNumber.bind(this);
        this.id.push(null); this.id.push(null); this.geo.push(null); this.geo.push(null);
    }

    render() {
        return (
            <>
            <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                    {({ geographies }) => (
                    <>
                    {geographies.map(geo => (
                        <Geography
                        id={allStates.find(s => s.val === geo.id).id}
                        key={geo.rsmKey}
                        stroke="#FFFFFF"
                        geography={geo}
                        fill="#DDDDDD"
                        style={{
                            default: {fill: geo.fill},
                            hover: {fill: "#ADD8E6"},
                            pressed: {fill: "#F9F900"},
                        }}
                        onClick={() => this.display(allStates.find(s => s.val === geo.id).id, geo)}
                    />
                ))}
                {geographies.map(geo => {
                    const centroid = geoCentroid(geo);
                    const cur = allStates.find(s => s.val === geo.id);
                    return (
                        <g id={cur.id} key={geo.rsmKey + "-name"}>
                            {cur &&
                            centroid[0] > -160 &&
                            centroid[0] < -67 &&
                            (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                <Marker coordinates={centroid}>
                                <text y="2" fontSize={14} textAnchor="middle">
                                    {cur.id}
                                </text>
                        </Marker>
                        ) : (
                            <Annotation
                                subject={centroid}
                                dx={offsets[cur.id][0]}
                                dy={offsets[cur.id][1]}
                            >
                            <text x={4} fontSize={14} alignmentBaseline="middle">
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
            <div id="mapGridContainer">
                <div id="leftResults">
                    <p>{this.leftText}</p>
                </div>
                <div id="rightResults">
                    <p>{this.rightText}</p>
                </div>
                <div id="salaryComparison">
                    <p>
                        <input value={this.state.value} onChange={this.validateNumber}/>
                        &nbsp;is equivalent to a salary of&nbsp;
                        <input value={this.compareSalary()} readOnly/>
                    </p>
                </div>
            </div>
            </>
        );
    };
    
    validateNumber(e){
        const re = /^[0-9\b]+$/;
        if(e.target.value === '' || re.test(e.target.value)){
            this.setState({value: e.target.value})
        }
    }

    compareSalary(){
        let curSalary = this.state.value;
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
                return "";
            }
            return String(parseInt((sum2 / sum1) * parseInt(curSalary)));
        }
        return curSalary;
    }

    display(id, geo) {
        var index; var side;
        if (this.x !== 0) {
            if (this.id.includes(id)) {
                index = this.id.indexOf(id)
                this.geo[index].fill = "#DDDDDD"
                this.id[index] = null;
                this.geo[index] = null;
                this.x--;
                if (index === 0) {this.leftText = "";}
                else {this.rightText = "";}
                this.forceUpdate();
                return;
            }
            else if (this.x !== 1) {
                this.geo[1].fill = "#DDDDDD"
                geo.fill = "#797979"
                this.id[1] = id;
                this.geo[1] = geo;
                side = "right";
            }
            else {
                index = this.id.indexOf(null)
                this.id[index] = id;
                this.geo[index] = geo;
                geo.fill = "#797979"
                this.x++;
                if (index === 0) {side = "left";}
                else {side = "right";}
            }
        } else {
            side = "left";
            this.id[0] = id;
            this.geo[0] = geo;
            this.x++;
            geo.fill = "#797979"
        }
        this.get(side, geo.properties.name);
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
};

export default MapChart;