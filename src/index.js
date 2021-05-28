import React, { render } from './react';
const jsx = <div>
    <p>Hello Fiber</p>
    <p>Hi Fiber</p>
</div>

const root = document.getElementById('root');

render(jsx, root)