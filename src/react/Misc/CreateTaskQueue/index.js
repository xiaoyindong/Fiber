const createTaskQueue = () => {
    const taskQueue = [];
    return {
        push: item => {
            return taskQueue.push(item);
        },
        pop: () => {
            return taskQueue.shift();
        }
    }
}

export default createTaskQueue;