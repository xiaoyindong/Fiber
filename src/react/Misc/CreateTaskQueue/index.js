const createTaskQueue = () => {
    const taskQueue = [];
    return {
        push: item => { // 向任务队列中添加任务
            return taskQueue.push(item);
        },
        pop: () => { // 从任务队列中获取任务
            return taskQueue.shift();
        },
        isEmpty: () => { // 判断是否存在任务
            taskQueue.length === 0
        }
    }
}

export default createTaskQueue;