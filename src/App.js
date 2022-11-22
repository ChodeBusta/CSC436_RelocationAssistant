import React, { Component } from 'react';
import Map from './Map';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {version: <Map />};
    }

    render() {
        return (
            <div>
                <h1 id='title'>Relocation Assistant</h1>
                {this.state.version}
            </div>
        );
    }
}

export default App;
