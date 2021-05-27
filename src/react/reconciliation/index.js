import {
    createTaskQueue
} from '../Misc';

const taskQueue = createTaskQueue();

let subTask = null;

const getFirstTask = () => {
    // 从任务队列中获取任务
}

const workLoop = deadline => {
    // 如果子任务不存在获取一个任务
    if (!subTask) {
        subTask = getFirstTask()
    }
    // 任务存在并且浏览器空余时间大于1ms执行任务
    while (subTask && deadline.timeRemaining() > 1) {
        subTask = executeTask(subTask);
    }
}

const performTask = deadline => {
    workLoop(deadline);
    // 判断任务是否存在，判断队列中是否有任务没有执行
    if (subTask || !taskQueue.isEmpty()) {
        requestIdleCallback(performTask)
    }
}

export const render = (element, dom) => {
    // 1. 向任务队列中添加任务
    taskQueue.push({
        dom, // 父级
        props: {
            children: element // 子级
        }
    })
    // 2. 指定在浏览器空闲时执行任务
    requestIdleCallback(performTask)
}