import React, { Component } from 'react';
import "./basic.css";

class Basic extends Component {
    constructor(props) {
        super(props);
        this.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", 
                        "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
                        "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
                        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
                        "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
                        "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
                        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
                        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
                        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
                        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
        this.leftText = "";
        this.rightText = "";
    }

    loopButtons(side) {
        const buttons = [];
        for (let i = 0; i < this.states.length; i++) {
            buttons.push(this.createButtons(this.states[i], side));
        }
        return buttons;
    }

    createButtons(name, side) {
        return (
            React.createElement(
                "button",
                {
                    key: name,
                    onClick: () => this.handleClick(name, side)
                },
                name                
            )
        )
    }

    handleClick(name, side) {
        fetch("http://localhost:80/get/" + name, {method: 'get'})
            .then(res => res.json())
            .then(
                (result) => {
                this.setState({
                    isLoaded: true,
                    items: result.items
                });
                if(side === "left"){
                    this.leftText = [result.name,
                        <br/>,
                        "Annual Rent: $" + result.rent,
                        <br/>,
                        "Electricity: $" + result.electricity,
                        <br/>,
                        "Gas: $" + result.gas,
                        <br/>,
                        "Water: $" + result.water,
                        <br/>,
                        "Sewer: $" + result.sewer,
                        <br/>,
                        "Cable: $" + result.cable,
                        <br/>,
                        "Internet: $" + result.internet,
                    ];
                }else if(side === "right"){
                    this.rightText = [result.name,
                        <br/>,
                        "Annual Rent: $" + result.rent,
                        <br/>,
                        "Electricity: $" + result.electricity,
                        <br/>,
                        "Gas: $" + result.gas,
                        <br/>,
                        "Water: $" + result.water,
                        <br/>,
                        "Sewer: $" + result.sewer,
                        <br/>,
                        "Cable: $" + result.cable,
                        <br/>,
                        "Internet: $" + result.internet,
                    ];
                }
                
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

    render () {
        const leftButtons = this.loopButtons("left");
        const rightButtons = this.loopButtons("right");
        return (
            <div id="gridContainer">
                <div id="leftButtons">
                    {leftButtons}
                </div>
                <div id="leftResults">
                    <p>{this.leftText}</p>
                </div>
                <div id="rightResults">
                    <p>{this.rightText}</p>
                </div>
                <div id="rightButtons">
                    {rightButtons}
                </div>
            </div>
        );
    };

}

export default Basic;