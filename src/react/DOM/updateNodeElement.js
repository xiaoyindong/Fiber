export default function updateNodeElement(newElement, virtualDOM, oldVirtualDOM = {}) {
    // 获取节点对应的属性对象
    const newProps = virtualDOM.props || {};
    // 获取旧的属性对象
    const oldProps = oldVirtualDOM.props || {};
    Object.keys(newProps).forEach(propName => {
        // 新的属性值
        const newPropsValue = newProps[propName];
        // 旧的属性值
        const oldPropsValue = oldProps[propName];
        // 对比是否相同
        if (newPropsValue !== oldPropsValue) {
            // 判断是否是事件属性
            if (propName.startsWith('on')) {
                // 截取出事件名称
                const eventName = propName.toLowerCase().slice(2);
                // 为元素添加事件
                newElement.addEventListener(eventName, newPropsValue);
                // 如果存在原有事件，需要删除掉。
                if (oldPropsValue) {
                    newElement.removeEventListener(eventName, oldPropsValue);
                }
            } else if (propName === 'value' || propName === 'checked') {
                // 如果属性名是value或者checked不能使用setAttribute来设置，直接以属性方式设置即可
                newElement[propName] = newPropsValue;
            } else if (propName !== 'children') {
                // 排除children
                if (propName === 'className') {
                    newElement.setAttribute('class', newPropsValue)
                } else {
                    newElement.setAttribute(propName, newPropsValue)
                }
            }
        }
    })
    // 判断属性被删除的情况
    Object.keys(oldProps).forEach(propName => {
        // 新的属性值
        const newPropsValue = newProps[propName];
        // 旧的属性值
        const oldPropsValue = oldProps[propName];
        if (!newPropsValue) {
            // 判断是否是事件属性
            if (propName.startsWith('on')) {
                 // 截取出事件名称
                 const eventName = propName.toLowerCase().slice(2);
                 // 删除事件
                 newElement.removeEventListener(eventName, oldPropsValue);
            } else if (propName !== 'children') {
                newElement.removeAttribute(propName);
            }
        }
    })
}