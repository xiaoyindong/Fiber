import {
    updateNodeElement
} from '../DOM';
import {
    createTaskQueue,
    arrified,
    createStateNode,
    getTag,
    getRoot
} from '../Misc';
// 任务队列
const taskQueue = createTaskQueue();
// 要执行的子任务
let subTask = null;
// 存储即将渲染dom的fiber
let pendingCommit = null;

const commitAllWork = fiber => {
    // 循环 effets 数组 构建 DOM 节点树
    fiber.effects.forEach(item => {
        // 如果是类组件就将fiber备份存储到实例中
        if (item.tag === 'class_component') {
            // 处理的是类组件
            item.stateNode.__fiber = item;
        }
        // 删除操作
        if (item.effectTag === 'delete') {
            item.parent.stateNode.removeChild(item.stateNode);
        } else if (item.effectTag === 'update') {
            // 更新操作
            if (item.type === item.alternate.type) {
                // 节点类型相同
                updateNodeElement(item.stateNode, item, item.alternate);
            } else {
                // 节点类型不同
                item.parent.stateNode.replaceChild(item.stateNode, item.alternate.stateNode);
            }
        } else if (item.effectTag === 'placement') {
            // 向页面中追加节点
            // 当前要追加的子节点
            let fiber = item;
            // 当前要追加的子节点的父级
            let parentFiber = item.parent
            // 找到普通节点父级 排除组件父级 因为组件父级是不能直接追加真实DOM节点的
            while (parentFiber.tag === 'class_component' || parentFiber.tag === 'function_component') {
                parentFiber = parentFiber.parent;
            }
            // 如果子节点是普通节点 找到父级 将子节点追加到父级中
            if (fiber.tag === 'host_component') {
                parentFiber.stateNode.appendChild(fiber.stateNode);
            }
        }
    })
    // 备份旧的Fiber节点对象
    fiber.stateNode.__rootFiberContainer = fiber;
}

const getFirstTask = () => {
    // 从任务队列中获取任务
    const task = taskQueue.pop();
    if (task.from === 'class_component') {
        const root = getRoot(task.instance);
        // 将要更新的状态存储起来
        task.instance.__fiber.partialState = task.partialState;
        return {
            props: root.props,
            stateNode: root.stateNode,
            tag: 'host_root',
            effects: [],
            child: null,
            alternate: root // root就是备份
        };
    }
    // 返回最外层节点Fiber对象
    return {
        props: task.props,
        stateNode: task.dom,
        tag: 'host_root',
        effects: [],
        child: null,
        alternate: task.dom.__rootFiberContainer
    }
}

const reconcileChildren = (fiber, children) => {
    // 将children转换成数组
    const arrifiedChildren = arrified(children);
    // 循环 children 使用的索引
    let index = 0;
    // children 数组中元素的个数
    let numberOfElements = arrifiedChildren.length;
    // 循环过程中的循环项 就是子节点的 virtualDOM 对象
    let element = null;
    // 当前正在构建的的Fiber
    let newFiber = null;
    // 存储前一个节点，用于构建兄弟关系
    let prevFiber = null;

    let alternate = null;
    // 如果有对象就获取子节点
    if (fiber.alternate && fiber.alternate.child) {
        // 如果找得到这个子节点就是children数组中的第一个节点的备份节点
        alternate = fiber.alternate.child;
    }
    while (index < numberOfElements || alternate) {
        // 子级虚拟DOM对象
        element = arrifiedChildren[index];
        // 如果element不存在，alternate存在，就是删除
        if (!element && alternate) {
            // 删除节点
            alternate.effectTag = 'delete'
            // 添加到父级的effects数组中
            fiber.effects.push(alternate);
        } else if (element && alternate) {
            // 更新操作
            newFiber = {
                type: element.type,
                props: element.props,
                tag: getTag(element),
                effects: [],
                effectTag: 'update', // 新增
                parent: fiber,
                alternate,
            }
            if (element.type === alternate.type) {
                // 类型相同
                newFiber.stateNode = alternate.stateNode;
            } else {
                // 类型不同
                newFiber.stateNode = createStateNode(newFiber);
            }
        } else if (element && !alternate) {
            // 初始渲染
            // 子级fiber
            newFiber = {
                type: element.type,
                props: element.props,
                tag: getTag(element),
                effects: [],
                effectTag: 'placement', // 新增
                parent: fiber,
            }
            // 为fiber节点添加DOM对象或组件实例对象
            newFiber.stateNode = createStateNode(newFiber);
        }

        // 如果第一个子节点就赋值到fiber上
        if (index === 0) {
            fiber.child = newFiber;
        } else if (element) {
            // 否则放在前一个的兄弟节点上
            prevFiber.sibling = newFiber;
        }
        // 更新alternate
        if (alternate && alternate.sibling) {
            alternate = alternate.sibling;
        } else {
            alternate = null;
        }
        prevFiber = newFiber;
        index++;
    }
}

const executeTask = fiber => {
    // 构建子级fiber对象
    if (fiber.tag === 'class_component') {
        // 更新state
        if (fiber.stateNode.__fiber && fiber.stateNode.__fiber.partialState) {
            fiber.stateNode.state = {
                ...fiber.stateNode.state,
                ...fiber.stateNode.__fiber.partialState
            }
        }
        reconcileChildren(fiber, fiber.stateNode.render())
    } else if (fiber.tag === 'function_component') {
        reconcileChildren(fiber, fiber.stateNode(fiber.props))
    } else {
        reconcileChildren(fiber, fiber.props.children)
    }
    // 有子级返回子级
    if (fiber.child) {
        return fiber.child
    }
    // 存储当前正在处理的对象
    let currentExecutelyFiber = fiber;

    while (currentExecutelyFiber.parent) {
        currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(currentExecutelyFiber.effects.concat(currentExecutelyFiber))
        // 有同级返回同级
        if (currentExecutelyFiber.sibling) {
            return currentExecutelyFiber.sibling
        }
        // 没有同级将父级给到循环，循环检查父级
        currentExecutelyFiber = currentExecutelyFiber.parent
    }
    pendingCommit = currentExecutelyFiber;
}

const workLoop = deadline => {
    // 如果子任务不存在获取一个任务
    if (!subTask) {
        subTask = getFirstTask()
    }
    // 任务存在并且浏览器空余时间大于1ms执行任务
    while (subTask && deadline.timeRemaining() > 1) {
        // executeTask 方法执行任务 接受任务 返回新的任务
        subTask = executeTask(subTask);
    }
    // 执行第二阶段
    if (pendingCommit) {
        commitAllWork(pendingCommit)
    }
}

const performTask = deadline => {
    // 执行任务
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
    // 任务就是通过 vdom 对象 构建 fiber 对象
    // 2. 指定在浏览器空闲时执行任务
    requestIdleCallback(performTask)
}

export const scheduleUpdate = (instance, partialState) => {
    // 更新state的任务添加到任务队列中
    taskQueue.push({
        from: 'class_component',
        instance,
        partialState
    })
    // 指定在浏览器空闲时执行任务
    requestIdleCallback(performTask)
}