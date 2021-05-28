import { createDOMElement } from '../../DOM'
import { createReactInstance } from '../createReactInstance';

const createStateNode = fiber => {
    // 普通节点
    if (fiber.tag === 'host_component') {
        return createDOMElement(fiber)
    } else {
        // 组件
        return createReactInstance(fiber)
    }
}

export default createStateNode;