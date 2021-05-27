import { createTaskQueue } from '../Misc';

const taskQueue = createTaskQueue();

export const render = (element, dom) => {
    // 1. 向任务队列中添加任务
    taskQueue.push({
        dom, // 父级
        props: {
            children: element // 子级
        }
    })
    console.log(taskQueue.pop());
    // 2. 指定在浏览器空闲时执行任务
}
