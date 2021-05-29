import React, { render, Component } from './react';
const jsx = <div>
    <p>Hello Fiber</p>
    <p>Hi Fiber</p>
</div>

const root = document.getElementById('root');

class Demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'yd'
        }
    }
    render() {
        return <div>
            <div>{this.state.name}</div>
            <button onClick={() => { this.setState({ name: 'yindong'})}}>button</button>
        </div>
    }
}

render(<Demo />, root)