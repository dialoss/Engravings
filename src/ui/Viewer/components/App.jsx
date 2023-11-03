import React from 'react';
import Viewer from './Viewer';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.wrapper = null;
        this.state = {
            camera: null,
            selectedIds: []
        };
    }

    render() {
        const { token, urn, className } = this.props;
        return (
            <div className={"app " + className}>
                <div style={{ position: 'relative'}}>
                    <Viewer
                        runtime={{ accessToken: token }}
                        urn={urn}
                        selectedIds={this.state.selectedIds}
                        onCameraChange={({ viewer, camera }) => this.setState({ camera: camera.getWorldPosition() })}
                        onSelectionChange={({ viewer, ids }) => this.setState({ selectedIds: ids })}
                        ref={ref => this.wrapper = ref}
                    />
                </div>
            </div>
        );
    }
}

export default App;
