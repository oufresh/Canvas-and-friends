import * as React from 'react';
import './app.css';
import Canvas from './canvas';

class App extends React.Component
{
    constructor(props: any)
    {
        super(props);
    }

    render()
    {
        return (
            <div className="app-container">
                <div className="app-sidebar"></div>
                <Canvas />
            </div>
        );
    }
}

export default App;