import React, { Component } from 'react';

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
        this.text = name;
        this.forceUpdate();
    }

    render () {
        const buttons = this.loopButtons();
        return (
            <div>
                <br></br>
                    {buttons}
                <br></br>
                <br></br>
                <p>{this.text}</p>
            </div>
        );
    };

}

export default Basic;