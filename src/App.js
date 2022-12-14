import React, { Component } from 'react';
import Map from './Map';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {version: <Map />};
    }

    render() {
        return (
            <div onMouseMove={this.openSidePanel}>
                <h1 id='title'>Relocation Assistant</h1>
                {this.state.version}
            </div>
        );
    }

    openSidePanel = event => {
        var sidePanel;
        if (event.clientX > window.innerWidth / 1.05) {
            sidePanel = document.getElementById('sidePanel');
            sidePanel.style.display = "block";
            sidePanel.className = "openSidePanel"
        }
        else if (event.clientX < window.innerWidth / 1.30) {
            sidePanel = document.getElementById('sidePanel');
            sidePanel.className = "closeSidePanel"
        }
    }
}

export default App;
