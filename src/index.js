import React, { render, Component } from './react';
const jsx = <div>
    <p>Hello Fiber</p>
    <p>Hi Fiber</p>
</div>

const root = document.getElementById('root');

render(jsx, root)

setTimeout(() => {
    const jsx = <div>
        <p>Hi React</p>
    </div>
    render(jsx, root)
}, 2000)
