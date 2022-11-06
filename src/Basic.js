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
        // This is the salary variables, changing the name breaks it
        this.state = {value: ''};
        this.validateNumber = this.validateNumber.bind(this);
        // TODO: Add fields to determine how much something costs
    }

    validateNumber(e){
        const re = /^[0-9\b]+$/;
        if(e.target.value === '' || re.test(e.target.value)){
            this.setState({value: e.target.value})
        }
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
                    this.leftText = [result.name,<br/>,
                        "Annual Rent: $" + result.rent,<br/>,
                        "Electricity: $" + result.electricity,<br/>,
                        "Gas: $" + result.gas,<br/>,
                        "Water: $" + result.water,<br/>,
                        "Sewer: $" + result.sewer,<br/>,
                        "Cable: $" + result.cable,<br/>,
                        "Internet: $" + result.internet,
                    ];
                    //TODO: Update one field to include all costs for state 1
                }else if(side === "right"){
                    this.rightText = [result.name,<br/>,
                        "Annual Rent: $" + result.rent,<br/>,
                        "Electricity: $" + result.electricity,<br/>,
                        "Gas: $" + result.gas,<br/>,
                        "Water: $" + result.water,<br/>,
                        "Sewer: $" + result.sewer,<br/>,
                        "Cable: $" + result.cable,<br/>,
                        "Internet: $" + result.internet,
                    ];
                    // TODO: Update one field to include all costs for state 2
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
    // TODO: Add functionality to this.compareSalary() to actually do calculations
    compareSalary(){
        const curSalary = this.state.value;
        return curSalary;
    }

    render () {
        const leftButtons = this.loopButtons("left");
        const rightButtons = this.loopButtons("right");
        const output = this.compareSalary() 
        return (
            <div id="gridContainer">
                <div id="leftButtons">
                    {leftButtons}
                </div>
                <div id="leftResults">
                    <p>{this.leftText}</p>
                </div>
                <div id="leftSalary">
                    <input value={this.state.value} onChange={this.validateNumber}/>
                </div>
                <div id="rightResults">
                    <p>{this.rightText}</p>
                </div>
                <div id="rightButtons">
                    {rightButtons}
                </div>
                <div id="rightResults">
                    <p>{this.rightText}</p>
                </div>
                <div id="rightSalary">
                    <input value={output} readOnly/>
                </div>
            </div>
        );
    };

}

export default Basic;