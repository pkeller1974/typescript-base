import * as React from 'react';

export interface IHelloWorldProps 
{ 
    compiler: string,
    framework: string,
}

export class HelloWorld extends React.Component<IHelloWorldProps, {}> {
    render() {
        return (
            <h1>{this.props.compiler} and {this.props.framework} </h1>
        )
    }
}