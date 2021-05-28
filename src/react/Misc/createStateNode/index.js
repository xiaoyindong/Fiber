import { createDOMElement } from '../../DOM'

const createStateNode = fiber => {
    // 普通节点
    if (fiber.tag === 'host_component') {
        return createDOMElement(fiber)
    }
}

export default createStateNode;