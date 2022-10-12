import React, { Component } from 'react';
import Basic from './Basic';
import Map from './Map';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleMap = this.handleMapClick.bind(this);
        this.handleBasic = this.handleBasicClick.bind(this);
        this.state = {version: <Map />};
    }

    handleMapClick = () => {
        this.setState({version: <Map />});
    };

    handleBasicClick = () => {
        this.setState({version: <Basic />});
    };

    render() {
        return (
            <div>
                <h1>Relocation Assistant</h1>
                <button onClick={this.handleMapClick}>Map Version</button>
                <button onClick={this.handleBasicClick}>Basic Version</button>
                {this.state.version}
            </div>
        );
    }
}

export default App;
