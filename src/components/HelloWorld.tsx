import * as React from 'react';

export interface IHelloWorldProps 
{ 
    compiler: string,
    framework: string,
}

export class HelloWorld extends React.Component<IHelloWorldProps, {}> {
    render() {
        return (
            <React.Fragment>
                <h1>{this.props.compiler} and {this.props.framework}</h1>
                <p>This means that the config is working.</p>
            </React.Fragment>
        )
    }
}