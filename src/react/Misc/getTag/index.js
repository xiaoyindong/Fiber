import { Component } from '../../Component';
const getTag = vdom => {
    // 如果是普通节点
    if (typeof vdom.type === 'string') {
        return 'host_component'
    } else if (Object.getPrototypeOf(vdom.type) === Component) {
        // 如果是类组件
        return 'class_component'
    } else {
        // 函数组件
        return 'function_component'
    }
}

export default getTag;