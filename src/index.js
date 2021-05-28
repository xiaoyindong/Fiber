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
        return <div>yindong</div>
    }
}

render(<Demo />, root)