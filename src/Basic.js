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
                        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
        this.text = "";
    }

    loopButtons() {
        const buttons = [];
        for (let i = 0; i < this.states.length; i++) {
            buttons.push(this.createButtons(this.states[i]));
        }
        return buttons;
    }

    createButtons(name) {
        return (
            React.createElement(
                "button",
                {
                    key: name,
                    onClick: () => this.handleClick(name)
                },
                name                
            )
        )
    }

    handleClick(name) {
        fetch("http://localhost:80/get/" + name, {method: 'get'})
            .then(res => res.json())
            .then(
                (result) => {
                this.setState({
                    isLoaded: true,
                    items: result.items
                });
                this.text = [
                    result.name,
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
        const buttons = this.loopButtons();
        return (
            <div id="gridContainer">
                <div id="leftButtons">
                    {buttons}
                </div>
                <div id="leftResults">
                    <p>{this.text}Testing</p>
                </div>
                <div id="rightResults">
                    <p>{this.text}Testing</p>
                </div>
                <div id="rightButtons">
                    {buttons}
                </div>
            </div>
        );
    };

}

export default Basic;