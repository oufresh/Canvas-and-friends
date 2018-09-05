import * as React from 'react';
import { appContainer } from './app.css';
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
            <div className={appContainer}>
                <Canvas />
            </div>
        );
    }
}

export default App;