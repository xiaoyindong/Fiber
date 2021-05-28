import React, { render, Component } from './react';
const jsx = <div>
    <p>Hello Fiber</p>
    <p>Hi Fiber</p>
</div>

const root = document.getElementById('root');

// render(jsx, root)

class Demo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>{this.props.title}</div>
    }
}

// function Demo(props) {
//     return <div>{props.title}</div>
// }

render(<Demo title="class"/>, root)